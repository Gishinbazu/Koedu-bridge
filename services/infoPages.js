// services/infoPages.js
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function subscribeInfoPage(slug, cb) {
  const ref = doc(db, 'infoPages', slug);
  return onSnapshot(ref, (snap) => cb(snap.exists() ? snap.data() : null));
}

export async function saveInfoPage({ slug, title, subtitle = '', lang = 'en', blocks, userId }) {
  const ref = doc(db, 'infoPages', slug);
  await setDoc(
    ref,
    {
      slug,
      title,
      subtitle,
      lang,
      blocks,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    },
    { merge: true }
  );
}
