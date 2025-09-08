// services/users.js
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export async function updateMyProfile(uid, payload) {
  // user can update their own safe fields
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

// Admin-only role change
export async function adminSetRole(uid, role) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { role, updatedAt: serverTimestamp() }, { merge: true });
}
