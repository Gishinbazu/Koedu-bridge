// app/info/korean-language.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

const SECTIONS = [
  {
    title: 'What is a KLI (Korean Language Institute)?',
    body: [
      'KLI programs are intensive Korean classes offered by many universities.',
      'It’s the best path to reach TOPIK 3–4+ for undergraduate/graduate admission—or simply prepare for life and work in Korea.',
    ],
  },
  {
    title: 'Who is it for?',
    bullets: [
      'Beginners through advanced learners (classes are level-placed).',
      'Students preparing for TOPIK 3–6 to enter degree programs.',
      'Gap-year learners or professionals improving language skills.',
    ],
  },
  {
    title: 'Academic format',
    bullets: [
      'Duration: ~10–12 weeks per session (often 4 hours/day, Mon–Fri).',
      'Electives & cultural classes (varies by university).',
      'Class times often split (e.g., 09:10–13:00 or 13:30–17:20).',
    ],
  },
  {
    title: 'Visa, housing, and arrival',
    bullets: [
      'Visa: most KLI students use the D-4 (general trainee) visa.',
      'Housing: on-campus dorms or nearby studios (gosiwon/officetel).',
      'Arrival: SIM, bank account, ARC registration support (varies by campus).',
    ],
  },
  {
    title: 'How KOEDU Bridge helps',
    bullets: [
      'We match you with suitable KLI centers and schedules.',
      'We assemble your document pack and track your application.',
      'We guide visa, housing, insurance, and orientation.',
    ],
  },
];

export default function KoreanLanguageScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Korean Language (KLI)' }} />

      {/* space under fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO (same style as bachelors) */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.85, transform: [{ translateY: 1 }] },
            ]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={18} color="#e5edff" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.badge}>
            <Ionicons name="language-outline" size={16} color="#0b1120" />
            <Text style={styles.badgeText}>KLI</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Korean Language Programs (KLI)</Text>
        <Text style={styles.heroSubtitle}>
          Intensive university language courses in Korea — plan your intake, fees, visa, and
          arrival with KOEDU Bridge.
        </Text>

        {/* quick chips */}
        <View style={styles.chipsRow}>
          <Chip icon="time-outline" label="10–12 weeks / term" />
          <Chip icon="document-text-outline" label="Visa + documents" />
          <Chip icon="school-outline" label="TOPIK pathway" />
        </View>
      </View>

      {/* SECTIONS (same cards as bachelors) */}
      <View style={styles.sectionsWrap}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.body?.map((p, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {p}
              </Text>
            ))}

            {section.bullets?.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* KEY DATES (dark mini table like deadlines) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🗓️ Typical yearly sessions</Text>
          <Text style={styles.paragraph}>
            Many universities run 4 terms per year. Exact dates vary by campus.
          </Text>

          <MiniTable
            columns={[
              { key: 'term', label: 'Term' },
              { key: 'course', label: 'Course' },
              { key: 'apply', label: 'Apply' },
              { key: 'pay', label: 'Pay' },
            ]}
            rows={[
              { term: 'Spring', course: 'Mar → May', apply: 'Late Jan → Feb', pay: 'Mid–late Feb' },
              { term: 'Summer', course: 'Jun → Aug', apply: 'Late Mar → Apr', pay: 'Mid–late May' },
              { term: 'Fall', course: 'Sep → Nov', apply: 'Late Jun → Jul', pay: 'Mid–late Aug' },
              { term: 'Winter', course: 'Dec → Feb', apply: 'Late Sep → Oct', pay: 'Late Nov' },
            ]}
          />

          <Text style={styles.note}>
            Tip: For D-4 visa, many schools require registering for 2+ consecutive terms.
          </Text>
        </View>

        {/* FEES (dark mini table) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💳 Fees (typical range)</Text>

          <MiniTable
            columns={[
              { key: 'item', label: 'Item' },
              { key: 'amount', label: 'KRW' },
              { key: 'notes', label: 'Notes' },
            ]}
            rows={[
              { item: 'Application fee', amount: '90,000 – 100,000', notes: 'One-time per application' },
              { item: 'Tuition (per term)', amount: '1.3M – 1.5M', notes: '10–12 weeks' },
              { item: 'Insurance', amount: '≈ 90,000', notes: '2–3 months (varies)' },
              { item: 'Books', amount: '≈ 50,000', notes: 'Per level (approx.)' },
            ]}
          />

          <Text style={styles.note}>
            Refund rules differ by school — check each policy before payment.
          </Text>
        </View>

        {/* CTA (same vibe as bachelors) */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Start Korean the right way</Text>
          <Text style={styles.ctaSubtitle}>
            Tell us your goals — we’ll recommend the best KLI schedule & campus.
          </Text>

          <View style={styles.ctaBtns}>
            <Pressable
              onPress={() => router.push('/programs?q=Korean%20Language')}
              style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Find KLI programs"
            >
              <Ionicons name="search-outline" size={16} color="#0b1120" />
              <Text style={styles.btnPrimaryText}>Find KLI programs</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/contact')}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Talk to an advisor"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>Talk to an advisor</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Questions? Email: <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===== Small UI bits ===== */
function Chip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#e5edff" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function MiniTable({ columns, rows }) {
  return (
    <View style={styles.tableWrap}>
      <View style={[styles.tableRow, styles.tableHead]}>
        {columns.map((c) => (
          <View key={c.key} style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.thText}>{c.label}</Text>
          </View>
        ))}
      </View>

      {rows.map((r, i) => (
        <View key={i} style={styles.tableRow}>
          {columns.map((c) => (
            <View key={c.key} style={[styles.cell, { flex: 1 }]}>
              <Text style={styles.tdText}>{r[c.key]}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/* ===== Styles (copied from bachelors vibe) ===== */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: '#020617',
  },

  heroCard: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.28,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 18 },
      },
      android: { elevation: 10 },
      default: {},
    }),
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  backText: { color: '#e5edff', fontSize: 13, fontWeight: '600' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f97316',
  },
  badgeText: { color: '#0b1120', fontSize: 13, fontWeight: '800' },

  heroTitle: { marginTop: 4, fontSize: 24, fontWeight: '800', color: '#e5edff' },
  heroSubtitle: { marginTop: 8, color: '#cbd5f5', fontSize: 14, lineHeight: 21 },

  chipsRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(30,64,175,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  chipText: { color: '#e5edff', fontWeight: '700', fontSize: 12 },

  sectionsWrap: { width: '100%', maxWidth: 900, marginTop: 18, gap: 12 },

  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#e5edff', marginBottom: 8 },
  paragraph: { color: '#cbd5f5', fontSize: 14, lineHeight: 22, marginBottom: 6 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  bulletText: { flex: 1, color: '#cbd5f5', fontSize: 14, lineHeight: 22 },

  /* mini table */
  tableWrap: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)',
    backgroundColor: 'rgba(15,23,42,0.35)',
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.16)' },
  tableHead: { backgroundColor: 'rgba(30,64,175,0.18)' },
  cell: { paddingVertical: 10, paddingHorizontal: 10 },
  thText: { color: '#e5edff', fontWeight: '900', fontSize: 12 },
  tdText: { color: '#cbd5f5', fontSize: 12, lineHeight: 18 },

  note: { marginTop: 8, color: 'rgba(203,213,245,0.85)', fontStyle: 'italic', lineHeight: 20 },

  /* CTA */
  ctaCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(2,6,23,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  ctaTitle: { color: '#e5edff', fontWeight: '900', fontSize: 16 },
  ctaSubtitle: { color: '#cbd5f5', marginTop: 6, lineHeight: 20 },
  ctaBtns: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },

  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  btnPrimary: { backgroundColor: '#f97316', borderColor: '#f97316' },
  btnPrimaryText: { color: '#0b1120', fontWeight: '900' },
  btnGhost: { backgroundColor: 'rgba(15,23,42,0.55)', borderColor: 'rgba(148,163,184,0.45)' },
  btnGhostText: { color: '#e5edff', fontWeight: '900' },

  footerNote: { marginTop: 2, color: 'rgba(203,213,245,0.85)', fontStyle: 'italic', lineHeight: 20 },
  link: { color: '#38bdf8', textDecorationLine: 'underline' },
});
