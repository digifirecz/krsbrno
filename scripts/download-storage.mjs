// Download every Firebase Storage file referenced by the exported data into
// public/image/, mirroring the storage object path.
// Run: node scripts/download-storage.mjs

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const DIR = new URL('../data/firestore-export/', import.meta.url);
const OUT = new URL('../public/image/', import.meta.url);
const PREFIX = 'https://firebasestorage.googleapis.com/v0/b/krsbrno.firebasestorage.app/o/';

const blob = ['pages.json', 'sections.json', 'articles.json']
  .map((f) => readFileSync(new URL(f, DIR), 'utf8'))
  .join('\n');

const urls = [...new Set([...blob.matchAll(/https:\/\/firebasestorage\.googleapis\.com\/[^"\\ ]+/g)].map((m) => m[0]))];

console.log(`${urls.length} storage URLs found`);

let ok = 0;
let skip = 0;
let fail = 0;

for (const url of urls) {
  // .../o/pages%2F1%2Fabc-IMG.jpg?alt=media  ->  pages/1/abc-IMG.jpg
  const objectPath = decodeURIComponent(url.slice(PREFIX.length).split('?')[0]);
  const dest = new URL(objectPath, OUT);

  if (existsSync(dest)) {
    skip += 1;
    continue;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest.pathname), { recursive: true });
    writeFileSync(dest, buf);
    ok += 1;
    console.log(`  ok   ${objectPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    fail += 1;
    console.log(`  FAIL ${objectPath} — ${err.message}`);
  }
}

console.log(`\ndownloaded ${ok}, skipped ${skip}, failed ${fail} -> public/image/`);
process.exit(fail ? 1 : 0);
