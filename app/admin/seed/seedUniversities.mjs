import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSearchIndex } from '../../lib/buildSearchIndex.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'universities.sample.json');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'serviceAccount.json');

function readJSON(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function ensureApp(){
  const conf = readJSON(SERVICE_ACCOUNT_PATH);
  return getApps().length ? getApp() : initializeApp({ credential: cert(conf), projectId: conf.project_id });
}

async function main(){
  const items = readJSON(DATA_PATH);
  ensureApp();
  const db = getFirestore();

  const batch = db.batch();
  const now = new Date().toISOString();
  items.forEach(u => {
    const ref = db.collection('universities').doc(u.id);
    batch.set(ref, {
      ...u,
      searchIndex: (u.searchIndex && u.searchIndex.length) ? u.searchIndex : buildSearchIndex(u),
      createdAt: now,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
  await batch.commit();
  console.log(`✅ Seed universities: ${items.length}`);
}
main().catch(e => { console.error(e); process.exit(1); });
