import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, passwordResetTokens } from '@/lib/db/schema';

const BCRYPT_COST = 12;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hodina

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const [row] = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
  if (!row?.passwordHash) return false;
  return bcrypt.compare(password, row.passwordHash);
}

export async function setPassword(email: string, password: string, actor?: string | null): Promise<void> {
  const key = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const now = new Date();
  await db
    .update(users)
    .set({ passwordHash, updatedAt: now, updatedBy: actor || null })
    .where(eq(users.email, key));
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
