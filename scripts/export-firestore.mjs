// One-off export of every Firestore collection to local JSON.
// Run: node scripts/export-firestore.mjs
// Reads are public for pages/sections/articles/socialLinks/navGroups/meta per
// firestore.rules; roles/roleDefinitions need auth and may come back empty.

import { mkdirSync, writeFileSync } from 'node:fs';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBzkHbuf8vVmkI9ZGXV31VJmGvKqY4Q6FY',
  authDomain: 'krsbrno.firebaseapp.com',
  projectId: 'krsbrno',
  storageBucket: 'krsbrno.firebasestorage.app',
  messagingSenderId: '681469037767',
  appId: '1:681469037767:web:16573d418720b3f52d42e2',
};

const DATABASE_ID = 'krsbrno';
const COLLECTIONS = [
  'pages',
  'sections',
  'articles',
  'socialLinks',
  'navGroups',
  'meta',
  'roles',
  'roleDefinitions',
];

const OUT_DIR = new URL('../data/firestore-export/', import.meta.url);

// Firestore Timestamp -> ISO string so the JSON stays readable and portable.
function replacer(_key, value) {
  if (value instanceof Timestamp) return { __timestamp__: value.toDate().toISOString() };
  return value;
}

async function main() {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app, DATABASE_ID);

  mkdirSync(OUT_DIR, { recursive: true });

  const summary = {};
  for (const name of COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, name));
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      writeFileSync(new URL(`${name}.json`, OUT_DIR), JSON.stringify(docs, replacer, 2) + '\n');
      summary[name] = docs.length;
      console.log(`  ${name}: ${docs.length} docs`);
    } catch (err) {
      summary[name] = `ERROR: ${err.code || err.message}`;
      console.log(`  ${name}: FAILED — ${err.code || err.message}`);
    }
  }

  writeFileSync(new URL('_summary.json', OUT_DIR), JSON.stringify(summary, null, 2) + '\n');
  console.log('\nWrote data/firestore-export/');
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
