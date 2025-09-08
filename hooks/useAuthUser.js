// hooks/useAuthUser.js
// Lightweight auth state + user profile + role helpers
// Requires you to have initialized firebase in services/firebase.js:
//
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

import {
    signOut as fbSignOut,
    getIdTokenResult,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../services/firebase';

/**
 * Shape returned:
 * {
 *   user,                 // Firebase Auth user (or null)
 *   profile,              // Firestore user doc (or null)
 *   role,                 // 'guest' | 'user' | 'manager' | 'admin' | 'superadmin'
 *   loading,              // overall loading state
 *   authLoading,          // auth listener still resolving
 *   profileLoading,       // firestore doc still resolving
 *   isSignedIn,           // boolean
 *   isManager, isAdmin, isSuperadmin,
 *   canEditInfoPages,     // convenience (manager/admin/superadmin)
 *   signOut,              // function
 *   error,                // last error if any (string)
 * }
 */
export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [claims, setClaims] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setAuthLoading(false);
      setError('');
      setUser(u || null);

      // clear previous profile listener
      if (typeof unsubProfile === 'function') {
        unsubProfile();
        unsubProfile = null;
      }

      if (!u) {
        setProfile(null);
        setClaims(null);
        return;
      }

      // Custom claims (optional, used as fallback if you ever add them)
      try {
        const tok = await getIdTokenResult(u, true);
        setClaims(tok.claims || null);
      } catch (e) {
        // not fatal
        setClaims(null);
      }

      // Live user profile from Firestore
      setProfileLoading(true);
      const ref = doc(db, 'users', u.uid);
      unsubProfile = onSnapshot(
        ref,
        (snap) => {
          setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
          setProfileLoading(false);
        },
        (e) => {
          setError(e?.message || 'Failed to read user profile');
          setProfile(null);
          setProfileLoading(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (typeof unsubProfile === 'function') unsubProfile();
    };
  }, []);

  // Resolve role: Firestore doc first, then claims, default 'user' if signed in, else 'guest'
  const role = useMemo(() => {
    if (!user) return 'guest';
    const fromDoc = profile?.role;
    const fromClaims =
      (claims?.role && String(claims.role)) ||
      (claims?.admin ? 'admin' : null); // example if you had boolean claim
    return (fromDoc || fromClaims || 'user').toLowerCase();
  }, [user, profile?.role, claims]);

  const isSignedIn = !!user;
  const isManager = ['manager', 'admin', 'superadmin'].includes(role);
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isSuperadmin = role === 'superadmin';

  const canEditInfoPages = isManager || isAdmin || isSuperadmin;

  const loading = authLoading || (isSignedIn && profileLoading);

  const signOut = async () => {
    setError('');
    try {
      await fbSignOut(auth);
    } catch (e) {
      setError(e?.message || 'Sign out failed');
      throw e;
    }
  };

  return {
    user,
    profile,
    role,
    loading,
    authLoading,
    profileLoading,
    isSignedIn,
    isManager,
    isAdmin,
    isSuperadmin,
    canEditInfoPages,
    signOut,
    error,
  };
}

export default useAuthUser;
