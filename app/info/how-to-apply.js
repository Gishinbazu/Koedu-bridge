// app/info/how-to-apply.js (replace your file)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer'; // optional but recommended for sticky navbar
import { useAppTheme } from '../../theme/AppTheme';

export default function HowToApplyPage() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.top }]}>
      <HeaderSpacer />

      {/* Hero */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={[s.heroIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name="document-text-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: theme.text }]}>How to Apply</Text>
          <Text style={[s.lead, { color: theme.subText }]}>
            KOEDU Bridge simplifies everything—from finding programs to tracking your results.
          </Text>
        </View>
      </View>

      {/* Numbered steps */}
      <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.blockTitle, { color: theme.text }]}>Application steps</Text>

        <Step
          theme={theme}
          n={1}
          title="Search & Select"
          body="Browse programs by university, level, or semester. Shortlist what fits you best."
          icon="search-outline"
        />

        <Step
          theme={theme}
          n={2}
          title="Prepare Documents"
          body="Collect transcripts, certificates, passport copy, and language scores."
          icon="folder-open-outline"
        />

        <Step
          theme={theme}
          n={3}
          title="Submit Online"
          body="Create an account, fill the form, upload files, and pay the fee (if required)."
          icon="cloud-upload-outline"
        />

        <Step
          theme={theme}
          n={4}
          title="Track Your Application"
          body="Log in anytime to view real-time status and updates."
          icon="trending-up-outline"
        />

        <Step
          theme={theme}
          n={5}
          title="Wait for Results"
          body="You’ll get an email and in-app notification when a decision is made."
          icon="mail-unread-outline"
        />
      </View>

      {/* Quick checklist */}
      <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.blockTitle, { color: theme.text }]}>Quick checklist</Text>
        <Check theme={theme} text="Valid passport (photo page)" />
        <Check theme={theme} text="Official transcripts & certificates" />
        <Check theme={theme} text="Language test (IELTS/TOEFL/Duolingo or TOPIK), if required" />
        <Check theme={theme} text="Recommendation letters (if the program asks)" />
        <Check theme={theme} text="Application fee ready (some programs waive it)" />
        <Text style={[s.note, { color: theme.subText }]}>
          ✅ Ensure files are clear and in the correct format to avoid delays.
        </Text>
      </View>

      {/* CTA */}
      <View style={[s.cta, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.ctaTitle, { color: theme.text }]}>Need help choosing?</Text>
        <Text style={[s.ctaSub, { color: theme.subText }]}>
          We’ll match your profile to programs and list required documents.
        </Text>
        <View style={s.ctaRow}>
          <Pressable
            onPress={() => router.push('/programs')}
            style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Browse programs"
          >
            <Ionicons name="school-outline" size={16} color={theme.brandText} />
            <Text style={[s.btnPrimaryText, { color: theme.brandText }]}>Browse programs</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/contact')}
            style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]}
            accessibilityRole="button"
            accessibilityLabel="Talk to an advisor"
          >
            <Ionicons name="chatbubbles-outline" size={16} color={theme.primary} />
            <Text style={[s.btnGhostText, { color: theme.primary }]}>Talk to an advisor</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* --------- Reusable bits --------- */
function Step({ theme, n, title, body, icon }) {
  return (
    <View style={s.stepRow}>
      <View style={[s.stepBadge, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
        <Text style={[s.stepBadgeText, { color: theme.primary }]}>{n}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={s.stepHeader}>
          <View style={[s.stepIconWrap, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
            <Ionicons name={icon} size={14} color={theme.primary} />
          </View>
          <Text style={[s.stepTitle, { color: theme.text }]}>{title}</Text>
        </View>
        <Text style={[s.body, { color: theme.text }]}>{body}</Text>
      </View>
    </View>
  );
}

function Check({ theme, text }) {
  return (
    <View style={s.checkRow}>
      <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
      <Text style={[s.body, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

/* --------- Styles --------- */
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

  // Block
  block: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  blockTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },

  // Steps
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  stepBadge: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  stepBadgeText: { fontWeight: '900' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stepIconWrap: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  stepTitle: { fontSize: 16, fontWeight: '900' },
  body: { lineHeight: 20 },

  // Checklist
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },

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
});
