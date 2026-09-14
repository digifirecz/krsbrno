import { asc, eq, isNotNull } from 'drizzle-orm';
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
    timeText: r.timeText || undefined,
    location: r.location || undefined,
    image: r.image || undefined,
    focalX: r.focalX ?? undefined,
    focalY: r.focalY ?? undefined,
    zoom: r.zoom ?? undefined,
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

// Distinct, dřív použitá místa konání — pro nabídku v adminu, ať se nemusí
// pořád psát to samé (viz <datalist> v editaci článku).
export async function getArticleLocations(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ location: articles.location })
    .from(articles)
    .where(isNotNull(articles.location))
    .orderBy(asc(articles.location));
  return rows.map((r) => r.location).filter((l): l is string => !!l && l.trim() !== '');
}

// Only called once the admin has filled out the form and hit "Vytvořit" —
// unlike the old flow, no blank/untitled row is ever persisted just from
// clicking "Přidat článek".
export async function createArticle(patch: ArticlePatch, order: number, createdBy?: string | null): Promise<string> {
  const id = await nextId('articleCounter');
  const now = new Date();
  await db.insert(articles).values({
    id,
    title: patch.title?.trim() || '',
    subtitle: patch.subtitle || null,
    dateText: patch.dateText?.trim() || '',
    timeText: patch.timeText || null,
    location: patch.location || null,
    image: patch.image || null,
    focalX: patch.focalX ?? null,
    focalY: patch.focalY ?? null,
    zoom: patch.zoom ?? null,
    visible: patch.visible ?? true,
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
      ...('timeText' in patch ? { timeText: patch.timeText || null } : {}),
      ...('location' in patch ? { location: patch.location || null } : {}),
      ...('image' in patch ? { image: patch.image ?? null } : {}),
      ...('focalX' in patch ? { focalX: patch.focalX ?? null } : {}),
      ...('focalY' in patch ? { focalY: patch.focalY ?? null } : {}),
      ...('zoom' in patch ? { zoom: patch.zoom ?? null } : {}),
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
