'use server';

import * as data from '@/lib/data/sections';
import type { BlockType, BlockData } from '@/lib/blocks/types';
import type { Section } from '@/lib/sections';
import { requireSession } from '@/lib/auth/session';

// Admin-only everywhere (public pages render blocks via getPageBlocks, not these).
export async function getSections(): Promise<Section[]> {
  await requireSession();
  return data.getSections();
}

export async function getSection(id: string): Promise<Section | null> {
  await requireSession();
  return data.getSection(id);
}

export async function createSection(name: string, type: BlockType, createdBy?: string | null): Promise<string> {
  await requireSession();
  return data.createSection(name, type, createdBy);
}

export async function updateSection(
  id: string,
  patch: { name?: string; data?: BlockData },
  updatedBy?: string | null,
): Promise<void> {
  await requireSession();
  return data.updateSection(id, patch, updatedBy);
}

export async function deleteSection(id: string): Promise<void> {
  await requireSession();
  return data.deleteSection(id);
}
