'use server';

// Thin RPC layer so 'use client' components can reach the Drizzle-backed
// article functions. Server components should import from lib/data/articles
// directly instead of going through these.

import * as data from '@/lib/data/articles';
import type { Article, ArticlePatch } from '@/lib/articles';

export async function getArticles(): Promise<Article[]> {
  return data.getArticles();
}

export async function getArticle(id: string): Promise<Article | null> {
  return data.getArticle(id);
}

export async function createArticle(order: number, createdBy?: string | null): Promise<string> {
  return data.createArticle(order, createdBy);
}

export async function updateArticle(id: string, patch: ArticlePatch, updatedBy?: string | null): Promise<void> {
  return data.updateArticle(id, patch, updatedBy);
}

export async function deleteArticle(id: string): Promise<void> {
  return data.deleteArticle(id);
}
