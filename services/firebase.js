// services/firebase.js
import { isSupported as analyticsSupported, getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Utilise seulement les variables EXPO_PUBLIC_* (compatibles Expo Web + Vercel)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialise Firebase (évite les doublons avec getApps)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ⚡️ Services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 📊 Analytics uniquement côté navigateur et si supporté
export let analytics;
if (typeof window !== "undefined") {
  analyticsSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);
      console.log("[Firebase] Analytics activé");
    }
  });
  console.log("[Firebase] project:", firebaseConfig.projectId);
  console.log("[Firebase] apiKey last5:", firebaseConfig.apiKey?.slice(-5));
}
