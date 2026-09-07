// Shared types for admin access control. Implementation lives in
// lib/data/roles.ts (server, Drizzle); client components reach it through
// lib/actions/roles.ts.

export type Role = string; // ids come from role_definitions ('admin', 'sprava', …)

export interface RoleEntry {
  email: string;
  role: Role;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export interface RoleDefinition {
  id: string;
  label: string;
  order?: number;
}
