// utils/AuthGuard.js
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';

/**
 * ✅ Hook React pour protéger les pages : redirige vers /login si non connecté
 * et récupère le rôle depuis Firestore (user/admin/superadmin)
 */
export const useAuthGuard = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user', 'admin', 'superadmin'
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const userData = snap.data();
            const currentRole = userData.role || 'user';
            setRole(currentRole);
            console.log('✅ Rôle utilisateur détecté :', currentRole);
          } else {
            console.warn('⚠️ Aucun document utilisateur trouvé.');
            setRole('user');
          }
        } catch (e) {
          console.error('❌ Erreur lors du chargement du rôle utilisateur :', e);
          setRole('user');
        }
      } else {
        router.replace('/login');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
};

/**
 * ✅ Vérifie si l'utilisateur est connecté (promesse utilisable dans des fonctions async)
 */
export const checkAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * ✅ Vérifie si l'utilisateur a accès admin (admin OU superadmin)
 */
export const checkAdminAccess = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    const role = snap.exists() ? snap.data().role : null;
    return ['admin', 'superadmin'].includes(role);
  } catch (e) {
    console.error('Erreur vérification accès admin :', e);
    return false;
  }
};

/**
 * ✅ Vérifie si l'utilisateur est superadmin UNIQUEMENT
 */
export const checkSuperAdminAccess = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() && snap.data().role === 'superadmin';
  } catch (e) {
    console.error('Erreur vérification superadmin :', e);
    return false;
  }
};

/**
 * ✅ Renvoie true si le rôle est admin ou superadmin (pour logique de composants)
 */
export const isAdmin = (role) => {
  return ['admin', 'superadmin'].includes(role);
};

/**
 * ✅ Renvoie true si le rôle est superadmin (pour logique de composants)
 */
export const isSuperAdmin = (role) => {
  return role === 'superadmin';
};
