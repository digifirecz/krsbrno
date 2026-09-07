// Rewrite Firebase Storage URLs to local /image/... paths in the MariaDB rows.
// Run AFTER download-storage.mjs and db:import.
// Run: node --env-file=.env scripts/localize-images.mjs

import mysql from 'mysql2/promise';

const RE = /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/krsbrno\.firebasestorage\.app\/o\/([^"?\\ ]+)(\?[^"\\ ]*)?/g;
const toLocal = (s) => s.replace(RE, (_m, enc) => '/image/' + decodeURIComponent(enc));

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set (run with: node --env-file=.env ...)');
  const db = await mysql.createConnection({ uri: process.env.DATABASE_URL });

  let changed = 0;

  // pages.blocks (JSON) + sections.data (JSON) + articles.image (varchar)
  const targets = [
    { table: 'pages', col: 'blocks', json: true },
    { table: 'sections', col: 'data', json: true },
    { table: 'articles', col: 'image', json: false },
  ];

  for (const { table, col, json } of targets) {
    const [rows] = await db.query(`SELECT id, \`${col}\` AS val FROM \`${table}\``);
    for (const row of rows) {
      const before = json ? JSON.stringify(row.val) : row.val;
      if (!before || !before.includes('firebasestorage.googleapis.com')) continue;
      const after = toLocal(before);
      if (after === before) continue;
      await db.query(`UPDATE \`${table}\` SET \`${col}\` = ? WHERE id = ?`, [after, row.id]);
      changed += 1;
      console.log(`  ${table}#${row.id}.${col} rewritten`);
    }
  }

  const [[left]] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM pages WHERE JSON_SEARCH(blocks, 'one', '%firebasestorage%') IS NOT NULL) AS pages,
      (SELECT COUNT(*) FROM sections WHERE JSON_SEARCH(data, 'one', '%firebasestorage%') IS NOT NULL) AS sections
  `);
  console.log(`\n${changed} rows rewritten. Rows still referencing firebasestorage:`, left);
  await db.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
