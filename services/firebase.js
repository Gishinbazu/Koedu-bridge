// services/firebase.js
import { isSupported as analyticsSupported, getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const first = (...keys) => {
  for (const k of keys) {
    const v = (process.env[k] ?? "").trim();
    if (v) return v;
  }
  return "";
};

const firebaseConfig = {
  apiKey: first("NEXT_PUBLIC_FIREBASE_API_KEY", "EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: first("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: first("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: first("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: first("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: first("NEXT_PUBLIC_FIREBASE_APP_ID", "EXPO_PUBLIC_FIREBASE_APP_ID"),
  measurementId: first("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics uniquement côté navigateur
export let analytics;
if (typeof window !== "undefined") {
  analyticsSupported().then(ok => { if (ok) analytics = getAnalytics(app); });
  console.log("[Firebase] project:", firebaseConfig.projectId);
  console.log("[Firebase] apiKey last5:", firebaseConfig.apiKey?.slice(-5));
}
