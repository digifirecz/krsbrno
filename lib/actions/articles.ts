'use server';

// Thin RPC layer so 'use client' components can reach the Drizzle-backed
// article functions. Server components should import from lib/data/articles
// directly instead of going through these.

import * as data from '@/lib/data/articles';
import type { Article, ArticlePatch } from '@/lib/articles';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Used by the public homepage (EventsSection) — always filtered to visible-only
// so hidden/draft articles are never sent to anonymous visitors.
export const getArticles = withAction('articles.getArticles', async (): Promise<Article[]> => {
  return data.getArticles({ visibleOnly: true });
});

// Admin list needs hidden articles too.
export const getAllArticlesForAdmin = withAction('articles.getAllArticlesForAdmin', async (): Promise<Article[]> => {
  await requireSession();
  return data.getArticles();
});

export const getArticle = withAction('articles.getArticle', async (id: string): Promise<Article | null> => {
  await requireSession();
  return data.getArticle(id);
});

export const getArticleLocations = withAction('articles.getArticleLocations', async (): Promise<string[]> => {
  await requireSession();
  return data.getArticleLocations();
});

export const createArticle = withAction('articles.createArticle', async (patch: ArticlePatch, order: number, createdBy?: string | null): Promise<string> => {
  await requireSession();
  return data.createArticle(patch, order, createdBy);
});

export const updateArticle = withAction('articles.updateArticle', async (id: string, patch: ArticlePatch, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateArticle(id, patch, updatedBy);
});

export const deleteArticle = withAction('articles.deleteArticle', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteArticle(id);
});
