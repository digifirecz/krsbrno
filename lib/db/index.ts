import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Server-only. A single pooled connection reused across requests; in dev,
// stash it on globalThis so hot-reload doesn't open a new pool every edit.
// DATABASE_URL must point at Supabase's *transaction pooler* connection
// string (port 6543), not the direct connection (port 5432) — the pooler is
// what lets this survive Vercel's serverless model, where each invocation
// can open its own connections.
const globalForDb = globalThis as unknown as { _pgClient?: postgres.Sql };

const client =
  globalForDb._pgClient ??
  postgres(process.env.DATABASE_URL as string, {
    prepare: false, // required for Supabase's transaction pooler (pgbouncer)
  });

if (process.env.NODE_ENV !== 'production') globalForDb._pgClient = client;

export const db = drizzle(client, { schema });
export { schema };
