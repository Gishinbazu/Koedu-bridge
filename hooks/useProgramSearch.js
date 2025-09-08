// hooks/useProgramSearch.js — filter by universityId + client keyword match
import { collection, getDocs, query, where /*, orderBy, limit */ } from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '../services/firebase';

// --- helpers ---------------------------------------------------------------
const tokenize = (s) =>
  (s || '')
    .toLowerCase()
    .split(/[^a-z0-9가-힣]+/i)
    .filter(Boolean);

// Normalise '2025–Fall' / '2025—Fall' -> '2025-Fall'
const normalizeSemester = (s = '') => s.replace(/[–—]/g, '-').trim();

// --- hook ------------------------------------------------------------------
export function useProgramSearch() {
  const searchPrograms = useCallback(
    async ({ semester, keyword, level, universityId, orderByTitle = false }) => {
      // normalisations
      const sem = normalizeSemester(semester || 'Any');
      const lvl = (level || 'All').trim();
      const uid = (universityId || '').trim();

      console.log('[search] payload =', { semester: sem, keyword, level: lvl, universityId: uid, orderByTitle });

      // build Firestore query
      const filters = [];
      if (sem !== 'Any') filters.push(where('semester', '==', sem));
      if (lvl !== 'All') filters.push(where('level', '==', lvl));
      if (uid)           filters.push(where('universityId', '==', uid));

      let qref = filters.length
        ? query(collection(db, 'programs'), ...filters)
        : query(collection(db, 'programs'));

      // ⚠️ If you enable orderBy on Firestore, add the required composite index
      // if (orderByTitle) qref = query(qref, orderBy('title'));

      const snap = await getDocs(qref);
      console.log('[search] fetched =', snap.size);

      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // keyword filter (client-side fallback)
      const tokens = tokenize(keyword);
      if (!tokens.length) {
        console.log('[search] after filter =', rows.length);
        return rows;
      }

      // Prefer p.searchTokens if present; fallback to text fields
      const filtered = rows.filter((p) => {
        const idx = Array.isArray(p.searchTokens) ? p.searchTokens : (Array.isArray(p.searchIndex) ? p.searchIndex : []);
        if (idx.length) return tokens.every((t) => idx.includes(t));
        const text = `${p.title || ''} ${p.description || ''} ${p.universityId || ''}`.toLowerCase();
        return tokens.every((t) => text.includes(t));
      });

      console.log('[search] after filter =', filtered.length);
      return filtered;
    },
    []
  );

  return { searchPrograms };
}
