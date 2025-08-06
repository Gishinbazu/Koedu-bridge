// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB29ZIyOy19DL18HllVEuNhEXadDxaLyTc',
  authDomain: 'koedubridge.firebaseapp.com',
  projectId: 'koedubridge',
  storageBucket: 'koedubridge.appspot.com',
  messagingSenderId: '780615933001',
  appId: '1:780615933001:web:c463c99fda85fb26a13398',
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

