// scripts/createAdmin.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export const createAdminAccount = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      role: 'admin',
      email,
      createdAt: new Date(),
    });

    console.log('✅ Admin account created with UID:', uid);
  } catch (error) {
    console.error('❌ Erreur création compte admin :', error.message);
  }
};
