import { eq, sql, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sections } from '@/lib/db/schema';
import { nextId } from '@/lib/data/counters';
import { emptyBlockData } from '@/lib/blocks/defaults';
import { sanitizeBlockData } from '@/lib/sanitizeHtml';
import type { BlockType, BlockData } from '@/lib/blocks/types';
import type { Section } from '@/lib/sections';

type Row = typeof sections.$inferSelect;

function fromRow(r: Row): Section {
  return {
    id: r.id,
    name: r.name || '',
    type: r.type,
    data: r.data,
    createdAt: r.createdAt ?? null,
    createdBy: r.createdBy ?? null,
    updatedAt: r.updatedAt ?? null,
    updatedBy: r.updatedBy ?? null,
  };
}

export async function getSections(): Promise<Section[]> {
  const rows = await db.select().from(sections).orderBy(sql`CAST(${sections.id} AS INTEGER)`);
  return rows.map(fromRow);
}

export async function getSection(id: string): Promise<Section | null> {
  const [row] = await db.select().from(sections).where(eq(sections.id, id)).limit(1);
  return row ? fromRow(row) : null;
}

// Returns id -> { type, data } for the given section ids (used when resolving
// section-backed blocks on a page).
export async function getSectionsByIds(ids: string[]): Promise<Map<string, { type: BlockType; data: BlockData }>> {
  const map = new Map<string, { type: BlockType; data: BlockData }>();
  if (ids.length === 0) return map;
  const rows = await db.select().from(sections).where(inArray(sections.id, ids));
  for (const r of rows) map.set(r.id, { type: r.type, data: r.data });
  return map;
}

export async function createSection(name: string, type: BlockType, createdBy?: string | null): Promise<string> {
  const id = await nextId('sectionCounter');
  const now = new Date();
  await db.insert(sections).values({
    id,
    name,
    type,
    data: emptyBlockData(type),
    createdAt: now,
    createdBy: createdBy || null,
    updatedAt: now,
    updatedBy: createdBy || null,
  });
  return id;
}

export async function updateSection(
  id: string,
  patch: { name?: string; data?: BlockData },
  updatedBy?: string | null,
): Promise<void> {
  let sanitizedData = patch.data;
  if (patch.data !== undefined) {
    const [existing] = await db.select({ type: sections.type }).from(sections).where(eq(sections.id, id)).limit(1);
    if (existing) sanitizedData = sanitizeBlockData(existing.type, patch.data) as BlockData;
  }

  await db
    .update(sections)
    .set({
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.data !== undefined ? { data: sanitizedData } : {}),
      updatedAt: new Date(),
      updatedBy: updatedBy || null,
    })
    .where(eq(sections.id, id));
}

export async function deleteSection(id: string): Promise<void> {
  await db.delete(sections).where(eq(sections.id, id));
}
