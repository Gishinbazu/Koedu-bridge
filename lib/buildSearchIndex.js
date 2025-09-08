// lib/buildSearchIndex.js

/** Normalise une chaîne pour la recherche */
function normalize(s = "") {
  return s
    .toString()
    .normalize("NFKD")                // décompose accents
    .replace(/[\u0300-\u036f]/g, "")  // enlève les diacritiques
    .replace(/[’'`´]/g, " ")          // apostrophes → espace
    .replace(/[\u2010-\u2015]/g, "-") // tirets typographiques → hyphen
    .toLowerCase()
    .trim();
}

/** Tokenisation: latin/chiffres + coréen (Hangul) */
function tokenize(s = "") {
  const norm = normalize(s);
  // autorise a-z 0-9 et Hangul (가-힣)
  return norm.split(/[^a-z0-9가-힣]+/i).filter(Boolean);
}

/** Petites stopwords pour réduire le bruit (ajuste au besoin) */
const STOPWORDS_EN = new Set([
  "and","the","of","in","for","to","with","on","at","by","a","an","or","from","into","via","as",
]);
const STOPWORDS_FR = new Set([
  "et","le","la","les","de","des","du","dans","pour","avec","à","au","aux","en","sur","par","un","une",
]);

/** Génère des prefixes (edge-ngrams) 3→6 pour l’autocomplétion */
function prefixes(token) {
  const out = [];
  // on évite de multiplier pour les tokens Hangul: on garde le token entier
  const isHangul = /[가-힣]/.test(token);
  if (isHangul) return [token];

  for (let len = 3; len <= 6 && len <= token.length; len++) {
    out.push(token.slice(0, len));
  }
  return out;
}

/** Applique des synonymes simples */
function applySynonyms(tokens, synonyms = {}) {
  if (!synonyms || typeof synonyms !== "object") return tokens;
  return tokens.map(t => synonyms[t] || t);
}

/**
 * Construit un index de recherche à partir d'un document "program".
 * - concatène plusieurs champs
 * - tokenize & normalise
 * - retire stopwords et tokens trop courts
 * - ajoute des edge-ngrams pour améliorer la recherche incrémentale
 *
 * @param {Object} program
 * @param {Object} [options]
 * @param {Record<string,string>} [options.synonyms] mapping "bachelor's" -> "bachelor"
 * @param {number} [options.minLen=2] longueur min d’un token conservé
 * @param {boolean} [options.withPrefixes=true] activer les prefixes 3→6
 * @returns {string[]} tokens uniques
 */
export function buildSearchIndex(program = {}, options = {}) {
  const {
    title, subtitle, description, university, campus,
    level, semester, tags = [], keywords = [],
    language, duration, city, country,
  } = program;

  const {
    synonyms,
    minLen = 2,
    withPrefixes = true,
  } = options;

  const source = [
    title, subtitle, description,
    university, campus,
    level, semester,
    language, duration, city, country,
    ...(tags || []), ...(keywords || []),
  ].filter(Boolean).join(" ");

  // 1) tokenisation
  let toks = tokenize(source);

  // 2) stopwords + longueur mini
  toks = toks.filter(t =>
    t.length >= minLen &&
    !STOPWORDS_EN.has(t) &&
    !STOPWORDS_FR.has(t)
  );

  // 3) synonymes
  toks = applySynonyms(toks, synonyms);

  // 4) prefixes pour l’autocomplétion
  const expanded = new Set(toks);
  if (withPrefixes) {
    for (const t of toks) {
      for (const p of prefixes(t)) expanded.add(p);
    }
  }

  return Array.from(expanded);
}

/**
 * Variante pratique si tu veux juste passer des synonymes rapidement.
 * @param {Object} program
 * @param {Record<string,string>} synonyms
 */
export function buildSearchIndexWithSynonyms(program = {}, synonyms = {}) {
  return buildSearchIndex(program, { synonyms });
}

// — Exemples de synonymes possibles —
// const SYNONYMS = {
//   "bachelor's": "bachelor",
//   "masters": "master",
//   "msc": "master",
//   "phd": "doctorate",
//   "ai": "artificialintelligence",
//   "ml": "machinelearning",
// };
