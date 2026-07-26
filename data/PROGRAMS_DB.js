// app/data/PROGRAMS_DB.js
// Centralised DB for KOEDU Bridge – Sunmoon 2026

import { BACHELOR_PROGRAMS_2026 } from './BACHELOR_DB';
import { GRADUATE_PROGRAMS_2026 } from './GRADUATE_DB';
import { LANGUAGE_PROGRAMS_2026 } from './LANGUAGE_DB';

// Tableau à plat pour les listes / recherche
export const PROGRAMS_2026 = [
  ...LANGUAGE_PROGRAMS_2026,
  ...BACHELOR_PROGRAMS_2026,
  ...GRADUATE_PROGRAMS_2026,
];

// Helpers simples -------------------------------------------------------------

export function getProgramById(id) {
  return PROGRAMS_2026.find((p) => p.id === id) || null;
}

export function searchPrograms({ q = '', level = 'All', language = 'All' } = {}) {
  const query = q.trim().toLowerCase();

  return PROGRAMS_2026.filter((p) => {
    if (level !== 'All' && p.level !== level) return false;
    if (language !== 'All' && p.language !== language) return false;

    if (!query) return true;

    const blob = [
      p.name,
      p.shortName,
      p.university,
      p.campus,
      p.city,
      p.level,
      p.language,
      p.overview,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return blob.includes(query);
  });
}
