// scripts/seed-infoPages.js
import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Call this function once from anywhere (e.g., a hidden dev screen or a CLI script).
 * Make sure you're signed in; it uses the current user's UID for updatedBy.
 */
export async function seedBachelorsEn() {
  const uid = getAuth()?.currentUser?.uid || 'seed';
  const ref = doc(db, 'infoPages', 'bachelors_en');

  await setDoc(ref, {
    slug: 'bachelors',
    lang: 'en',
    title: "Undergraduate (Bachelor’s) Admissions",
    subtitle: 'Eligibility, timeline, and documents for international applicants',
    published: true,
    blocks: [
      { type: 'p', text: 'This page summarizes the key points for undergraduate admission as a foreign applicant. Dates and rules vary by university; always verify the latest notice for your target school.' },
      { type: 'h3', text: 'Admission schedule (typical)' },
      {
        type: 'table',
        columns: [
          { key: 'cat', label: 'Category' },
          { key: 'r1', label: '1st Round' },
          { key: 'r2', label: '2nd Round' },
          { key: 'remarks', label: 'Remarks' }
        ],
        rows: [
          { cat: 'Submit application & docs', r1: 'Apr 21 → Apr 25', r2: 'May 9 → Jun 3', remarks: 'Online + fee' },
          { cat: 'Language test', r1: 'Late May', r2: 'Late Jun', remarks: 'Waiver with valid scores' },
          { cat: 'Results', r1: 'Early Jun', r2: 'Early Jul', remarks: 'Admissions website' },
          { cat: 'Tuition / originals', r1: 'Late Jun', r2: 'Mid–late Jul', remarks: 'Pay by invoice' }
        ]
      },
      { type: 'h3', text: 'Required documents (Type I)' },
      { type: 'ul', text: '• Application form\n• Passport copy\n• High school graduation + transcripts\n• Language score (if required)\n• Family relationship / birth certificate\n• Financial proof\n• Apostille/consular legalization' },
      { type: 'h3', text: 'Visa (D-2) & contact' },
      { type: 'p', text: 'After final registration, request a D-2 student visa with the Certificate of Admission and required bank/transcript documents. Contact your admissions office for country-specific details.' }
    ],
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  }, { merge: true });

  return 'bachelors_en seeded';
}
