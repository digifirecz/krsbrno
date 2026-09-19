'use server';

// RPC layer for 'use client' admin screens. Server components should import
// lib/data/sermons directly.

import * as data from '@/lib/data/sermons';
import type { Sermon, SermonPatch, SermonCategory, SermonSpeaker } from '@/lib/sermons';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Public — the Kázání page (SermonsSection) reads categories/speakers/sermons directly.
export const getSermonCategories = withAction('sermons.getSermonCategories', async (): Promise<SermonCategory[]> => {
  return data.getSermonCategories();
});

export const createSermonCategory = withAction('sermons.createSermonCategory', async (name: string, createdBy?: string | null): Promise<SermonCategory> => {
  await requireSession();
  return data.createSermonCategory(name, createdBy);
});

export const updateSermonCategory = withAction('sermons.updateSermonCategory', async (id: string, patch: { name?: string; order?: number }, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateSermonCategory(id, patch, updatedBy);
});

export const deleteSermonCategory = withAction('sermons.deleteSermonCategory', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteSermonCategory(id);
});

export const getSermonSpeakers = withAction('sermons.getSermonSpeakers', async (): Promise<SermonSpeaker[]> => {
  return data.getSermonSpeakers();
});

export const createSermonSpeaker = withAction('sermons.createSermonSpeaker', async (name: string, createdBy?: string | null): Promise<SermonSpeaker> => {
  await requireSession();
  return data.createSermonSpeaker(name, createdBy);
});

export const updateSermonSpeaker = withAction('sermons.updateSermonSpeaker', async (id: string, patch: { name?: string; order?: number }, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateSermonSpeaker(id, patch, updatedBy);
});

export const deleteSermonSpeaker = withAction('sermons.deleteSermonSpeaker', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteSermonSpeaker(id);
});

// Public — always forces visibleOnly so hidden/draft records are never sent
// to anonymous callers, regardless of what a caller passes in.
export const getSermons = withAction('sermons.getSermons', async (opts?: { categoryId?: string }): Promise<Sermon[]> => {
  return data.getSermons({ ...opts, visibleOnly: true });
});

// Admin list needs hidden records too.
export const getAllSermonsForAdmin = withAction('sermons.getAllSermonsForAdmin', async (opts?: { categoryId?: string }): Promise<Sermon[]> => {
  await requireSession();
  return data.getSermons(opts);
});

export const getSermon = withAction('sermons.getSermon', async (id: string): Promise<Sermon | null> => {
  await requireSession();
  return data.getSermon(id);
});

export const createSermon = withAction('sermons.createSermon', async (patch: SermonPatch, createdBy?: string | null): Promise<string> => {
  await requireSession();
  return data.createSermon(patch, createdBy);
});

export const updateSermon = withAction('sermons.updateSermon', async (id: string, patch: SermonPatch, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateSermon(id, patch, updatedBy);
});

export const deleteSermon = withAction('sermons.deleteSermon', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteSermon(id);
});
