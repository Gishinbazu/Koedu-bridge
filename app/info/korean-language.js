// app/info/korean-language.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function KoreanLanguageScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Korean Language (KLI)' }} />

      <Header
        title="Korean Language (KLI)"
        subtitle="Intensive language programs that run every 10–12 weeks"
        onBack={() => router.back()}
      />

      <Card>
        <Text style={s.lead}>
          KLI programs are intensive Korean classes offered by many universities. They’re a great
          path if you want to reach TOPIK 3–4 for undergraduate/graduate admission—or simply
          prepare for life and work in Korea.
        </Text>
      </Card>

      <Card>
        <Text style={s.h3}>Who is it for?</Text>
        <Bullet text="Beginners through advanced learners (classes are level-placed)." />
        <Bullet text="Students preparing for TOPIK 3–6 to enter degree programs." />
        <Bullet text="Gap-year learners or professionals improving language skills." />
      </Card>

      <Card>
        <Text style={s.h3}>Academic format</Text>
        <Bullet text="Duration: ~10–12 weeks per session (4 hours/day, Mon–Fri)." />
        <Bullet text="Electives & cultural classes (varies by university)." />
        <Bullet text="Class times often split (e.g., 09:10–13:00 or 13:30–17:20)." />
      </Card>

      <Card>
        <Text style={s.h3}>Typical yearly sessions</Text>
        <Table
          columns={[
            { key: 'term', label: 'Term' },
            { key: 'course', label: 'Course period' },
            { key: 'apply', label: 'Application window' },
            { key: 'tuition', label: 'Tuition deadline' },
          ]}
          rows={[
            { term: 'Spring',  course: 'Mar → May',  apply: 'Late Jan → Late Feb',  tuition: 'Mid–late Feb' },
            { term: 'Summer',  course: 'Jun → Aug',  apply: 'Late Mar → Late Apr',  tuition: 'Mid–late May' },
            { term: 'Fall',    course: 'Sep → Nov',  apply: 'Late Jun → Late Jul',  tuition: 'Mid–late Aug' },
            { term: 'Winter',  course: 'Dec → Feb',  apply: 'Late Sep → Late Oct',  tuition: 'Late Nov' },
          ]}
        />
        <Text style={s.note}>
          Exact dates vary by university (many run 2–3 application rounds per term).
        </Text>
      </Card>

      <Card>
        <Text style={s.h3}>Fees (typical range)</Text>
        <Table
          columns={[
            { key: 'item', label: 'Item' },
            { key: 'amount', label: 'Amount (KRW)' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={[
            { item: 'Application fee', amount: '90,000 – 100,000', notes: 'One-time per application' },
            { item: 'Tuition (per term)', amount: '1,300,000 – 1,500,000', notes: '~10–12 weeks' },
            { item: 'Insurance', amount: '90,000 / 2–3 months', notes: 'If not already insured' },
            { item: 'Books', amount: '≈ 50,000', notes: 'Per level (approx.)' },
          ]}
        />
        <Text style={s.note}>Refund rules differ by school; check each policy before payment.</Text>
      </Card>

      <Card>
        <Text style={s.h3}>Visa, housing, and arrival</Text>
        <Bullet text="Visa: most KLI students use the D-4 (general trainee) visa." />
        <Bullet text="Housing: on-campus dorms or nearby studios (gosiwon/officetel)." />
        <Bullet text="Arrival: airport pickup, SIM, bank account, ARC registration support." />
      </Card>

      <Card>
        <Text style={s.h3}>How KOEDU Bridge helps</Text>
        <Bullet text="We match you with suitable KLI centers and schedules." />
        <Bullet text="We assemble your document pack and track your application." />
        <Bullet text="We guide visa, housing, insurance, and orientation." />
      </Card>

      <CTA
        title="Start Korean the right way"
        subtitle="Tell us your goals; we’ll recommend the best KLI schedule & campus."
        primary={{ label: 'Find KLI programs', href: '/programs?q=Korean%20Language' }}
        secondary={{ label: 'Talk to an advisor', href: '/contact' }}
      />
    </ScrollView>
  );
}

/* ==== UI bits (match your other info screens) ==== */
function Header({ title, subtitle, onBack }) {
  return (
    <View style={s.header}>
      <Pressable onPress={onBack} style={s.backBtn} accessibilityRole="button" accessibilityLabel="Back">
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
function Card({ children }) { return <View style={s.card}>{children}</View>; }
function Bullet({ text }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bullet}>•</Text>
      <Text style={s.body}>{text}</Text>
    </View>
  );
}
function CTA({ title, subtitle, primary, secondary }) {
  const router = useRouter();
  const go = (href) => href?.startsWith('/') && router.push(href);
  return (
    <View style={s.cta}>
      <Text style={s.h2}>{title}</Text>
      {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {!!primary && (
          <Pressable onPress={() => go(primary.href)} style={[s.btn, s.btnPrimary]} accessibilityRole="button">
            <Text style={s.btnPrimaryText}>{primary.label}</Text>
          </Pressable>
        )}
        {!!secondary && (
          <Pressable onPress={() => go(secondary.href)} style={[s.btn, s.btnGhost]} accessibilityRole="button">
            <Text style={s.btnGhostText}>{secondary.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
function Table({ columns, rows }) {
  return (
    <View style={s.table}>
      <View style={[s.tr, s.trHead]}>
        {columns.map((c) => (
          <View key={c.key} style={[s.td, { flex: 1 }]}><Text style={s.thText}>{c.label}</Text></View>
        ))}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={s.tr}>
          {columns.map((c) => (
            <View key={c.key} style={[s.td, { flex: 1 }]}><Text style={s.tdText}>{r[c.key]}</Text></View>
          ))}
        </View>
      ))}
    </View>
  );
}

const C = { border: '#e5e7eb', bgCard: '#ffffff', ink: '#0f172a', body: '#334155', brand: '#0b3b79', ghostBorder: '#cbd5e1' };
const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  backText: { color: C.brand, fontWeight: '700' },
  h1: { fontSize: 26, fontWeight: '800', color: C.ink },
  h2: { fontSize: 20, fontWeight: '800', color: C.ink },
  h3: { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 6 },
  sub: { color: '#64748b', marginTop: 2 },
  lead: { color: C.body, lineHeight: 22 },
  card: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, backgroundColor: C.bgCard, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { color: C.brand, fontWeight: '800' },
  body: { color: C.body, lineHeight: 20 },
  cta: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16, backgroundColor: C.bgCard, marginTop: 4 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: C.brand, borderColor: C.brand },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: C.ghostBorder },
  btnGhostText: { color: C.brand, fontWeight: '800' },
  table: { borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  trHead: { backgroundColor: '#f8fafc' },
  td: { paddingVertical: 10, paddingHorizontal: 12 },
  thText: { fontWeight: '800', color: C.ink },
  tdText: { color: C.body },
  note: { color: '#64748b', marginTop: 6, fontStyle: 'italic' },
});
