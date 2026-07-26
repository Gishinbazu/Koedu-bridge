// app/unqualified.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer'; // ✅ import
import { useAppTheme } from '../../theme/AppTheme';

export default function UnqualifiedPage() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.top }]}>
      <HeaderSpacer /> {/* ✅ keeps content clear of sticky navbar */}

      {/* Hero */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={[s.heroIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name="alert-circle-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: theme.text }]}>Not quite eligible yet?</Text>
          <Text style={[s.lead, { color: theme.subText }]}>
            No stress—many successful students started right here. Let’s build a quick plan to get you qualified.
          </Text>
        </View>
      </View>

      {/* Action cards */}
      <View style={s.grid}>
        <Card theme={theme} icon="language-outline" title="Boost your language">
          Most programs ask for English (TOEFL / IELTS / Duolingo) or Korean (TOPIK). A short, targeted prep can move you up a band fast.
          <Tag theme={theme}>IELTS 5.5–6.0</Tag>
          <Tag theme={theme}>TOEFL iBT 71–80</Tag>
          <Tag theme={theme}>TOPIK II 3–4</Tag>
        </Card>

        <Card theme={theme} icon="school-outline" title="Bridge your academics">
          If GPA or prerequisites are the blocker, consider short bridge courses, extra credits, or foundation terms before applying.
        </Card>

        <Card theme={theme} icon="documents-outline" title="Complete documents">
          Prepare transcripts, recommendation letters, and proof of language. Missing docs are the #1 reason for delays.
        </Card>

        <Card theme={theme} icon="calendar-outline" title="Shift to next intake">
          Use the time to strengthen your profile and submit for the upcoming semester with better odds.
        </Card>
      </View>

      {/* Guided steps */}
      <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.blockTitle, { color: theme.text }]}>Your 4-week rescue plan</Text>
        <Step theme={theme} n={1} text="Take a free level check (English or Korean) to get a precise target." />
        <Step theme={theme} n={2} text="Enroll in a focused prep track (2–4 weeks) aligned to that target." />
        <Step theme={theme} n={3} text="Gather documents (transcripts, letters, MOI) and set test date." />
        <Step theme={theme} n={4} text="Retake the test, then apply to short-listed programs." />
      </View>

      {/* CTA */}
      <View style={[s.cta, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.ctaTitle, { color: theme.text }]}>Ready to get a plan?</Text>
        <Text style={[s.ctaSub, { color: theme.subText }]}>We’ll estimate timeline, costs, and the exact score you need.</Text>
        <View style={s.ctaRow}>
          <Pressable
            onPress={() => router.push('/contact')}
            style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Talk to an advisor"
          >
            <Ionicons name="sparkles-outline" size={16} color={theme.brandText} />
            <Text style={[s.btnPrimaryText, { color: theme.brandText }]}>Talk to an advisor</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/programs')}
            style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]}
            accessibilityRole="button"
            accessibilityLabel="Browse programs"
          >
            <Ionicons name="search-outline" size={16} color={theme.primary} />
            <Text style={[s.btnGhostText, { color: theme.primary }]}>Browse programs</Text>
          </Pressable>
        </View>
        <Text style={[s.note, { color: theme.subText }]}>
          🌱 Many admitted students began below the requirement—consistent prep wins.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------- Building blocks ---------- */
function Card({ theme, icon, title, children }) {
  return (
    <View style={[s.card, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
      <View style={s.cardHeader}>
        <View style={[s.cardIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name={icon} size={16} color={theme.primary} />
        </View>
        <Text style={[s.cardTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Text style={[s.cardBody, { color: theme.text }]}>{children}</Text>
    </View>
  );
}

function Tag({ theme, children }) {
  return (
    <View style={[s.tag, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
      <Text style={[s.tagText, { color: theme.chipText }]}>{children}</Text>
    </View>
  );
}

function Step({ theme, n, text }) {
  return (
    <View style={s.stepRow}>
      <View style={[s.stepBadge, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
        <Text style={[s.stepBadgeText, { color: theme.primary }]}>{n}</Text>
      </View>
      <Text style={[s.stepText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },

  // Hero
  hero: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  heroIcon: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '900' },
  lead: { marginTop: 4, lineHeight: 20, fontSize: 14, fontWeight: '600' },

  // Grid cards
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flexBasis: '48%',
    maxWidth: '48%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    ...Platform.select({
      default: { flexBasis: '100%', maxWidth: '100%' }, // mobile single column
      web: { }, // web uses values above
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitle: { fontWeight: '900', fontSize: 16 },
  cardBody: { lineHeight: 20, marginTop: 2 },

  tag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tagText: { fontWeight: '800', fontSize: 12 },

  // Steps block
  block: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  blockTitle: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  stepBadgeText: { fontWeight: '900' },
  stepText: { flex: 1, lineHeight: 20 },

  // CTA
  cta: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  ctaTitle: { fontSize: 18, fontWeight: '900' },
  ctaSub: { marginTop: 2 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  btn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrimaryText: { fontWeight: '900' },
  btnGhost: { backgroundColor: 'transparent' },
  btnGhostText: { fontWeight: '900' },

  note: { marginTop: 10, fontStyle: 'italic', fontSize: 13 },
});
