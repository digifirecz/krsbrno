// Shared types + pure helpers for pages. Implementation lives in
// lib/data/pages.ts (server, Drizzle); client components reach it through
// lib/actions/pages.ts.

export interface CustomPage {
  id: string;
  label: string;
  protected?: boolean;
}

export interface PageSlugEntry {
  id: string;
  slug: string;
}

export interface PageNavEntry {
  id: string;
  label: string;
  showInHeader: boolean;
  showInFooter: boolean;
  headerGroupId: string;
  headerGroupLabel: string;
  headerIcon?: string;
  protected: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  order?: number;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export interface ManagedPage {
  id: string;
  label: string;
  protected: boolean;
  builtIn: boolean;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
