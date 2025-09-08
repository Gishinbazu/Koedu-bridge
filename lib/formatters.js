// lib/formatters.js

/** Formatte une devise en KRW (par défaut) avec 0 décimales */
export function formatCurrencyKRW(value, fallback = '—') {
  if (value == null || value === '') return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  try {
    return new Intl.NumberFormat('en-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // vieux moteurs JS: fallback simple
    return `${Math.round(n).toLocaleString('en-KR')} KRW`;
  }
}

/** Normalise un semestre "YYYY-Season" (ex: 2026-Spring) */
export function normalizeSemester(sem) {
  if (!sem || typeof sem !== 'string') return sem;
  const [y, s] = sem.split('-');
  if (!y || !s) return sem;
  const season = s[0].toUpperCase() + s.slice(1).toLowerCase();
  return `${y}-${season}`;
}

/** Affiche joliment un semestre (ex: "Spring 2026") */
export function formatSemester(sem, fallback = '—') {
  if (!sem || typeof sem !== 'string') return fallback;
  const [y, s] = normalizeSemester(sem).split('-');
  if (!y || !s) return sem;
  return `${s} ${y}`;
}

/** Concatène proprement des métadonnées (université • niveau • semestre) */
export function formatMeta({ university, level, semester }, sep = ' • ') {
  return [university, level, semester].filter(Boolean).join(sep);
}

/** Tronque un texte sans couper trop brutalement */
export function truncate(text, max = 140) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

/** Sécurise l’affichage d’un champ optionnel */
export function fmt(v, fallback = '—') {
  return v == null || v === '' ? fallback : String(v);
}
