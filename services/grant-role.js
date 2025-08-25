#!/usr/bin/env node
/* scripts/grant-role.js
 * Usage exemples:
 *   node scripts/grant-role.js --email alice@example.com --role admin
 *   node scripts/grant-role.js --uid ABC123 --role manager
 * Options:
 *   --dry-run      : n'applique pas les changements, affiche ce qui serait fait
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function log(...a) { console.log('[grant-role]', ...a); }
function error(...a) { console.error('[grant-role]', ...a); process.exitCode = 1; }

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const k = args[i];
    const v = args[i + 1];
    if (k === '--uid') out.uid = v;
    if (k === '--email') out.email = v;
    if (k === '--role') out.role = v?.toLowerCase();
    if (k === '--dry-run') out.dryRun = true;
  }
  return out;
}

function initAdmin() {
  if (admin.apps.length) return;

  // 1) GOOGLE_APPLICATION_CREDENTIALS (recommandé)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    return;
  }

  // 2) FIREBASE_ADMIN_CREDENTIALS (JSON inline)
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    const json = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(json),
    });
    return;
  }

  // 3) Fichier local scripts/serviceAccountKey.json
  const localJson = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(localJson)) {
    const json = require(localJson);
    admin.initializeApp({
      credential: admin.credential.cert(json),
    });
    return;
  }

  throw new Error(
    'Aucune crédential admin trouvée. ' +
      'Utilise GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_ADMIN_CREDENTIALS, ou scripts/serviceAccountKey.json'
  );
}

function validateRole(role) {
  const allowed = ['user', 'manager', 'admin', 'superadmin'];
  if (!allowed.includes(role)) {
    throw new Error(`--role doit être parmi: ${allowed.join(', ')}`);
  }
}

(async function main() {
  const { uid, email, role, dryRun } = parseArgs();
  if (!uid && !email) {
    throw new Error('Spécifie --uid ou --email');
  }
  if (!role) {
    throw new Error('Spécifie --role (user|manager|admin|superadmin)');
  }
  validateRole(role);

  initAdmin();
  const auth = admin.auth();
  const db = admin.firestore();

  // Récupération utilisateur
  let userRecord;
  if (uid) {
    userRecord = await auth.getUser(uid);
  } else {
    userRecord = await auth.getUserByEmail(email);
  }

  const targetUid = userRecord.uid;
  const targetEmail = userRecord.email || email || '';
  log('Target:', { uid: targetUid, email: targetEmail, role, dryRun: !!dryRun });

  // Déterminer les claims
  const nextClaims = { ...(userRecord.customClaims || {}) };

  // Normalisation: un seul rôle actif principal
  nextClaims.admin = role === 'admin' || role === 'superadmin';
  nextClaims.manager = role === 'manager';
  nextClaims.role = role; // pratique côté client (facultatif)

  // Mise à jour claims
  if (dryRun) {
    log('[dry-run] setCustomUserClaims:', nextClaims);
  } else {
    await auth.setCustomUserClaims(targetUid, nextClaims);
  }

  // Mise à jour du doc Firestore /users/{uid}
  const userRef = db.collection('users').doc(targetUid);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const userPayload = {
    role,
    email: targetEmail,
    displayName: userRecord.displayName || '',
    isNewUser: false,
    updatedAt: now,
    lastLoginAt: now,
  };

  const snap = await userRef.get();
  if (dryRun) {
    log('[dry-run]', snap.exists ? 'updateDoc' : 'setDoc', userPayload);
  } else {
    if (snap.exists) {
      await userRef.set(userPayload, { merge: true });
    } else {
      userPayload.createdAt = now;
      await userRef.set(userPayload, { merge: true });
    }
  }

  // Forcer refresh token pour que le client récupère les nouveaux claims
  if (!dryRun) {
    await auth.revokeRefreshTokens(targetUid);
  }

  log('✅ Fini. Rôle & claims appliqués.');
})().catch((e) => {
  error('❌ Échec:', e.message);
  if (e?.stack) console.error(e.stack);
  process.exit(1);
});
