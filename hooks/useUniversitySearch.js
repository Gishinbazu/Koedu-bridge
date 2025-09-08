// app/hooks/useUniversitySearch.js
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '../services/firebase';

const tokenize = (s) =>
  (s || '')
    .toLowerCase()
    .split(/[^a-z0-9가-힣]+/i)
    .filter(Boolean);

export function useUniversitySearch() {
  const searchUniversities = useCallback(
    async ({ region = 'All', type = 'All', keyword = '' } = {}) => {
      // base query
      let qref = query(collection(db, 'universities'), orderBy('rank'));
      const filters = [];
      if (region && region !== 'All') filters.push(where('region', '==', region));
      if (type && type !== 'All') filters.push(where('type', '==', type));
      if (filters.length) qref = query(collection(db, 'universities'), ...filters);

      const snap = await getDocs(qref);
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // client-side keyword filter (fallback if no searchTokens)
      const tokens = tokenize(keyword);
      if (!tokens.length) return rows;

      return rows.filter((u) => {
        const idx = Array.isArray(u.searchTokens) ? u.searchTokens : u.searchIndex || [];
        if (idx.length) return tokens.every((t) => idx.includes(t));
        const text = `${u.name || ''} ${u.city || ''} ${u.region || ''} ${u.type || ''} ${u.shortDesc || ''}`.toLowerCase();
        return tokens.every((t) => text.includes(t));
      });
    },
    []
  );

  return { searchUniversities };
}
