// Shared types for articles ("Aktuality" cards). Implementation lives in
// lib/data/articles.ts (server, Drizzle) and is exposed to client components
// through lib/actions/articles.ts.

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  dateText: string;
  timeText?: string | null;
  location?: string | null;
  image?: string | null;
  focalX?: number;
  focalY?: number;
  zoom?: number;
  visible: boolean;
  order: number;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export type ArticlePatch = Partial<Omit<Article, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>;
