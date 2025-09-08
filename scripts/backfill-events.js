// scripts/backfill-events.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    serverTimestamp, Timestamp,
    updateDoc
} from 'firebase/firestore';

// 1) put your web config here
const firebaseConfig = { /* ... */ };

const EMAIL = 'manager@example.com';  // manager account
const PASS  = '***';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function asTimestampFromDateString(yyyyMmDd) {
  // Fallback: noon UTC to avoid TZ edge-cases
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  return Timestamp.fromDate(d);
}

(async () => {
  await signInWithEmailAndPassword(auth, EMAIL, PASS);
  const uid = auth.currentUser.uid;

  const snap = await getDocs(collection(db, 'events'));
  for (const d of snap.docs) {
    const data = d.data();
    const patch = {};

    if (!('createdBy' in data)) patch.createdBy = uid;
    if (!('attendees' in data)) patch.attendees = [uid];

    // migrate `date: "YYYY-MM-DD"` → startAt/endAt on that day
    if (!('startAt' in data) && typeof data.date === 'string') {
      const start = asTimestampFromDateString(data.date);
      const end = asTimestampFromDateString(data.date); // same day; adjust if needed
      patch.startAt = start;
      patch.endAt = end;
    }

    if (Object.keys(patch).length) {
      patch.migratedAt = serverTimestamp();
      await updateDoc(doc(db, 'events', d.id), patch);
      console.log('Updated', d.id, patch);
    }
  }
  console.log('Done');
  process.exit(0);
})();
