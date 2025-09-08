// app/info/bachelors.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../../services/firebase';

import { RenderBlocks } from '../../components/RenderBlocks';
import { useInfoPage } from '../../hooks/useInfoPage';

/** Fallback content (used only if Firestore doc not found) */
const FALLBACK_PAGE = {
  title: "Undergraduate (Bachelor’s) Admissions",
  subtitle: 'Eligibility, timeline, and documents for international applicants',
  blocks: [
    { type: 'p',
      text:
        'This page summarizes the key points for undergraduate admission as a foreign applicant. ' +
        'Dates and rules vary by university; always verify the latest notice for your target school.',
    },
    { type: 'h3', text: '01) Admission schedule (typical)' },
    { type: 'note', text: 'Many universities run two rounds per intake. Replace with exact dates when available.' },
    {
      type: 'table',
      columns: [
        { key: 'cat', label: 'Category' },
        { key: 'r1', label: '1st Round' },
        { key: 'r2', label: '2nd Round' },
        { key: 'remarks', label: 'Remarks' },
      ],
      rows: [
        { cat: 'Submission of application & documents', r1: 'Fall: ~ Apr 21 → Apr 25', r2: 'Fall: ~ May 9 → Jun 3', remarks: 'Online application + fee' },
        { cat: 'Korean/English language test', r1: 'Late May', r2: 'Late Jun', remarks: 'Some schools waive with valid scores' },
        { cat: 'Announcement of results', r1: 'Early Jun', r2: 'Early Jul', remarks: 'Via admissions website' },
        { cat: 'Tuition payment / submission of originals', r1: 'Late Jun', r2: 'Mid–late Jul', remarks: 'Follow invoice deadline' },
      ],
    },
    { type: 'h3', text: '02) Application procedure' },
    { type: 'ul',
      text:
        '• Online application & payment\n' +
        '• Upload/submit required documents\n' +
        '• Interview / test (if required)\n' +
        '• Results & tuition invoice\n' +
        '• Final registration & visa documents',
    },
    { type: 'h3', text: '03) Colleges & tracks (example)' },
    { type: 'ul',
      text:
        '• Global Business, Engineering, IT/AI, Media & Design, Liberal Arts, Health & Sports, etc.\n' +
        '• Some majors offer dedicated English tracks; others require Korean proficiency.\n' +
        '• Art/design and performance majors often require portfolio or audition.',
    },
    { type: 'h3', text: '04) Applicant qualifications (typical)' },
    { type: 'ul',
      text:
        '• Applicants should meet nationality and academic requirements per university policy.\n' +
        '• Type I: both parents and applicant are foreign nationals.\n' +
        '• Type II: applicants educated entirely outside Korea (foreign or overseas Korean).\n' +
        '• Meet language requirements (Korean TOPIK / English IELTS, TOEFL, Duolingo) per major.',
    },
    { type: 'h3', text: '05) Selection process' },
    { type: 'p',
      text:
        'Most schools evaluate a composite of academic records, language proficiency, interview, and major-specific criteria. ' +
        'Minimum standards apply by department.',
    },
    { type: 'h3', text: '06–07) Required documents — Type I (both parents are foreigners)' },
    { type: 'ul',
      text:
        '• Application form (university format)\n' +
        '• Consent for records checks / personal information form\n' +
        '• Passport copy (valid)\n' +
        '• High school graduation certificate (or expected) + transcript\n' +
        '• If transferred/college courses: college transcripts & enrollment/graduation certs\n' +
        '• Official language proficiency (Korean or English) if required\n' +
        '• Financial documents (e.g., bank balance) as requested\n' +
        '• Family relationship / birth certificate to verify parents’ nationalities\n' +
        '• Apostille or consular authentication where applicable',
    },
    { type: 'h3', text: '06–07) Required documents — Type II (educated entirely outside Korea)' },
    { type: 'ul',
      text:
        '• Application form (university format)\n' +
        '• Personal information consent\n' +
        '• High school graduation certificate (or expected) + transcript (originals/translated)\n' +
        '• College transcripts & enrollment/graduation certs (if transferred)\n' +
        '• Official language proficiency (Korean TOPIK or English test)\n' +
        '• Certificate of entry/exit or education records (country-specific)\n' +
        '• Apostille / embassy legalization as required by issuing country',
    },
    { type: 'note',
      text: 'Documents not in Korean/English require a certified translation. Keep scans as PDF and submit originals when requested.' },
    { type: 'h3', text: '08) Visa service information' },
    { type: 'ul',
      text:
        '• After final registration, international students usually obtain a D-2 student visa.\n' +
        '• Universities issue a standard Certificate of Admission for visa processing.\n' +
        '• Additional embassy requirements (bank statements, transcripts) vary by country.\n' +
        '• Plan 2–5 weeks for visa issuance depending on consulate workload.',
    },
    { type: 'h3', text: '09) Office in charge of admission' },
    { type: 'p',
      text:
        'Global Admissions Team — (example) Main Building, Room 117\n' +
        'Address: 70, Tangjeong-myeon, Asan-si, Chungcheongnam-do, Korea 31460\n' +
        'TEL: +82-41-530-2090 ~ 2093 • MAIL: ug.admissions@example.ac.kr',
    },
    { type: 'h3', text: 'Important notes' },
    { type: 'ul',
      text:
        '• All documents must be in original form; if re-issue is impossible, provide verified copies.\n' +
        '• Non-Korean/English docs require a certified translation + legalization (apostille/consular).\n' +
        '• Use the official forms from the university; incomplete submissions can be rejected.\n' +
        '• Schedules and policies are subject to change — always check the latest notice.',
    },
  ],
};

export default function BachelorsInfo() {
  const router = useRouter();
  const { lang = 'en' } = useLocalSearchParams();

  // Load page content
  const { data, loading } = useInfoPage('bachelors', String(lang));
  const page = data ?? FALLBACK_PAGE;

  // Role check -> show "Edit" for managers/admins
  const [isEditor, setIsEditor] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = auth.currentUser;
        if (!u) return;
        const snap = await getDoc(doc(db, 'users', u.uid));
        const role = String(snap.data()?.role || '').toLowerCase();
        if (alive) setIsEditor(['manager', 'admin', 'superadmin'].includes(role));
      } catch { /* ignore */ }
    })();
    return () => { alive = false; };
  }, []);

  const lastUpdated = useMemo(() => {
    try {
      const ts = data?.updatedAt?.toDate?.();
      if (!ts) return null;
      return ts.toLocaleDateString();
    } catch { return null; }
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.page}>
        <Stack.Screen options={{ title: page?.title ?? "Bachelor’s Admissions" }} />

        <Header
          title={page?.title ?? "Bachelor’s Admissions"}
          subtitle={page?.subtitle}
          onBack={() => router.back()}
        />

        {/* Small language switcher (edit list as needed) */}
        <View style={s.langRow}>
          {['en', 'fr'].map((code) => {
            const active = String(lang) === code;
            return (
              <Pressable
                key={code}
                onPress={() => router.replace({ pathname: '/info/bachelors', params: { lang: code } })}
                style={[s.langBtn, active && s.langBtnActive]}
              >
                <Text style={[s.langText, active && s.langTextActive]}>{code.toUpperCase()}</Text>
              </Pressable>
            );
          })}
          {!!lastUpdated && (
            <View style={{ marginLeft: 'auto' }}>
              <Text style={s.updatedText}>Last updated: {lastUpdated}</Text>
            </View>
          )}
        </View>

        {loading && !data ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: '#64748b' }}>Loading…</Text>
          </View>
        ) : (
          <>
            {!data && (
              <View style={s.fallbackNotice}>
                <Ionicons name="information-circle" size={16} color="#854d0e" />
                <Text style={s.fallbackText}>
                  Editor content not found — showing default information.
                </Text>
              </View>
            )}
            <RenderBlocks page={page} />
          </>
        )}
      </ScrollView>

      {/* Floating edit button for editors */}
      {isEditor && (
        <Pressable
          onPress={() => router.push('/admin/info/bachelors')}
          style={s.fab}
          accessibilityRole="button"
          accessibilityLabel="Edit page"
        >
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={s.fabText}>Edit page</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */
function Header({ title, subtitle, onBack }) {
  return (
    <View style={s.header}>
      <Pressable
        onPress={onBack}
        style={s.backBtn}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={18} color="#0b3b79" />
        <Text style={s.backText}>Back</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={s.h1}>{title}</Text>
        {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
      </View>
    </View>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const C = {
  border: '#e5e7eb',
  ghostBorder: '#cbd5e1',
  ink: '#0f172a',
  body: '#334155',
  brand: '#0b3b79',
};

const s = StyleSheet.create({
  page: {
    padding: 16,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 80, // leave space for FAB
  },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.ghostBorder,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  backText: { color: C.brand, fontWeight: '700' },

  h1: { fontSize: 26, fontWeight: '800', color: C.ink },
  sub: { color: '#64748b', marginTop: 2 },

  // language row
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  langBtn: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  langBtnActive: { backgroundColor: '#0b3b79', borderColor: '#0b3b79' },
  langText: { color: C.ink, fontWeight: '800' },
  langTextActive: { color: '#fff' },
  updatedText: { color: '#64748b', fontSize: 12 },

  // fallback banner
  fallbackNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  fallbackText: { color: '#854d0e' },

  // floating edit button
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.brand,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 4 },
    }),
  },
  fabText: { color: '#fff', fontWeight: '800' },
});
