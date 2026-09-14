// Shared types for service recordings ("Záznamy"). Implementation lives in
// lib/data/sermons.ts (server, Drizzle); client components reach it through
// lib/actions/sermons.ts.

export interface SermonTaxon {
  id: string;
  name: string;
  order: number;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export type SermonCategory = SermonTaxon;
export type SermonSpeaker = SermonTaxon;

export interface Sermon {
  id: string;
  title: string;
  speakerId?: string | null;
  date?: Date | null;
  categoryId?: string | null;
  description?: string | null;
  audioUrl?: string | null;
  youtubeUrl?: string | null;
  visible: boolean;
  order: number;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export type SermonPatch = Partial<
  Omit<Sermon, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
>;
