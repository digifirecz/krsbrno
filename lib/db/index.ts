import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Server-only. A single pooled connection reused across requests; in dev,
// stash it on globalThis so hot-reload doesn't open a new pool every edit.
const globalForDb = globalThis as unknown as { _mysqlPool?: mysql.Pool };

const pool =
  globalForDb._mysqlPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    // mysql2 returns JS Date for DATETIME and parsed objects for JSON columns.
    timezone: 'Z',
  });

if (process.env.NODE_ENV !== 'production') globalForDb._mysqlPool = pool;

export const db = drizzle(pool, { schema, mode: 'default' });
export { schema };
