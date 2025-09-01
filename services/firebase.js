// services/firebase.js
import { isSupported as analyticsSupported, getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const env = (k) => (process.env[k] ?? "").trim();

const firebaseConfig = {
  apiKey: env("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: env("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: env("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("EXPO_PUBLIC_FIREBASE_APP_ID"),
  measurementId: env("EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics uniquement sur le web (sinon "window is not defined")
export let analytics;
if (typeof window !== "undefined") {
  analyticsSupported().then((ok) => { if (ok) analytics = getAnalytics(app); });
  // petit log utile pour vérifier les valeurs chargées
  console.log("[Firebase] project:", firebaseConfig.projectId);
  console.log("[Firebase] apiKey last5:", firebaseConfig.apiKey?.slice(-5));
}
