'use server';

import * as data from '@/lib/data/auth';
import { getRole } from '@/lib/data/roles';
import { createSession, getSession, clearSession } from '@/lib/auth/session';
import { sendEmail } from '@/lib/email';

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const key = email.trim().toLowerCase();
  if (!key || !password) return { ok: false, error: 'Prosím vyplňte e-mail i heslo.' };

  const valid = await data.verifyPassword(key, password);
  if (!valid) return { ok: false, error: 'Nesprávný e-mail nebo heslo.' };

  const role = await getRole(key);
  await createSession({ email: key, role });
  return { ok: true };
}

export async function logout(): Promise<void> {
  await clearSession();
}

export async function getCurrentUser() {
  return getSession();
}

// Vždy tichý úspěch — neprozrazuje, jestli účet existuje.
export async function requestPasswordReset(email: string): Promise<void> {
  const key = email.trim().toLowerCase();
  if (!key) return;
  const token = await data.createResetToken(key);
  if (!token) return;

  const link = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await sendEmail({
    to: key,
    subject: 'Obnova hesla — Křesťanský sbor Brno',
    text: `Pro nastavení nového hesla klikněte na odkaz (platný 1 hodinu):\n\n${link}\n\nPokud jste o obnovu hesla nežádali, tento e-mail ignorujte.`,
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: 'Heslo musí mít alespoň 8 znaků.' };
  }
  const email = await data.consumeResetToken(token);
  if (!email) return { ok: false, error: 'Odkaz pro obnovu hesla je neplatný nebo vypršel.' };

  await data.setPassword(email, newPassword);
  return { ok: true };
}

// Admin nastaví/resetuje heslo jinému uživateli přímo v administraci.
export async function adminSetPassword(email: string, newPassword: string, actorEmail?: string | null): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { ok: false, error: 'Nemáte oprávnění.' };
  if (!newPassword || newPassword.length < 8) return { ok: false, error: 'Heslo musí mít alespoň 8 znaků.' };

  await data.setPassword(email, newPassword, actorEmail ?? session.email);
  return { ok: true };
}
