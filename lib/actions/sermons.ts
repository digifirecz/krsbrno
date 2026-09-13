'use server';

// RPC layer for 'use client' admin screens. Server components should import
// lib/data/sermons directly.

import * as data from '@/lib/data/sermons';
import type { Sermon, SermonPatch, SermonCategory, SermonSpeaker } from '@/lib/sermons';

export async function getSermonCategories(): Promise<SermonCategory[]> {
  return data.getSermonCategories();
}

export async function createSermonCategory(name: string, createdBy?: string | null): Promise<SermonCategory> {
  return data.createSermonCategory(name, createdBy);
}

export async function updateSermonCategory(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  return data.updateSermonCategory(id, patch, updatedBy);
}

export async function deleteSermonCategory(id: string): Promise<void> {
  return data.deleteSermonCategory(id);
}

export async function getSermonSpeakers(): Promise<SermonSpeaker[]> {
  return data.getSermonSpeakers();
}

export async function createSermonSpeaker(name: string, createdBy?: string | null): Promise<SermonSpeaker> {
  return data.createSermonSpeaker(name, createdBy);
}

export async function updateSermonSpeaker(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  return data.updateSermonSpeaker(id, patch, updatedBy);
}

export async function deleteSermonSpeaker(id: string): Promise<void> {
  return data.deleteSermonSpeaker(id);
}

export async function getSermons(opts?: { categoryId?: string; visibleOnly?: boolean }): Promise<Sermon[]> {
  return data.getSermons(opts);
}

export async function getSermon(id: string): Promise<Sermon | null> {
  return data.getSermon(id);
}

export async function createSermon(createdBy?: string | null): Promise<string> {
  return data.createSermon(createdBy);
}

export async function updateSermon(id: string, patch: SermonPatch, updatedBy?: string | null): Promise<void> {
  return data.updateSermon(id, patch, updatedBy);
}

export async function deleteSermon(id: string): Promise<void> {
  return data.deleteSermon(id);
}
