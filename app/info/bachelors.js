// app/info/bachelors.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

const SECTIONS = [
  {
    title: "What is a Bachelor’s program?",
    body: [
      "A Bachelor’s program in Korea is usually 4 years (8 semesters) of full-time study.",
      "Most majors start in March (Spring semester). Some universities also offer a September (Fall) intake.",
    ],
  },
  {
    title: 'Popular fields for international students',
    bullets: [
      'Business Administration, International Trade, Marketing',
      'Computer Science, AI, Data Science, Software Engineering',
      'Korean Language & Culture, Education, Social Sciences',
      'Mechanical / Electrical / IT Engineering',
    ],
  },
  {
    title: 'Basic eligibility',
    bullets: [
      'Completion of high school (or equivalent) before the first semester in Korea',
      'Clean academic record (no expulsion or serious disciplinary issues)',
      'Minimum GPA requirements set by each university',
      'Language requirements: TOPIK or English score depending on the program',
    ],
  },
  {
    title: 'Language of instruction',
    body: [
      'Many Bachelor’s programs in Korea are taught in Korean.',
      'Some universities offer full-English tracks (especially in Business, IT, and Global Studies).',
    ],
  },
  {
    title: 'How KOEDU Bridge helps',
    bullets: [
      'We help you compare Bachelor’s majors and universities in Korea.',
      'We explain tuition, dormitory, and scholarship options in a clear way.',
      'We guide you step-by-step from application to arrival in Korea.',
    ],
  },
];

export default function BachelorsInfoScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: "Bachelor’s Programs" }} />

      {/* space under fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO */}
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
            <Text style={styles.badgeText}>Bachelor’s</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Bachelor’s Programs in Korea</Text>
        <Text style={styles.heroSubtitle}>
          Understand how 4-year university degrees work in Korea: structure, language, and what
          KOEDU Bridge can do for you.
        </Text>

        {/* quick highlights */}
        <View style={styles.chipsRow}>
          <Chip icon="time-outline" label="4 years (8 semesters)" />
          <Chip icon="calendar-outline" label="Main intake: March" />
          <Chip icon="document-text-outline" label="Docs + visa guidance" />
        </View>
      </View>

      {/* SECTIONS */}
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

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to choose a Bachelor’s program?</Text>
          <Text style={styles.ctaSubtitle}>
            Tell us your target major and intake — we’ll recommend universities and build your
            timeline.
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
              onPress={() => router.push('/contact')}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Contact us"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>Contact us</Text>
            </Pressable>
          </View>
        </View>

        {/* footer note */}
        <Text style={styles.footerNote}>
          Need help quickly? Email: <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
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
  backText: {
    color: '#e5edff',
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f97316',
  },
  badgeText: {
    color: '#0b1120',
    fontSize: 13,
    fontWeight: '800',
  },

  heroTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    color: '#e5edff',
  },
  heroSubtitle: {
    marginTop: 8,
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 21,
  },

  chipsRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipText: {
    color: '#e5edff',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionsWrap: {
    width: '100%',
    maxWidth: 900,
    marginTop: 18,
    gap: 12,
  },

  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e5edff',
    marginBottom: 8,
  },
  paragraph: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 22,
  },

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
  btnPrimary: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  btnPrimaryText: { color: '#0b1120', fontWeight: '900' },

  btnGhost: {
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderColor: 'rgba(148,163,184,0.45)',
  },
  btnGhostText: { color: '#e5edff', fontWeight: '900' },

  footerNote: {
    marginTop: 2,
    color: 'rgba(203,213,245,0.85)',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  link: { color: '#38bdf8', textDecorationLine: 'underline' },
});
