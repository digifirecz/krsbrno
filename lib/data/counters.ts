import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { meta } from '@/lib/db/schema';

// Replaces the Firestore `meta/{name}Counter` transaction. Atomically bumps
// meta.data.value and returns the new value as a string (ids stay strings
// app-wide, same as the Firestore doc ids were).
export async function nextId(counter: 'pageCounter' | 'articleCounter' | 'sectionCounter' | 'sermonCounter' | 'contactMessageCounter'): Promise<string> {
  return db.transaction(async (tx) => {
    // ${counter} is a bound parameter (drizzle's sql`` tag), not string
    // concatenation — safe against injection regardless of the value.
    await tx.execute(sql`
      INSERT INTO meta (id, data) VALUES (${counter}, '{"value":1}'::jsonb)
      ON CONFLICT (id) DO UPDATE SET data = jsonb_set(meta.data, '{value}', to_jsonb((meta.data->>'value')::int + 1))
    `);
    const [row] = await tx.select({ data: meta.data }).from(meta).where(eq(meta.id, counter)).limit(1);
    const value = Number((row?.data as { value?: number } | undefined)?.value ?? 1);
    return String(value);
  });
}
