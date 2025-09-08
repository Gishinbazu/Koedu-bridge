// hooks/useAuthRole.js
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';

export function useAuthRole() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'manager' | 'admin' | 'superadmin' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setRole(snap.exists() ? snap.data().role ?? null : null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const isEditor = role === 'manager' || role === 'admin' || role === 'superadmin';

  return { user, role, isEditor, loading };
}
