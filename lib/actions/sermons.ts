'use server';

// RPC layer for 'use client' admin screens. Server components should import
// lib/data/sermons directly.

import * as data from '@/lib/data/sermons';
import type { Sermon, SermonPatch, SermonCategory, SermonSpeaker } from '@/lib/sermons';
import { requireSession } from '@/lib/auth/session';

// Public — the Kázání page (SermonsSection) reads categories/speakers/sermons directly.
export async function getSermonCategories(): Promise<SermonCategory[]> {
  return data.getSermonCategories();
}

export async function createSermonCategory(name: string, createdBy?: string | null): Promise<SermonCategory> {
  await requireSession();
  return data.createSermonCategory(name, createdBy);
}

export async function updateSermonCategory(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  await requireSession();
  return data.updateSermonCategory(id, patch, updatedBy);
}

export async function deleteSermonCategory(id: string): Promise<void> {
  await requireSession();
  return data.deleteSermonCategory(id);
}

export async function getSermonSpeakers(): Promise<SermonSpeaker[]> {
  return data.getSermonSpeakers();
}

export async function createSermonSpeaker(name: string, createdBy?: string | null): Promise<SermonSpeaker> {
  await requireSession();
  return data.createSermonSpeaker(name, createdBy);
}

export async function updateSermonSpeaker(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  await requireSession();
  return data.updateSermonSpeaker(id, patch, updatedBy);
}

export async function deleteSermonSpeaker(id: string): Promise<void> {
  await requireSession();
  return data.deleteSermonSpeaker(id);
}

// Public — always forces visibleOnly so hidden/draft records are never sent
// to anonymous callers, regardless of what a caller passes in.
export async function getSermons(opts?: { categoryId?: string }): Promise<Sermon[]> {
  return data.getSermons({ ...opts, visibleOnly: true });
}

// Admin list needs hidden records too.
export async function getAllSermonsForAdmin(opts?: { categoryId?: string }): Promise<Sermon[]> {
  await requireSession();
  return data.getSermons(opts);
}

export async function getSermon(id: string): Promise<Sermon | null> {
  await requireSession();
  return data.getSermon(id);
}

export async function createSermon(patch: SermonPatch, createdBy?: string | null): Promise<string> {
  await requireSession();
  return data.createSermon(patch, createdBy);
}

export async function updateSermon(id: string, patch: SermonPatch, updatedBy?: string | null): Promise<void> {
  await requireSession();
  return data.updateSermon(id, patch, updatedBy);
}

export async function deleteSermon(id: string): Promise<void> {
  await requireSession();
  return data.deleteSermon(id);
}
