import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sermons, sermonCategories, sermonSpeakers } from '@/lib/db/schema';
import { nextId } from '@/lib/data/counters';
import { slugify } from '@/lib/pages';
import type { Sermon, SermonPatch, SermonCategory, SermonSpeaker, SermonTaxon } from '@/lib/sermons';

function uniqueId(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/* ---------- categories + speakers (same shape) ---------- */

type TaxonTable = typeof sermonCategories | typeof sermonSpeakers;
type TaxonRow = typeof sermonCategories.$inferSelect;

function taxonFromRow(r: TaxonRow): SermonTaxon {
  return {
    id: r.id,
    name: r.name || r.id,
    order: r.order ?? 0,
    createdAt: r.createdAt ?? null,
    createdBy: r.createdBy ?? null,
    updatedAt: r.updatedAt ?? null,
    updatedBy: r.updatedBy ?? null,
  };
}

async function listTaxon(table: TaxonTable): Promise<SermonTaxon[]> {
  const rows = await db.select().from(table).orderBy(asc(table.order), asc(table.name));
  return rows.map(taxonFromRow);
}

async function createTaxon(
  table: TaxonTable,
  name: string,
  idPrefix: string,
  existsMsg: string,
  emptyMsg: string,
  createdBy?: string | null,
): Promise<SermonTaxon> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error(emptyMsg);
  const rows = await db.select().from(table);
  if (rows.some((r) => (r.name || '').trim().toLowerCase() === trimmed.toLowerCase())) {
    throw new Error(existsMsg);
  }
  const id = uniqueId(slugify(trimmed) || idPrefix, new Set(rows.map((r) => r.id)));
  const order = rows.reduce((max, r) => Math.max(max, r.order ?? 0), 0) + 1;
  const now = new Date();
  await db
    .insert(table)
    .values({ id, name: trimmed, order, createdAt: now, createdBy: createdBy || null, updatedAt: now, updatedBy: createdBy || null });
  return { id, name: trimmed, order, createdAt: now, createdBy: createdBy || null, updatedAt: now, updatedBy: createdBy || null };
}

async function updateTaxon(
  table: TaxonTable,
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  await db
    .update(table)
    .set({
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.order !== undefined ? { order: patch.order } : {}),
      updatedAt: new Date(),
      updatedBy: updatedBy || null,
    })
    .where(eq(table.id, id));
}

export async function getSermonCategories(): Promise<SermonCategory[]> {
  return listTaxon(sermonCategories);
}

export async function createSermonCategory(name: string, createdBy?: string | null): Promise<SermonCategory> {
  return createTaxon(
    sermonCategories,
    name,
    'kategorie',
    'Kategorie s tímto názvem už existuje.',
    'Zadejte název kategorie.',
    createdBy,
  );
}

export async function updateSermonCategory(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  return updateTaxon(sermonCategories, id, patch, updatedBy);
}

export async function deleteSermonCategory(id: string): Promise<void> {
  await db.update(sermons).set({ categoryId: null }).where(eq(sermons.categoryId, id));
  await db.delete(sermonCategories).where(eq(sermonCategories.id, id));
}

export async function getSermonSpeakers(): Promise<SermonSpeaker[]> {
  return listTaxon(sermonSpeakers);
}

export async function createSermonSpeaker(name: string, createdBy?: string | null): Promise<SermonSpeaker> {
  return createTaxon(
    sermonSpeakers,
    name,
    'recnik',
    'Řečník s tímto jménem už existuje.',
    'Zadejte jméno řečníka.',
    createdBy,
  );
}

export async function updateSermonSpeaker(
  id: string,
  patch: { name?: string; order?: number },
  updatedBy?: string | null,
): Promise<void> {
  return updateTaxon(sermonSpeakers, id, patch, updatedBy);
}

export async function deleteSermonSpeaker(id: string): Promise<void> {
  await db.update(sermons).set({ speakerId: null }).where(eq(sermons.speakerId, id));
  await db.delete(sermonSpeakers).where(eq(sermonSpeakers.id, id));
}

/* ---------- recordings ---------- */

type Row = typeof sermons.$inferSelect;

function fromRow(r: Row): Sermon {
  return {
    id: r.id,
    title: r.title || '',
    speakerId: r.speakerId ?? null,
    date: r.date ?? null,
    categoryId: r.categoryId ?? null,
    description: r.description || undefined,
    audioUrl: r.audioUrl || undefined,
    visible: r.visible !== false,
    order: r.order ?? 0,
    createdAt: r.createdAt ?? null,
    createdBy: r.createdBy ?? null,
    updatedAt: r.updatedAt ?? null,
    updatedBy: r.updatedBy ?? null,
  };
}

export async function getSermons(opts?: { categoryId?: string; visibleOnly?: boolean }): Promise<Sermon[]> {
  const conds = [];
  if (opts?.categoryId) conds.push(eq(sermons.categoryId, opts.categoryId));
  if (opts?.visibleOnly) conds.push(eq(sermons.visible, true));
  const rows = await db
    .select()
    .from(sermons)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(sermons.date), asc(sermons.order), desc(sermons.id));
  return rows.map(fromRow);
}

export async function getSermon(id: string): Promise<Sermon | null> {
  const [row] = await db.select().from(sermons).where(eq(sermons.id, id)).limit(1);
  return row ? fromRow(row) : null;
}

export async function createSermon(createdBy?: string | null): Promise<string> {
  const id = await nextId('sermonCounter');
  const now = new Date();
  await db.insert(sermons).values({
    id,
    title: '',
    speakerId: null,
    date: now,
    categoryId: null,
    description: null,
    audioUrl: null,
    visible: true,
    order: 0,
    createdAt: now,
    createdBy: createdBy || null,
    updatedAt: now,
    updatedBy: createdBy || null,
  });
  return id;
}

export async function updateSermon(id: string, patch: SermonPatch, updatedBy?: string | null): Promise<void> {
  await db
    .update(sermons)
    .set({
      ...('title' in patch ? { title: patch.title ?? '' } : {}),
      ...('speakerId' in patch ? { speakerId: patch.speakerId || null } : {}),
      ...('date' in patch ? { date: patch.date ?? null } : {}),
      ...('categoryId' in patch ? { categoryId: patch.categoryId || null } : {}),
      ...('description' in patch ? { description: patch.description || null } : {}),
      ...('audioUrl' in patch ? { audioUrl: patch.audioUrl || null } : {}),
      ...('visible' in patch ? { visible: patch.visible ?? true } : {}),
      ...('order' in patch ? { order: patch.order ?? 0 } : {}),
      updatedAt: new Date(),
      updatedBy: updatedBy || null,
    })
    .where(eq(sermons.id, id));
}

export async function deleteSermon(id: string): Promise<void> {
  await db.delete(sermons).where(eq(sermons.id, id));
}
