// app/admin/seed/seedPrograms.mjs
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ⬅️ chemin corrigé: on remonte de app/admin/seed → app/admin → app → racine
import { buildSearchIndex } from '../../../lib/buildSearchIndex.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_PATH = path.join(__dirname, 'programs.sample.json');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'serviceAccount.json');
// le schéma est attendu à la racine dans data/
const SCHEMA_PATH = path.resolve('data/program.schema.json');

// ── CLI flags ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const isDryRun = argv.includes('--dry') || argv.includes('--dry-run');
const fileArg = argv.find(a => a.startsWith('--file='));
const DATA_PATH = fileArg ? path.resolve(fileArg.split('=')[1]) : DEFAULT_DATA_PATH;

// ── Helpers ─────────────────────────────────────────────────────────────────
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureApp() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('❌ serviceAccount.json manquant (app/admin/seed/). Ajoute le fichier et relance.');
    process.exit(1);
  }
  const conf = readJSON(SERVICE_ACCOUNT_PATH);
  return getApps().length ? getApp() : initializeApp({
    credential: cert(conf),
    projectId: conf.project_id,
  });
}

function validateItems(items) {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.warn('⚠️  data/program.schema.json introuvable — validation AJV sautée.');
    return { ok: true, errors: [] };
  }
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schema = readJSON(SCHEMA_PATH);
  const validate = ajv.compile(schema);

  const errors = [];
  const seenIds = new Set();

  items.forEach((p, i) => {
    if (!p.id || typeof p.id !== 'string') {
      errors.push({ index: i, id: p.id, reason: 'Missing or invalid "id"' });
    } else if (seenIds.has(p.id)) {
      errors.push({ index: i, id: p.id, reason: 'Duplicate "id"' });
    } else {
      seenIds.add(p.id);
    }

    const valid = validate(p);
    if (!valid) {
      errors.push({ index: i, id: p.id, reason: 'Schema validation failed', details: validate.errors });
    }
  });

  return { ok: errors.length === 0, errors };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('➡️  DATA_PATH:', DATA_PATH);
  console.log('➡️  SERVICE_ACCOUNT_PATH:', SERVICE_ACCOUNT_PATH);
  console.log('➡️  SCHEMA_PATH:', SCHEMA_PATH);

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`❌ Fichier data introuvable: ${DATA_PATH}`);
    process.exit(1);
  }

  const items = readJSON(DATA_PATH);
  if (!Array.isArray(items) || items.length === 0) {
    console.error('❌ Le fichier JSON doit contenir un tableau non vide.');
    process.exit(1);
  }

  // Validation
  const { ok, errors } = validateItems(items);
  if (!ok) {
    console.error('❌ Données invalides:');
    for (const e of errors) {
      console.error(`  - index=${e.index} id=${e.id ?? 'N/A'} reason=${e.reason}`);
      if (e.details) console.error('    details:', JSON.stringify(e.details, null, 2));
    }
    process.exit(1);
  }

  // Enrichissement: searchIndex + timestamps par défaut
  const nowIso = new Date().toISOString();
  const enriched = items.map(p => ({
    ...p,
    searchIndex: buildSearchIndex(p),
    updatedAt: nowIso,
    createdAt: p.createdAt || nowIso,
    status: p.status || 'published',
  }));

  if (isDryRun) {
    console.log(`🔎 Dry-run: ${enriched.length} item(s) prêts à être upsert (aucune écriture).`);
    console.log('Exemple:', JSON.stringify(enriched[0], null, 2).slice(0, 800) + '...');
    process.exit(0);
  }

  // Init Admin & DB
  ensureApp();
  const db = getFirestore();

  // Batch (par 400 pour marge sous la limite 500)
  const CHUNK = 400;
  let count = 0;
  for (let i = 0; i < enriched.length; i += CHUNK) {
    const batch = db.batch();
    const slice = enriched.slice(i, i + CHUNK);

    slice.forEach(p => {
      const ref = db.collection('programs').doc(p.id);
      batch.set(ref, { ...p, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    });

    await batch.commit();
    count += slice.length;
    console.log(`✅ Upsert ${count}/${enriched.length}`);
  }

  console.log('🎉 Seed terminé avec succès.');
}

// Run
main().catch((e) => {
  console.error('💥 Seed error:', e);
  process.exit(1);
});
