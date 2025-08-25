// services/firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚙️ Config depuis l'environnement (Expo Web ⇒ EXPO_PUBLIC_*)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  const msg =
    `[firebase] Variables manquantes: ${missing.join(", ")}. ` +
    `Ajoute les EXPO_PUBLIC_* dans .env (et redémarre Expo).`;
  if (process.env.NODE_ENV === "production") throw new Error(msg);
  else console.warn(msg);
}

// ✅ Init unique (HMR safe)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Logs dev
if (process.env.NODE_ENV !== "production") {
  console.log("[firebase] projectId =", app.options.projectId);
}

// 🔐 (Optionnel) sign-in anonyme si activé côté Auth
let ensurePromise = null;

export function ensureSignedIn() {
  if (ensurePromise) return ensurePromise;

  ensurePromise = new Promise(async (resolve) => {
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
    } catch (e) {
      if (e?.code === "auth/admin-restricted-operation") {
        console.warn(
          "[firebase] Anonymous sign-in disabled; continuing unauthenticated."
        );
      } else {
        console.error("[firebase] Auth init error:", e);
      }
    } finally {
      const unsub = onAuthStateChanged(auth, () => {
        unsub();
        resolve();
      });
    }
  });

  return ensurePromise;
}
