import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, roles } from '@/lib/db/schema';
import type { Role, RoleEntry, RoleDefinition } from '@/lib/roles';

const DEFAULT_ROLE: Role = 'sprava';

// Role for a signed-in user, looked up by e-mail. Unknown accounts get the
// least-privileged role.
export async function getRole(email: string): Promise<Role> {
  if (!email) return DEFAULT_ROLE;
  const [row] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return (row?.role as Role) || DEFAULT_ROLE;
}

export async function getAllRoles(): Promise<RoleEntry[]> {
  const rows = await db.select().from(users).orderBy(asc(users.email));
  return rows.map((d) => ({
    email: d.email,
    role: (d.role as Role) || DEFAULT_ROLE,
    createdAt: d.createdAt ?? null,
    createdBy: d.createdBy ?? null,
    updatedAt: d.updatedAt ?? null,
    updatedBy: d.updatedBy ?? null,
  }));
}

export async function setRole(email: string, role: Role, actor?: string | null): Promise<RoleEntry> {
  const key = email.trim().toLowerCase();
  if (!key || !key.includes('@')) throw new Error('Zadejte platný e-mail.');
  const now = new Date();
  await db
    .insert(users)
    .values({ email: key, role, createdAt: now, createdBy: actor || null, updatedAt: now, updatedBy: actor || null })
    .onDuplicateKeyUpdate({ set: { role, updatedAt: now, updatedBy: actor || null } });
  const [row] = await db.select().from(users).where(eq(users.email, key)).limit(1);
  return {
    email: key,
    role: (row?.role as Role) || role,
    createdAt: row?.createdAt ?? now,
    createdBy: row?.createdBy ?? actor ?? null,
    updatedAt: row?.updatedAt ?? now,
    updatedBy: row?.updatedBy ?? actor ?? null,
  };
}

export async function deleteRole(email: string): Promise<void> {
  await db.delete(users).where(eq(users.email, email.trim().toLowerCase()));
}

export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  const rows = await db.select().from(roles).orderBy(asc(roles.order), asc(roles.label));
  return rows.map((d) => ({ id: d.id, label: d.label || d.id, order: d.order ?? 0 }));
}
