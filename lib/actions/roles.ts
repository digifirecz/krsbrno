'use server';

import * as data from '@/lib/data/roles';
import type { Role, RoleEntry, RoleDefinition } from '@/lib/roles';
import { requireAdmin, requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Any logged-in admin-panel user needs to know their own role to render the
// sidebar correctly, so this only requires a session, not the admin role itself.
export const getRole = withAction('roles.getRole', async (email: string): Promise<Role> => {
  await requireSession();
  return data.getRole(email);
});

export const getAllRoles = withAction('roles.getAllRoles', async (): Promise<RoleEntry[]> => {
  await requireAdmin();
  return data.getAllRoles();
});

export const setRole = withAction('roles.setRole', async (email: string, role: Role, actor?: string | null): Promise<RoleEntry> => {
  await requireAdmin();
  return data.setRole(email, role, actor);
});

export const deleteRole = withAction('roles.deleteRole', async (email: string): Promise<void> => {
  await requireAdmin();
  return data.deleteRole(email);
});

export const getRoleDefinitions = withAction('roles.getRoleDefinitions', async (): Promise<RoleDefinition[]> => {
  await requireSession();
  return data.getRoleDefinitions();
});
