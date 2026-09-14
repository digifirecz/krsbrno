'use server';

import * as data from '@/lib/data/roles';
import type { Role, RoleEntry, RoleDefinition } from '@/lib/roles';
import { requireAdmin, requireSession } from '@/lib/auth/session';

// Any logged-in admin-panel user needs to know their own role to render the
// sidebar correctly, so this only requires a session, not the admin role itself.
export async function getRole(email: string): Promise<Role> {
  await requireSession();
  return data.getRole(email);
}

export async function getAllRoles(): Promise<RoleEntry[]> {
  await requireAdmin();
  return data.getAllRoles();
}

export async function setRole(email: string, role: Role, actor?: string | null): Promise<RoleEntry> {
  await requireAdmin();
  return data.setRole(email, role, actor);
}

export async function deleteRole(email: string): Promise<void> {
  await requireAdmin();
  return data.deleteRole(email);
}

export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  await requireSession();
  return data.getRoleDefinitions();
}
