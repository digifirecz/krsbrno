'use server';

import * as data from '@/lib/data/roles';
import type { Role, RoleEntry, RoleDefinition } from '@/lib/roles';

export async function getRole(email: string): Promise<Role> {
  return data.getRole(email);
}

export async function getAllRoles(): Promise<RoleEntry[]> {
  return data.getAllRoles();
}

export async function setRole(email: string, role: Role, actor?: string | null): Promise<RoleEntry> {
  return data.setRole(email, role, actor);
}

export async function deleteRole(email: string): Promise<void> {
  return data.deleteRole(email);
}

export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  return data.getRoleDefinitions();
}
