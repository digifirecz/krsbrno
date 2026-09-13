'use server';

import * as data from '@/lib/data/sections';
import type { BlockType, BlockData } from '@/lib/blocks/types';
import type { Section } from '@/lib/sections';

export async function getSections(): Promise<Section[]> {
  return data.getSections();
}

export async function getSection(id: string): Promise<Section | null> {
  return data.getSection(id);
}

export async function createSection(name: string, type: BlockType, createdBy?: string | null): Promise<string> {
  return data.createSection(name, type, createdBy);
}

export async function updateSection(
  id: string,
  patch: { name?: string; data?: BlockData },
  updatedBy?: string | null,
): Promise<void> {
  return data.updateSection(id, patch, updatedBy);
}

export async function deleteSection(id: string): Promise<void> {
  return data.deleteSection(id);
}
