import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pages, navGroups } from '@/lib/db/schema';
import { nextId } from '@/lib/data/counters';
import { getMeta, setMeta } from '@/lib/data/meta';
import { getSectionsByIds } from '@/lib/data/sections';
import { slugify } from '@/lib/pages';
import { MANAGEABLE_PAGES } from '@/lib/blocks/pageRegistry';
import type { BlockInstance, PageDoc } from '@/lib/blocks/types';
import type { CustomPage, PageSlugEntry, PageNavEntry, NavGroup, ManagedPage } from '@/lib/pages';

type Row = typeof pages.$inferSelect;

// Rebuild the PageDoc shape the app used to get straight out of Firestore.
function toPageDoc(r: Row): PageDoc {
  return {
    blocks: (r.blocks as BlockInstance[]) || [],
    title: r.title ?? null,
    slug: r.slug ?? null,
    slugHistory: (r.slugHistory as string[]) || [],
    showInHeader: r.showInHeader,
    showInFooter: r.showInFooter,
    headerGroupId: r.headerGroupId || undefined,
    headerIcon: r.headerIcon || undefined,
    protected: r.protected,
    createdAt: r.createdAt ?? undefined,
    createdBy: r.createdBy ?? null,
    updatedAt: r.updatedAt ?? undefined,
    updatedBy: r.updatedBy ?? null,
  };
}

// Blocks that reference a shared Section only store {id, type, sectionId, ...};
// their real type/data is resolved from the Section row on every read.
async function resolveSectionBlocks(blocks: BlockInstance[]): Promise<BlockInstance[]> {
  const sectionIds = [...new Set(blocks.filter((b) => b.sectionId).map((b) => b.sectionId as string))];
  if (sectionIds.length === 0) return blocks;
  const byId = await getSectionsByIds(sectionIds);
  return blocks.map((block) => {
    if (!block.sectionId) return block;
    const section = byId.get(block.sectionId);
    if (!section) return block;
    return { ...block, type: section.type, data: section.data };
  });
}

export async function getPageDoc(pageId: string): Promise<PageDoc | null> {
  const [row] = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  return row ? toPageDoc(row) : null;
}

export async function getPageBlocks(pageId: string): Promise<BlockInstance[] | null> {
  const doc = await getPageDoc(pageId);
  if (!doc || !doc.blocks || doc.blocks.length === 0) return null;
  const sorted = [...doc.blocks].sort((a, b) => a.order - b.order);
  return resolveSectionBlocks(sorted);
}

function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function savePageBlocks(
  pageId: string,
  blocks: BlockInstance[],
  title?: string | null,
  updatedBy?: string | null,
  navConfig?: { headerGroupId?: string; headerIcon?: string },
): Promise<string> {
  const trimmedTitle = (title || '').trim();
  const existing = await getPageDoc(pageId);
  const desiredSlug = trimmedTitle ? slugify(trimmedTitle) : '';

  let slug = existing?.slug || pageId;
  let slugHistory = existing?.slugHistory || [];

  if (desiredSlug && desiredSlug !== slug) {
    const rows = await db.select({ id: pages.id, slug: pages.slug, slugHistory: pages.slugHistory }).from(pages);
    const taken = new Set<string>();
    rows.forEach((d) => {
      if (d.id === pageId) return;
      if (d.slug) taken.add(d.slug);
      ((d.slugHistory as string[]) || []).forEach((s) => taken.add(s));
    });
    const nextSlug = uniqueSlug(desiredSlug, taken);
    if (!slugHistory.includes(slug)) slugHistory = [...slugHistory, slug];
    slug = nextSlug;
    slugHistory = slugHistory.filter((s) => s !== slug);
  }

  const now = new Date();
  const values = {
    id: pageId,
    blocks,
    title: trimmedTitle || null,
    slug,
    slugHistory,
    updatedAt: now,
    updatedBy: updatedBy || null,
    ...(navConfig?.headerGroupId !== undefined ? { headerGroupId: navConfig.headerGroupId } : {}),
    ...(navConfig?.headerIcon !== undefined ? { headerIcon: navConfig.headerIcon } : {}),
  };
  const { id: _id, ...update } = values;
  await db.insert(pages).values(values).onDuplicateKeyUpdate({ set: update });

  return slug;
}

export async function getCustomPages(): Promise<CustomPage[]> {
  const staticIds = new Set(MANAGEABLE_PAGES.map((p) => p.id));
  const rows = await db.select({ id: pages.id, title: pages.title, protected: pages.protected }).from(pages);
  return rows
    .filter((d) => !staticIds.has(d.id))
    .map((d) => ({ id: d.id, label: d.title || d.id, protected: !!d.protected }));
}

// Every page for the admin list: the built-in ones plus custom, each with its
// audit info. Built-in / protected pages can't be deleted.
export async function getManagedPages(): Promise<ManagedPage[]> {
  const staticIds = new Set(MANAGEABLE_PAGES.map((p) => p.id));
  const staticLabels = new Map(MANAGEABLE_PAGES.map((p) => [p.id, p.label]));
  const rows = await db.select().from(pages);
  const byId = new Map(rows.map((r) => [r.id, r]));

  const audit = (r?: typeof pages.$inferSelect) => ({
    createdAt: r?.createdAt ?? null,
    createdBy: r?.createdBy ?? null,
    updatedAt: r?.updatedAt ?? null,
    updatedBy: r?.updatedBy ?? null,
  });

  const list: ManagedPage[] = MANAGEABLE_PAGES.map((mp) => {
    const r = byId.get(mp.id);
    return { id: mp.id, label: r?.title || mp.label, protected: !!(r?.protected ?? mp.protected), builtIn: true, ...audit(r) };
  });
  for (const r of rows) {
    if (staticIds.has(r.id)) continue;
    list.push({ id: r.id, label: r.title || staticLabels.get(r.id) || r.id, protected: !!r.protected, builtIn: false, ...audit(r) });
  }
  return list.sort((a, b) => Number(a.id) - Number(b.id));
}

export async function getProtectedPageId(): Promise<string | null> {
  const [row] = await db.select({ id: pages.id }).from(pages).where(eq(pages.protected, true)).limit(1);
  return row ? row.id : null;
}

export async function getAllPageSlugs(): Promise<PageSlugEntry[]> {
  const rows = await db.select({ id: pages.id, slug: pages.slug }).from(pages);
  return rows.map((d) => ({ id: d.id, slug: d.slug || d.id })).filter((e) => !!e.slug);
}

export async function getNavGroups(): Promise<NavGroup[]> {
  const rows = await db.select().from(navGroups).orderBy(navGroups.order, navGroups.label);
  return rows.map((d) => ({
    id: d.id,
    label: d.label || d.id,
    order: d.order ?? 0,
    createdAt: d.createdAt ?? null,
    createdBy: d.createdBy ?? null,
    updatedAt: d.updatedAt ?? null,
    updatedBy: d.updatedBy ?? null,
  }));
}

export async function getNavConfig(): Promise<PageNavEntry[]> {
  const staticLabels = new Map(MANAGEABLE_PAGES.map((p) => [p.id, p.label]));
  const [rows, groups] = await Promise.all([db.select().from(pages), getNavGroups()]);
  const groupLabels = new Map(groups.map((g) => [g.id, g.label]));
  return rows.map((d) => {
    const headerGroupId = d.headerGroupId || '';
    return {
      id: d.id,
      label: d.title || staticLabels.get(d.id) || d.id,
      showInHeader: !!d.showInHeader,
      showInFooter: !!d.showInFooter,
      headerGroupId,
      headerGroupLabel: headerGroupId ? groupLabels.get(headerGroupId) || '' : '',
      headerIcon: d.headerIcon || undefined,
      protected: !!d.protected,
    };
  });
}

export async function setNavVisibility(
  pageId: string,
  visibility: { showInHeader?: boolean; showInFooter?: boolean; headerGroupId?: string; headerIcon?: string },
): Promise<void> {
  await db
    .update(pages)
    .set({
      ...(visibility.showInHeader !== undefined ? { showInHeader: visibility.showInHeader } : {}),
      ...(visibility.showInFooter !== undefined ? { showInFooter: visibility.showInFooter } : {}),
      ...(visibility.headerGroupId !== undefined ? { headerGroupId: visibility.headerGroupId } : {}),
      ...(visibility.headerIcon !== undefined ? { headerIcon: visibility.headerIcon } : {}),
    })
    .where(eq(pages.id, pageId));
}

export async function resolvePageBySlug(slug: string): Promise<{ pageId: string; redirectSlug?: string } | null> {
  const [current] = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug)).limit(1);
  if (current) return { pageId: current.id };

  const [hist] = await db
    .select({ id: pages.id, slug: pages.slug })
    .from(pages)
    .where(sql`JSON_CONTAINS(${pages.slugHistory}, ${JSON.stringify(slug)})`)
    .limit(1);
  if (hist) return { pageId: hist.id, redirectSlug: hist.slug || hist.id };

  return null;
}

export async function createPage(label: string, createdBy?: string | null): Promise<string> {
  const trimmed = label.trim();
  const baseSlug = slugify(trimmed);
  if (!trimmed || !baseSlug) throw new Error('Zadejte platný název stránky.');

  if (MANAGEABLE_PAGES.find((p) => p.label.trim().toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Stránka s tímto názvem už existuje.');
  }

  const rows = await db.select({ title: pages.title, slug: pages.slug, slugHistory: pages.slugHistory }).from(pages);
  const taken = new Set<string>();
  let titleCollision = false;
  rows.forEach((d) => {
    if (d.slug) taken.add(d.slug);
    ((d.slugHistory as string[]) || []).forEach((s) => taken.add(s));
    if ((d.title || '').trim().toLowerCase() === trimmed.toLowerCase()) titleCollision = true;
  });
  if (titleCollision) throw new Error('Stránka s tímto názvem už existuje.');

  const slug = uniqueSlug(baseSlug, taken);
  const id = await nextId('pageCounter');
  const now = new Date();
  await db.insert(pages).values({
    id,
    blocks: [],
    title: trimmed,
    slug,
    slugHistory: [],
    createdAt: now,
    createdBy: createdBy || null,
    updatedAt: now,
    updatedBy: createdBy || null,
  });
  return id;
}

export async function deletePage(pageId: string): Promise<void> {
  await db.delete(pages).where(eq(pages.id, pageId));
}

export async function getHomePageId(): Promise<string | null> {
  const m = await getMeta<{ pageId?: string }>('homePage');
  return m?.pageId || null;
}

export async function setHomePageId(pageId: string | null): Promise<void> {
  await setMeta('homePage', { pageId: pageId || null }, false);
}

export async function createNavGroup(label: string, createdBy?: string | null): Promise<NavGroup> {
  const trimmed = label.trim();
  if (!trimmed) throw new Error('Zadejte název kategorie.');

  const rows = await db.select().from(navGroups);
  const taken = new Set(rows.map((d) => d.id));
  if (rows.some((d) => (d.label || '').trim().toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Kategorie s tímto názvem už existuje.');
  }

  const id = uniqueSlug(slugify(trimmed) || 'kategorie', taken);
  const order = rows.reduce((max, r) => Math.max(max, r.order ?? 0), 0) + 1;
  const now = new Date();
  await db
    .insert(navGroups)
    .values({ id, label: trimmed, order, createdAt: now, createdBy: createdBy || null, updatedAt: now, updatedBy: createdBy || null });
  return { id, label: trimmed, order, createdAt: now, createdBy: createdBy || null, updatedAt: now, updatedBy: createdBy || null };
}

export async function updateNavGroup(id: string, label: string, updatedBy?: string | null): Promise<void> {
  await db
    .update(navGroups)
    .set({ label: label.trim(), updatedAt: new Date(), updatedBy: updatedBy || null })
    .where(eq(navGroups.id, id));
}

export async function deleteNavGroup(groupId: string): Promise<void> {
  await db.delete(navGroups).where(eq(navGroups.id, groupId));
}

// re-exported so callers that only need the pure helper don't import two modules
export { slugify };
export type { CustomPage, PageSlugEntry, PageNavEntry, NavGroup };
