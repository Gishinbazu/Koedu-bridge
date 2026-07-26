// app/info/after-apply.js
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
import HeaderSpacer from '../../components/HeaderSpacer'; // if your navbar is fixed
import { useAppTheme } from '../../theme/AppTheme';

export default function AfterApplyPage() {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.top }]}>
      <HeaderSpacer />

      {/* Hero */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={[s.heroIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name="paper-plane-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: theme.text }]}>After You Apply</Text>
          <Text style={[s.lead, { color: theme.subText }]}>
            What happens next—review, results, offer, visa, and arrival. Stay on top of your
            timeline with KOEDU Bridge.
          </Text>
        </View>
      </View>

      {/* Timeline (progress overview) */}
      <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.blockTitle, { color: theme.text }]}>Your post-submission timeline</Text>
        <TimelineItem
          theme={theme}
          step="1"
          title="Application Review"
          subtitle="University evaluates your file (can take a few weeks)."
          icon="time-outline"
        />
        <TimelineItem
          theme={theme}
          step="2"
          title="Admission Results"
          subtitle="You’ll see Accepted / Rejected / Waiting List in your account."
          icon="ribbon-outline"
        />
        <TimelineItem
          theme={theme}
          step="3"
          title="Accepting Your Offer"
          subtitle="Confirm before the deadline—may include a tuition deposit."
          icon="thumbs-up-outline"
        />
        <TimelineItem
          theme={theme}
          step="4"
          title="Visa & Documents"
          subtitle="University issues docs for your D-2 student visa application."
          icon="document-text-outline"
        />
        <TimelineItem
          theme={theme}
          step="5"
          title="Prepare for Arrival"
          subtitle="Housing, flight, pre-departure briefings—get set for Day 1."
          icon="airplane-outline"
          isLast
        />
      </View>

      {/* Detailed sections */}
      <View style={s.grid}>
        <StepCard
          theme={theme}
          icon="time-outline"
          title="Application Review"
          body="Your application is sent to the university for evaluation. This may take several weeks depending on the program and faculty."
          tip="Upload clear scans and correct formats to avoid back-and-forth."
        />
        <StepCard
          theme={theme}
          icon="ribbon-outline"
          title="Admission Results"
          body={`We’ll notify you by email and in your KOEDU Bridge account when a decision is made:\n• Accepted\n• Rejected\n• Waiting list`}
          tip="If you’re waitlisted, we’ll suggest backup options and timelines."
        />
        <StepCard
          theme={theme}
          icon="thumbs-up-outline"
          title="Accepting Your Offer"
          body="If accepted, you must confirm your seat before the deadline—some programs request an enrollment deposit."
          tip="Mark the deadline; late confirmations can void the offer."
        />
        <StepCard
          theme={theme}
          icon="document-text-outline"
          title="Visa & Documents"
          body="After acceptance, the university issues official documents required for your D-2 student visa application."
          tip="Double-check passport validity (often 6+ months from entry)."
        />
        <StepCard
          theme={theme}
          icon="airplane-outline"
          title="Prepare for Arrival"
          body="Book flights, sort housing, and join pre-departure sessions hosted by the university or KOEDU Bridge."
          tip="Consider dorm vs. studio; check move-in dates and bedding policies."
        />
      </View>

      {/* Tip box */}
      <View style={[s.tipBox, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
        <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
        <Text style={[s.tipText, { color: theme.text }]}>
          Keep an eye on your KOEDU Bridge account—status changes and action items appear there.
        </Text>
      </View>

      {/* CTA — redirected to Sign Up / Login */}
      <View style={[s.cta, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.ctaTitle, { color: theme.text }]}>Need help with the next step?</Text>
        <Text style={[s.ctaSub, { color: theme.subText }]}>
          Create your KOEDU Bridge account to track status and receive a personalized checklist.
        </Text>
        <View style={s.ctaRow}>
          <Pressable
            onPress={() => router.push('/auth/signup')}
            style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <Ionicons name="person-add-outline" size={16} color={theme.brandText} />
            <Text style={[s.btnPrimaryText, { color: theme.brandText }]}>Create an account</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/auth/login')}
            style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]}
            accessibilityRole="button"
            accessibilityLabel="I already have an account"
          >
            <Ionicons name="log-in-outline" size={16} color={theme.primary} />
            <Text style={[s.btnGhostText, { color: theme.primary }]}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* --------- Reusable bits --------- */
function TimelineItem({ theme, step, title, subtitle, icon, isLast }) {
  return (
    <View style={s.timelineRow}>
      <View style={s.timelineColLeft}>
        <View style={[s.timelineBadge, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
          <Text style={[s.timelineBadgeText, { color: theme.primary }]}>{step}</Text>
        </View>
        {!isLast && <View style={[s.timelineLine, { backgroundColor: theme.stroke }]} />}
      </View>
      <View style={s.timelineColRight}>
        <View style={s.timelineHeader}>
          <View style={[s.stepIconWrap, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
            <Ionicons name={icon} size={14} color={theme.primary} />
          </View>
          <Text style={[s.timelineTitle, { color: theme.text }]}>{title}</Text>
        </View>
        <Text style={[s.body, { color: theme.text }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

function StepCard({ theme, icon, title, body, tip }) {
  return (
    <View style={[s.card, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
      <View style={s.cardHeader}>
        <View style={[s.cardIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name={icon} size={16} color={theme.primary} />
        </View>
        <Text style={[s.cardTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Text style={[s.cardBody, { color: theme.text }]}>{body}</Text>
      {!!tip && (
        <View style={[s.cardTip, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name="bulb-outline" size={14} color={theme.primary} />
          <Text style={[s.cardTipText, { color: theme.text }]}> {tip}</Text>
        </View>
      )}
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

  // Block (timeline wrapper)
  block: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  blockTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },

  // Timeline
  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  timelineColLeft: { alignItems: 'center' },
  timelineBadge: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  timelineBadgeText: { fontWeight: '900' },
  timelineLine: { width: 2, flex: 1, marginTop: 4, borderRadius: 1 },
  timelineColRight: { flex: 1 },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stepIconWrap: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  timelineTitle: { fontSize: 16, fontWeight: '900' },
  body: { lineHeight: 20 },

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
      default: { flexBasis: '100%', maxWidth: '100%' }, // mobile 1-col
      web: {}, // keep 2-col on wide web
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
  cardTip: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTipText: { fontSize: 13 },

  // Tip box
  tipBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tipText: { flex: 1, lineHeight: 20 },

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
