import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { nextId } from '@/lib/data/counters';
import type { Article, ArticlePatch } from '@/lib/articles';

type Row = typeof articles.$inferSelect;

function fromRow(r: Row): Article {
  return {
    id: r.id,
    title: r.title || '',
    subtitle: r.subtitle || undefined,
    dateText: r.dateText || '',
    image: r.image || undefined,
    visible: r.visible !== false,
    order: r.order ?? 0,
    createdAt: r.createdAt ?? null,
    createdBy: r.createdBy ?? null,
    updatedAt: r.updatedAt ?? null,
    updatedBy: r.updatedBy ?? null,
  };
}

export async function getArticles(): Promise<Article[]> {
  const rows = await db.select().from(articles).orderBy(asc(articles.order));
  return rows.map(fromRow);
}

export async function getArticle(id: string): Promise<Article | null> {
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return row ? fromRow(row) : null;
}

export async function createArticle(order: number, createdBy?: string | null): Promise<string> {
  const id = await nextId('articleCounter');
  const now = new Date();
  await db.insert(articles).values({
    id,
    title: '',
    subtitle: null,
    dateText: '',
    image: null,
    visible: true,
    order,
    createdAt: now,
    createdBy: createdBy || null,
    updatedAt: now,
    updatedBy: createdBy || null,
  });
  return id;
}

export async function updateArticle(id: string, patch: ArticlePatch, updatedBy?: string | null): Promise<void> {
  await db
    .update(articles)
    .set({
      ...('title' in patch ? { title: patch.title ?? '' } : {}),
      ...('subtitle' in patch ? { subtitle: patch.subtitle ?? null } : {}),
      ...('dateText' in patch ? { dateText: patch.dateText ?? '' } : {}),
      ...('image' in patch ? { image: patch.image ?? null } : {}),
      ...('visible' in patch ? { visible: patch.visible ?? true } : {}),
      ...('order' in patch ? { order: patch.order ?? 0 } : {}),
      updatedAt: new Date(),
      updatedBy: updatedBy || null,
    })
    .where(eq(articles.id, id));
}

export async function deleteArticle(id: string): Promise<void> {
  await db.delete(articles).where(eq(articles.id, id));
}
