import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq, lt, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, passwordResetTokens, loginLockouts } from '@/lib/db/schema';

const BCRYPT_COST = 12;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hodina

export const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minut
const FAILURE_WINDOW_MS = 15 * 60 * 1000; // po 15 min bez pokusu se počítadlo bere jako vypršelé

// Náhradní hash jen pro to, aby bcrypt.compare běžel i pro neexistující účet
// — jinak by odpověď pro "e-mail neexistuje" byla nápadně rychlejší než pro
// "e-mail existuje, špatné heslo" a šlo by podle času zjistit, které e-maily
// appka zná (i bez uhodnutí hesla).
const DUMMY_HASH = bcrypt.hashSync('tento-hash-nikdy-nikomu-nepatri', BCRYPT_COST);

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const [row] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
  const hash = row?.passwordHash || DUMMY_HASH;
  const ok = await bcrypt.compare(password, hash);
  return ok && !!row?.passwordHash;
}

// Vrací null, pokud lze pokus provést; jinak Date, do kdy je účet zablokovaný.
export async function checkLoginLockout(email: string): Promise<Date | null> {
  const key = email.trim().toLowerCase();
  const [row] = await db.select().from(loginLockouts).where(eq(loginLockouts.email, key)).limit(1);
  if (!row) return null;
  if (row.lockedUntil && row.lockedUntil.getTime() > Date.now()) return row.lockedUntil;
  return null;
}

// Atomicky započítá jeden pokus o přihlášení (voláno PŘED ověřením hesla, ne
// až po neúspěchu) — čtení a zápis počítadla musí proběhnout jako jeden SQL
// příkaz, jinak by souběžně poslané požadavky (např. hodně paralelních
// dotazů najednou) mohly číst stejnou "starou" hodnotu dřív, než ji kdokoliv
// stihne zapsat, a počítadlo by se fakticky vůbec nezvyšovalo. Postgres
// zamkne řádek pro danou e-mailovou adresu na dobu zápisu, takže souběžné
// pokusy se serializují a žádný se neztratí.
// Vrací aktuální počet neúspěšných pokusů v této sérii (po připočtení tohoto).
export async function recordLoginAttempt(email: string): Promise<number> {
  const key = email.trim().toLowerCase();

  // Opportunistic cleanup, same pattern as password-reset tokens — keeps the
  // table from growing forever from bots trying random/one-off email addresses.
  await db.delete(loginLockouts).where(lt(loginLockouts.lastAttemptAt, new Date(Date.now() - FAILURE_WINDOW_MS)));

  const [row] = await db.execute<{ failed_count: number }>(sql`
    INSERT INTO login_lockouts (email, failed_count, last_attempt_at, locked_until)
    VALUES (${key}, 1, now(), NULL)
    ON CONFLICT (email) DO UPDATE SET
      failed_count = CASE
        WHEN login_lockouts.last_attempt_at < now() - INTERVAL '15 minutes' THEN 1
        ELSE login_lockouts.failed_count + 1
      END,
      last_attempt_at = now(),
      locked_until = CASE
        WHEN (CASE WHEN login_lockouts.last_attempt_at < now() - INTERVAL '15 minutes' THEN 1 ELSE login_lockouts.failed_count + 1 END) >= ${MAX_FAILED_ATTEMPTS}
        THEN now() + INTERVAL '15 minutes'
        ELSE NULL
      END
    RETURNING failed_count
  `);
  return row.failed_count;
}

export async function clearLoginLockout(email: string): Promise<void> {
  await db.delete(loginLockouts).where(eq(loginLockouts.email, email.trim().toLowerCase()));
}

export async function setPassword(
  email: string,
  password: string,
  actor?: string | null,
  requireChange = false,
): Promise<void> {
  const key = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const now = new Date();
  await db
    .update(users)
    .set({ passwordHash, mustChangePassword: requireChange, updatedAt: now, updatedBy: actor || null })
    .where(eq(users.email, key));
}

export async function getMustChangePassword(email: string): Promise<boolean> {
  const [row] = await db
    .select({ mustChangePassword: users.mustChangePassword })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return row?.mustChangePassword ?? false;
}

// Self-service change: requires knowing the current password (unlike an
// admin's reset), so a merely-open/hijacked session alone can't take over
// the account.
export async function changeOwnPassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const valid = await verifyPassword(email, currentPassword);
  if (!valid) return { ok: false, error: 'Současné heslo není správně.' };
  if (!newPassword || newPassword.length < 8) return { ok: false, error: 'Nové heslo musí mít alespoň 8 znaků.' };
  await setPassword(email, newPassword, email, false);
  return { ok: true };
}

// Vrací token, nebo null pokud účet neexistuje (volající si rozhodne, jestli
// to prozradit — requestPasswordReset to schválně nedělá, kvůli enumeraci).
export async function createResetToken(email: string): Promise<string | null> {
  const key = email.trim().toLowerCase();
  const [user] = await db.select({ email: users.email }).from(users).where(eq(users.email, key)).limit(1);
  if (!user) return null;

  await db.delete(passwordResetTokens).where(lt(passwordResetTokens.expiresAt, new Date()));

  const token = randomBytes(32).toString('hex');
  const now = new Date();
  await db.insert(passwordResetTokens).values({
    token,
    email: key,
    expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS),
    createdAt: now,
  });
  return token;
}

// Jednorázové použití: řádek se smaže bez ohledu na to, jestli je platný.
export async function consumeResetToken(token: string): Promise<string | null> {
  const [row] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
  if (!row) return null;
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
  if (row.expiresAt.getTime() < Date.now()) return null;
  return row.email;
}
