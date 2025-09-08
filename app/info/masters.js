// app/info/masters.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MastersInfo() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: "Master's in Korea" }} />

      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={18} color="#0b3b79" />
          <Text style={s.backText}>Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={s.h1}>📘 Apply to a Master’s in Korea</Text>
          <Text style={s.sub}>A clean step-by-step overview with documents, timelines, and tips.</Text>
        </View>
      </View>

      {/* Lead card */}
      <Card>
        <Text style={s.lead}>
          KOEDU Bridge guides you from program selection to arrival. Below is a concise roadmap for
          international students applying to Master’s programs in South Korea.
        </Text>
      </Card>

      {/* Steps */}
      <Card>
        <Section title="1) Understand the requirements">
          <Bullet text="Bachelor’s degree completed (or last semester in progress)." />
          <Bullet text="Typical GPA threshold: 2.5–3.0/4.0 (varies by university/major)." />
          <Bullet text="Language: English test (TOEFL/IELTS/Duolingo) or TOPIK for Korean-medium." />
        </Section>
      </Card>

      <Card>
        <Section title="2) Choose your program">
          <Bullet text="Browse verified programs on KOEDU Bridge by field, intake, and language." />
          <Bullet text="Compare requirements, tuition ranges, scholarship policies, and location." />
          <Bullet text="Shortlist favorites and discuss options with an advisor." />
        </Section>
      </Card>

      <Card>
        <Section title="3) Prepare the documents">
          <Bullet text="Passport copy" />
          <Bullet text="Academic transcripts & degree certificate" />
          <Bullet text="Study plan / Statement of purpose" />
          <Bullet text="2× recommendation letters" />
          <Bullet text="Language score (if required) & proof of finances" />
          <Text style={s.note}>
            *Official translations, apostille, or notarization may be required depending on country.
          </Text>
        </Section>
      </Card>

      <Card>
        <Section title="4) Submit online">
          <Bullet text="Create your KOEDU account and complete the application form." />
          <Bullet text="Upload documents and pay any university application fee (if applicable)." />
          <Bullet text="Track status in real time: comments, extra requests, interview scheduling." />
        </Section>
      </Card>

      <Card>
        <Section title="5) Wait for results">
          <Bullet text="Typical review time: ~4–6 weeks (can vary by department/intake)." />
          <Bullet text="Some majors may require an interview or portfolio review." />
          <Bullet text="You’ll be notified in the platform as soon as results are released." />
        </Section>
      </Card>

      <Card>
        <Section title="6) Visa & arrival">
          <Bullet text="Receive admission letter and prepare D-2 visa submission." />
          <Bullet text="Book dorm/studio, insurance, and arrival support (SIM, transport, bank)." />
          <Bullet text="Post-arrival: ARC (Alien Registration Card), student card, orientation." />
        </Section>
      </Card>

      {/* CTA */}
      <View style={s.cta}>
        <Text style={s.h2}>Ready to start?</Text>
        <Text style={s.sub}>Find a program or talk to an advisor for a tailored plan.</Text>
        <View style={s.ctaRow}>
          <Pressable
            onPress={() => router.push('/programs')}
            style={[s.btn, s.btnPrimary]}
            accessibilityRole="button"
          >
            <Ionicons name="search" size={16} color="#fff" />
            <Text style={s.btnPrimaryText}>Find a program</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/info/faq')}
            style={[s.btn, s.btnGhost]}
            accessibilityRole="button"
          >
            <Ionicons name="help-circle" size={16} color="#0b3b79" />
            <Text style={s.btnGhostText}>FAQ</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/contact')}
            style={[s.btn, s.btnGhost]}
            accessibilityRole="button"
          >
            <Ionicons name="call" size={16} color="#0b3b79" />
            <Text style={s.btnGhostText}>Contact us</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer note */}
      <Text style={s.footer}>
        Need help? Email us: koedu.bridge.help@gmail.com
      </Text>
    </ScrollView>
  );
}

/* ---------- UI bits ---------- */
function Card({ children }) {
  return <View style={s.card}>{children}</View>;
}
function Section({ title, children }) {
  return (
    <View>
      <Text style={s.h3}>{title}</Text>
      <View style={{ marginTop: 6 }}>{children}</View>
    </View>
  );
}
function Bullet({ text }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bullet}>•</Text>
      <Text style={s.body}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  backText: { color: '#0b3b79', fontWeight: '700' },

  h1: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  h2: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  h3: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sub: { color: '#64748b', marginTop: 2 },

  lead: { color: '#334155', lineHeight: 22 },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },

  body: { color: '#334155', lineHeight: 20, flexShrink: 1 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' },
  bullet: { color: '#0b3b79', fontWeight: '800', marginTop: 1 },

  note: { color: '#64748b', marginTop: 4, fontSize: 12 },

  cta: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#ffffff', marginTop: 4 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: '#0b3b79', borderColor: '#0b3b79' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: '#cbd5e1' },
  btnGhostText: { color: '#0b3b79', fontWeight: '800' },

  footer: { marginTop: 16, fontStyle: 'italic', fontSize: 12, color: '#667085', textAlign: 'center' },
});
