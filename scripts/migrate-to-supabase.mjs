// One-off migration: local MariaDB + local public/image|audio files -> Supabase
// (Postgres + Storage). Run once, from the project root, with the OLD MariaDB
// still reachable and the NEW Supabase credentials already in .env:
//
//   node --env-file=.env scripts/migrate-to-supabase.mjs
//
// Safe to re-run: file uploads use upsert, and each table is truncated before
// its rows are re-inserted, so a second run just overwrites with the same data.

import mysql from 'mysql2/promise';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const OLD_MYSQL_URL = 'mysql://krsbrno:krsbrno@127.0.0.1:3306/krsbrno';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.wav': 'audio/wav',
  '.ogg': 'audio/ogg', '.opus': 'audio/opus',
};

// Supabase Storage object keys must be ASCII — strip diacritics from the
// filename portion (the old local filesystem was fine with them).
function asciiSafeName(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// ---- Phase A: upload every local file, build oldUrl -> newUrl map ----
async function migrateFiles(supabase) {
  const map = new Map();
  for (const kind of ['image', 'audio']) {
    const bucket = kind === 'image' ? 'images' : 'audio';
    const root = path.join(PUBLIC_DIR, kind);
    const files = await walk(root);
    console.log(`\n${kind}: ${files.length} files`);
    for (const filePath of files) {
      const rel = path.relative(root, filePath).split(path.sep).join('/'); // e.g. pages/25/uuid-name.jpg
      // NFC: macOS/APFS hands back filenames in NFD (decomposed diacritics),
      // but the DB stores whatever normalization the browser produced when the
      // photo was originally uploaded (typically NFC) — normalize both sides
      // the same way or the map lookup in rewriteUrls() silently misses.
      const oldUrl = `/${kind}/${rel}`.normalize('NFC');
      const objectKey = rel
        .split('/')
        .map((segment, i, arr) => (i === arr.length - 1 ? asciiSafeName(segment) : segment))
        .join('/'); // Storage object keys must be ASCII — only the filename needs this
      const ext = path.extname(filePath).toLowerCase();
      const bytes = await readFile(filePath);
      const { error } = await supabase.storage.from(bucket).upload(objectKey, bytes, {
        contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
        upsert: true,
      });
      if (error) {
        console.error(`  FAIL ${oldUrl}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectKey);
      map.set(oldUrl, data.publicUrl);
      const kb = ((await stat(filePath)).size / 1024).toFixed(0);
      console.log(`  OK ${oldUrl} (${kb} KB) -> ${data.publicUrl}`);
    }
  }
  return map;
}

// ---- Deep-rewrite any /image/... or /audio/... string found in a JS value ----
function rewriteUrls(value, map) {
  if (typeof value === 'string') {
    if (!value.startsWith('/image/') && !value.startsWith('/audio/')) return value;
    const key = value.normalize('NFC');
    return map.get(key) ?? (console.warn(`  (no mapping for ${value}, left as-is — file missing locally?)`) || value);
  }
  if (Array.isArray(value)) return value.map((v) => rewriteUrls(v, map));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewriteUrls(v, map);
    return out;
  }
  return value;
}

// ---- Phase B: copy every table's rows, rewriting URLs as they go ----
const TABLES = [
  'roles', 'users', 'password_reset_tokens', 'meta', 'nav_groups', 'social_links',
  'sermon_categories', 'sermon_speakers', 'sections', 'pages', 'articles', 'sermons',
  'contact_messages',
];
const JSON_COLUMNS = { pages: ['slug_history', 'blocks'], sections: ['data'], meta: ['data'] };
const URL_COLUMNS = { articles: ['image'], sermons: ['audio_url'] };
// mysql2 hands TINYINT(1) back as a raw JS number (0/1), and postgres.js
// silently mis-encodes a bare `1` written into a `boolean` column as false
// (binary format mismatch) — coerce explicitly so it round-trips correctly.
const BOOLEAN_COLUMNS = {
  pages: ['show_in_header', 'show_in_footer', 'protected'],
  articles: ['visible'],
  sermons: ['visible'],
  contact_messages: ['read'],
};

async function migrateData(urlMap) {
  const src = await mysql.createConnection(OLD_MYSQL_URL);
  const dest = postgres(process.env.DATABASE_URL, { prepare: false });

  for (const table of TABLES) {
    const [rows] = await src.execute(`SELECT * FROM \`${table}\``);
    console.log(`\n${table}: ${rows.length} rows`);
    if (rows.length === 0) continue;

    for (const row of rows) {
      for (const col of JSON_COLUMNS[table] || []) {
        if (row[col] != null) row[col] = rewriteUrls(row[col], urlMap);
      }
      for (const col of URL_COLUMNS[table] || []) {
        if (row[col]) row[col] = rewriteUrls(row[col], urlMap);
      }
      for (const col of BOOLEAN_COLUMNS[table] || []) {
        if (row[col] != null) row[col] = !!row[col];
      }
    }

    const cols = Object.keys(rows[0]);
    await dest`DELETE FROM ${dest(table)}`;
    for (const row of rows) {
      const values = {};
      for (const c of cols) values[c] = row[c] instanceof Date ? row[c] : row[c];
      await dest`INSERT INTO ${dest(table)} ${dest(values, cols)}`;
    }
    console.log(`  inserted ${rows.length} rows`);
  }

  await src.end();
  await dest.end();
}

async function main() {
  if (!process.env.DATABASE_URL || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing DATABASE_URL / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in env.');
    process.exit(1);
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  console.log('=== Phase A: uploading files to Supabase Storage ===');
  const urlMap = await migrateFiles(supabase);

  console.log('\n=== Phase B: copying database rows ===');
  await migrateData(urlMap);

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
