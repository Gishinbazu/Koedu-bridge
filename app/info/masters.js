// app/info/masters.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer';

export default function MastersInfo() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: "Master’s in Korea" }} />

      {/* space under fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO (Bachelor style) */}
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
            <Ionicons name="school-outline" size={16} color="#0b1120" />
            <Text style={styles.badgeText}>Master’s</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Apply to a Master’s in Korea</Text>
        <Text style={styles.heroSubtitle}>
          A clear step-by-step roadmap: requirements, documents, timeline, visa, and KOEDU Bridge
          support.
        </Text>

        <View style={styles.chipsRow}>
          <Chip icon="document-text-outline" label="Docs checklist" />
          <Chip icon="calendar-outline" label="Intakes planning" />
          <Chip icon="globe-outline" label="Visa + arrival" />
        </View>
      </View>

      {/* CONTENT (Bachelor style cards) */}
      <View style={styles.sectionsWrap}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>
            KOEDU Bridge guides you from program selection to arrival. Below is a concise roadmap
            for international students applying to Master’s programs in South Korea.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1) Understand the requirements</Text>
          <Bullet text="Bachelor’s degree completed (or last semester in progress)." />
          <Bullet text="Typical GPA threshold: 2.5–3.0/4.0 (varies by university/major)." />
          <Bullet text="Language: English test (TOEFL/IELTS/Duolingo) or TOPIK for Korean-medium." />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2) Choose your program</Text>
          <Bullet text="Browse verified programs on KOEDU Bridge by field, intake, and language." />
          <Bullet text="Compare requirements, tuition ranges, scholarship policies, and location." />
          <Bullet text="Shortlist favorites and discuss options with an advisor." />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3) Prepare the documents</Text>
          <Bullet text="Passport copy" />
          <Bullet text="Academic transcripts & degree certificate" />
          <Bullet text="Study plan / Statement of purpose" />
          <Bullet text="2× recommendation letters" />
          <Bullet text="Language score (if required) & proof of finances" />
          <Text style={styles.note}>
            Official translations, apostille, or notarization may be required depending on country.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4) Submit online</Text>
          <Bullet text="Create your KOEDU account and complete the application form." />
          <Bullet text="Upload documents and pay any university application fee (if applicable)." />
          <Bullet text="Track status in real time: comments, extra requests, interview scheduling." />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5) Wait for results</Text>
          <Bullet text="Typical review time: ~4–6 weeks (can vary by department/intake)." />
          <Bullet text="Some majors may require an interview or portfolio review." />
          <Bullet text="You’ll be notified in the platform as soon as results are released." />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6) Visa & arrival</Text>
          <Bullet text="Receive admission letter and prepare D-2 visa submission." />
          <Bullet text="Book dorm/studio, insurance, and arrival support (SIM, transport, bank)." />
          <Bullet text="Post-arrival: ARC (Alien Registration Card), student card, orientation." />
        </View>

        {/* CTA (Bachelor style) */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to start?</Text>
          <Text style={styles.ctaSubtitle}>
            Find a program or talk to an advisor for a tailored plan.
          </Text>

          <View style={styles.ctaBtns}>
            <Pressable
              onPress={() => router.push('/programs')}
              style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Find a program"
            >
              <Ionicons name="search-outline" size={16} color="#0b1120" />
              <Text style={styles.btnPrimaryText}>Find a program</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/info/faq')}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="FAQ"
            >
              <Ionicons name="help-circle-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>FAQ</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/info/contact')}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Contact us"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>Contact us</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Need help? Email us: <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===== small UI bits ===== */
function Chip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#e5edff" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function Bullet({ text }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

/* ===== Styles (Bachelor vibe) ===== */
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

  note: { marginTop: 8, color: 'rgba(203,213,245,0.85)', fontStyle: 'italic', lineHeight: 20 },

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

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: '#f97316', borderColor: '#f97316' },
  btnPrimaryText: { color: '#0b1120', fontWeight: '900' },

  btnGhost: { backgroundColor: 'rgba(15,23,42,0.55)', borderColor: 'rgba(148,163,184,0.45)' },
  btnGhostText: { color: '#e5edff', fontWeight: '900' },

  footerNote: {
    marginTop: 2,
    color: 'rgba(203,213,245,0.85)',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  link: { color: '#38bdf8', textDecorationLine: 'underline' },
});
