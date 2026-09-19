'use server';

import * as data from '@/lib/data/sections';
import type { BlockType, BlockData } from '@/lib/blocks/types';
import type { Section } from '@/lib/sections';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Admin-only everywhere (public pages render blocks via getPageBlocks, not these).
export const getSections = withAction('sections.getSections', async (): Promise<Section[]> => {
  await requireSession();
  return data.getSections();
});

export const getSection = withAction('sections.getSection', async (id: string): Promise<Section | null> => {
  await requireSession();
  return data.getSection(id);
});

export const createSection = withAction('sections.createSection', async (name: string, type: BlockType, createdBy?: string | null): Promise<string> => {
  await requireSession();
  return data.createSection(name, type, createdBy);
});

export const updateSection = withAction('sections.updateSection', async (id: string, patch: { name?: string; data?: BlockData }, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateSection(id, patch, updatedBy);
});

export const deleteSection = withAction('sections.deleteSection', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteSection(id);
});
