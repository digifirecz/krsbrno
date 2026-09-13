// Shared type for reusable content sections. Implementation lives in
// lib/data/sections.ts (server, Drizzle); client components reach it through
// lib/actions/sections.ts.

import type { BlockType, BlockData } from '@/lib/blocks/types';

export interface Section {
  id: string;
  name: string;
  type: BlockType;
  data: BlockData;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}
