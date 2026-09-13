// Load data/firestore-export/*.json into MariaDB.
// Run: node --env-file=.env scripts/import-firestore.mjs
// Idempotent: each table is emptied and refilled from the JSON snapshot.

import { readFileSync } from 'node:fs';
import mysql from 'mysql2/promise';

const DIR = new URL('../data/firestore-export/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(`${name}.json`, DIR), 'utf8'));

// Firestore Timestamp (as serialized by the export) -> "YYYY-MM-DD HH:MM:SS".
function ts(v) {
  if (!v || typeof v !== 'object' || typeof v.seconds !== 'number') return null;
  const d = new Date(v.seconds * 1000 + Math.round((v.nanoseconds || 0) / 1e6));
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

const bool = (v) => (v ? 1 : 0);
const jsonCol = (v) => JSON.stringify(v ?? null);

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set (run with: node --env-file=.env ...)');
  const db = await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });

  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of ['pages', 'sections', 'articles', 'nav_groups', 'social_links', 'meta']) {
    await db.query(`TRUNCATE TABLE \`${t}\``);
  }

  // pages
  for (const p of read('pages')) {
    await db.query(
      `INSERT INTO pages (id, title, slug, slug_history, blocks, show_in_header, show_in_footer,
        header_group_id, header_icon, protected, created_at, created_by, updated_at, updated_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        String(p.id),
        p.title ?? null,
        p.slug ?? null,
        jsonCol(p.slugHistory ?? []),
        jsonCol(p.blocks ?? []),
        bool(p.showInHeader),
        bool(p.showInFooter),
        p.headerGroupId ?? '',
        p.headerIcon ?? null,
        bool(p.protected),
        ts(p.createdAt),
        p.createdBy ?? null,
        ts(p.updatedAt),
        p.updatedBy ?? null,
      ],
    );
  }

  // sections
  for (const s of read('sections')) {
    await db.query(
      `INSERT INTO sections (id, name, type, data, created_at, created_by, updated_at, updated_by)
       VALUES (?,?,?,?,?,?,?,?)`,
      [String(s.id), s.name ?? '', s.type, jsonCol(s.data ?? {}), ts(s.createdAt), s.createdBy ?? null, ts(s.updatedAt), s.updatedBy ?? null],
    );
  }

  // articles
  for (const a of read('articles')) {
    await db.query(
      `INSERT INTO articles (id, title, subtitle, date_text, image, visible, sort_order,
        created_at, created_by, updated_at, updated_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        String(a.id),
        a.title ?? '',
        a.subtitle ?? null,
        a.dateText ?? '',
        a.image ?? null,
        a.visible === false ? 0 : 1,
        a.order ?? 0,
        ts(a.createdAt),
        a.createdBy ?? null,
        ts(a.updatedAt),
        a.updatedBy ?? null,
      ],
    );
  }

  // nav_groups
  for (const g of read('navGroups')) {
    await db.query(`INSERT INTO nav_groups (id, label) VALUES (?,?)`, [String(g.id), g.label ?? g.id]);
  }

  // social_links (auto-increment id; ignore any Firestore id)
  for (const l of read('socialLinks')) {
    await db.query(`INSERT INTO social_links (icon, url, sort_order) VALUES (?,?,?)`, [l.icon ?? '', l.url ?? '', l.order ?? 0]);
  }

  // meta: { id, ...rest } -> { id, data: rest }
  for (const m of read('meta')) {
    const { id, ...rest } = m;
    await db.query(`INSERT INTO meta (id, data) VALUES (?,?)`, [String(id), jsonCol(rest)]);
  }

  await db.query('SET FOREIGN_KEY_CHECKS = 1');

  const [[counts]] = await db.query(
    `SELECT
      (SELECT COUNT(*) FROM pages) AS pages,
      (SELECT COUNT(*) FROM sections) AS sections,
      (SELECT COUNT(*) FROM articles) AS articles,
      (SELECT COUNT(*) FROM nav_groups) AS nav_groups,
      (SELECT COUNT(*) FROM social_links) AS social_links,
      (SELECT COUNT(*) FROM meta) AS meta`,
  );
  console.table(counts);
  await db.end();
  console.log('Import done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
