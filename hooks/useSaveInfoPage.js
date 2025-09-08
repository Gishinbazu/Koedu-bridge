// hooks/useSaveInfoPage.js
import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useSaveInfoPage() {
  const savePage = async ({ slug, lang = 'en', title, subtitle, blocks, published }) => {
    const uid = getAuth()?.currentUser?.uid || 'system';
    const id = `${slug}_${lang}`;
    await setDoc(
      doc(db, 'infoPages', id),
      {
        slug, lang, title: title ?? '', subtitle: subtitle ?? '',
        blocks: Array.isArray(blocks) ? blocks : [],
        published: !!published,
        updatedAt: serverTimestamp(),
        updatedBy: uid,
      },
      { merge: true }
    );
  };

  const publishPage = async (slug, lang, published) => {
    const uid = getAuth()?.currentUser?.uid || 'system';
    await updateDoc(doc(db, 'infoPages', `${slug}_${lang}`), {
      published: !!published,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  };

  return { savePage, publishPage };
}
