import type { Config } from 'drizzle-kit';

// Node 22 loads .env natively; drizzle-kit doesn't, so do it here.
try {
  process.loadEnvFile('.env');
} catch {
  /* no .env file — rely on the ambient environment */
}

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL as string },
} satisfies Config;
