#!/usr/bin/env node
/* scripts/reset-project.js
 * Nettoyage des artefacts locaux pour repartir sainement.
 *
 * Usage:
 *   node scripts/reset-project.js
 *   node scripts/reset-project.js --hard        // supprime aussi node_modules + lockfiles
 */

const fs = require('fs');
const path = require('path');

const CWD = process.cwd();

const SOFT_PATHS = [
  '.expo',
  '.expo-shared',
  '.turbo',
  '.parcel-cache',
  '.next',             // au cas où
  'dist',
  'web-build',
  'build',             // expo export peut l’utiliser selon versions
  'android/.gradle',
  'android/build',
  'ios/build',
  'expo-env.d.ts',
  'metro-cache',       // au cas où
];

const HARD_PATHS = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

function rm(p) {
  const full = path.join(CWD, p);
  if (fs.existsSync(full)) {
    try {
      fs.rmSync(full, { recursive: true, force: true });
      console.log('🧹 removed', p);
    } catch (e) {
      console.error('⚠️  failed to remove', p, e.message);
    }
  }
}

function hasFlag(name) {
  return process.argv.includes(name);
}

(function main() {
  const hard = hasFlag('--hard');

  console.log('== Reset project ==');
  console.log('cwd:', CWD);
  console.log('mode:', hard ? 'HARD' : 'SOFT');

  SOFT_PATHS.forEach(rm);

  if (hard) {
    HARD_PATHS.forEach(rm);
  }

  console.log('\n✅ Terminé.');
  if (hard) {
    console.log('➡️  Re-installe les deps:');
    console.log('   npm i    (ou yarn / pnpm i)');
  }
  console.log('➡️  Relance propre:');
  console.log('   npm run dev   (ou)  expo start -c\n');
})();
