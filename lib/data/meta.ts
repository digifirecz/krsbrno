import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { meta } from '@/lib/db/schema';

// Generic key/value access to the `meta` table (replaces Firestore `meta/{id}`).
export async function getMeta<T = Record<string, unknown>>(id: string): Promise<T | null> {
  const [row] = await db.select().from(meta).where(eq(meta.id, id)).limit(1);
  return row ? (row.data as T) : null;
}

export async function setMeta(id: string, data: Record<string, unknown>, merge = true): Promise<void> {
  if (merge) {
    const existing = await getMeta(id);
    data = { ...(existing || {}), ...data };
  }
  await db
    .insert(meta)
    .values({ id, data })
    .onDuplicateKeyUpdate({ set: { data } });
}

export { sql };
