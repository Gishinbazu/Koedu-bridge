// hooks/useInfoPage.js
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';

export function useInfoPage(slug, lang = 'en') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const id = `${slug}_${lang}`;
    const ref = doc(db, 'infoPages', id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? { id, ...snap.data() } : null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [slug, lang]);

  return { data, loading, error };
}
