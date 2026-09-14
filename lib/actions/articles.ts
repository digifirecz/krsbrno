'use server';

// Thin RPC layer so 'use client' components can reach the Drizzle-backed
// article functions. Server components should import from lib/data/articles
// directly instead of going through these.

import * as data from '@/lib/data/articles';
import type { Article, ArticlePatch } from '@/lib/articles';
import { requireSession } from '@/lib/auth/session';

// Used by the public homepage (EventsSection) — always filtered to visible-only
// so hidden/draft articles are never sent to anonymous visitors.
export async function getArticles(): Promise<Article[]> {
  return data.getArticles({ visibleOnly: true });
}

// Admin list needs hidden articles too.
export async function getAllArticlesForAdmin(): Promise<Article[]> {
  await requireSession();
  return data.getArticles();
}

export async function getArticle(id: string): Promise<Article | null> {
  await requireSession();
  return data.getArticle(id);
}

export async function getArticleLocations(): Promise<string[]> {
  await requireSession();
  return data.getArticleLocations();
}

export async function createArticle(patch: ArticlePatch, order: number, createdBy?: string | null): Promise<string> {
  await requireSession();
  return data.createArticle(patch, order, createdBy);
}

export async function updateArticle(id: string, patch: ArticlePatch, updatedBy?: string | null): Promise<void> {
  await requireSession();
  return data.updateArticle(id, patch, updatedBy);
}

export async function deleteArticle(id: string): Promise<void> {
  await requireSession();
  return data.deleteArticle(id);
}
