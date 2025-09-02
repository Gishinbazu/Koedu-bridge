// utils/AuthGuard.js
import { usePathname, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { auth, db } from '../services/firebase';

export const useAuthGuard = (opts = {}) => {
  const { requireAdmin = false, requireSuperadmin = false } = opts;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);      // 'user' | 'admin' | 'superadmin'
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted.current) return;

      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setHasProfile(true);
        setLoading(false);

        // Empêche la boucle: si on est déjà sur /login on ne re-route pas
        if (!pathname.startsWith('/auth') && pathname !== '/login') {
          router.replace('/login');
        }
        return;
      }

      setUser(firebaseUser);
      setLoading(true);

      // 📌 Abonnement live au document users/{uid}
      const userRef = doc(db, 'users', firebaseUser.uid);
      const unsubDoc = onSnapshot(
        userRef,
        (snap) => {
          if (!mounted.current) return;

          if (!snap.exists()) {
            setHasProfile(false);
            setRole('user'); // défaut
            setLoading(false);

            // Si pas de profil, renvoie l’utilisateur vers un écran d’onboarding
            if (pathname !== '/auth/onboarding') {
              router.replace('/auth/onboarding');
            }
            return;
          }

          setHasProfile(true);
          const r = snap.data()?.role || 'user';
          setRole(r);
          setLoading(false);

          // 🔐 Garde d’accès
          if (requireSuperadmin && r !== 'superadmin') {
            router.replace('/403'); // page d’accès refusé
          } else if (requireAdmin && !['admin', 'superadmin'].includes(r)) {
            router.replace('/403');
          }
        },
        (err) => {
          console.error('[AuthGuard] onSnapshot error', err);
          setRole('user');
          setLoading(false);
        }
      );

      // Nettoyage du listener doc quand l’auth change
      return () => unsubDoc();
    });

    return () => {
      mounted.current = false;
      unsubAuth();
    };
  }, [pathname, requireAdmin, requireSuperadmin]);

  return { user, role, loading, hasProfile };
};

// Helpers
export const isAdmin = (role) => ['admin', 'superadmin'].includes(role);
export const isSuperAdmin = (role) => role === 'superadmin';
