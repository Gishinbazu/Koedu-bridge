// app/programs/entry-requirements.js
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
import HeaderSpacer from '../../components/HeaderSpacer';
import { useAppTheme } from '../../theme/AppTheme';

export default function EntryRequirementsPage() {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.top }]}>
      <HeaderSpacer />

      {/* Hero */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={[s.heroIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name="ribbon-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: theme.text }]}>Entry Requirements</Text>
          <Text style={[s.lead, { color: theme.subText }]}>
            What you need for a competitive application to Korean universities.
          </Text>
        </View>
      </View>

      {/* Quick tags */}
      <View style={s.tagsRow}>
        {['Academic', 'Language', 'Documents', 'Deadlines'].map((t) => (
          <View key={t} style={[s.tag, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
            <Text style={[s.tagText, { color: theme.chipText }]}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Academics */}
      <Block theme={theme} icon="school-outline" title="Academic background">
        <Text style={[s.body, { color: theme.text }]}>
          Most programs require a completed prior degree at the same or preceding level:
        </Text>

        <Table
          theme={theme}
          columns={[{ key: 'level', label: 'Program' }, { key: 'req', label: 'Minimum background' }]}
          rows={[
            { level: 'Bachelor', req: 'High school diploma or equivalent' },
            { level: 'Master', req: "Bachelor’s degree (relevant field preferred)" },
            { level: 'PhD', req: "Master’s degree (research experience is a plus)" },
          ]}
        />

        <Bullet theme={theme} text="Competitive GPAs strengthen your chances; some majors set higher cutoffs." />
        <Bullet theme={theme} text="Prerequisite courses or portfolios may be required for specific fields." />
      </Block>

      {/* Language */}
      <Block theme={theme} icon="language-outline" title="Language proficiency">
        <Text style={[s.body, { color: theme.text }]}>
          Requirements vary by university and major. Typical thresholds:
        </Text>

        <Table
          theme={theme}
          columns={[{ key: 'track', label: 'Track' }, { key: 'scores', label: 'Typical minimums' }]}
          rows={[
            { track: 'English-medium', scores: 'TOEFL iBT 71–80 · IELTS 5.5–6.0 · Duolingo 95–105' },
            { track: 'Korean-medium', scores: 'TOPIK II (Level 3–4) — higher for demanding majors' },
          ]}
        />

        <Bullet theme={theme} text="Some schools waive English tests if prior studies were fully in English (MOI letter needed)." />
        <Bullet theme={theme} text="Language centers (KLI) can help you reach the target before matriculation." />
      </Block>

      {/* Documents */}
      <Block theme={theme} icon="documents-outline" title="Required documents">
        <Check theme={theme} text="Passport bio page" />
        <Check theme={theme} text="Official transcripts + graduation certificate" />
        <Check theme={theme} text="Language test report (IELTS/TOEFL/Duolingo or TOPIK), if required" />
        <Check theme={theme} text="Recommendation letters (if the program asks)" />
        <Check theme={theme} text="Statement of Purpose / Research plan (for Master’s/PhD)" />
        <Text style={[s.note, { color: theme.subText }]}>
          Tip: Scan clearly as PDF and keep filenames tidy. Missing/unclear docs cause delays.
        </Text>
      </Block>

      {/* Deadlines */}
      <Block theme={theme} icon="calendar-outline" title="Intakes & deadlines">
        <Text style={[s.body, { color: theme.text }]}>
          Most universities have two main intakes:
        </Text>
        <Table
          theme={theme}
          columns={[{ key: 'intake', label: 'Intake' }, { key: 'window', label: 'Typical application window' }]}
          rows={[
            { intake: 'Spring (Mar)', window: 'Oct – Dec (previous year)' },
            { intake: 'Fall (Sep)', window: 'Apr – Jun' },
          ]}
        />
        <Bullet theme={theme} text="Exact dates differ—check each program’s page." />
      </Block>

      {/* CTA */}
      <View style={[s.cta, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <Text style={[s.ctaTitle, { color: theme.text }]}>Ready to check your fit?</Text>
        <Text style={[s.ctaSub, { color: theme.subText }]}>
          We’ll estimate your eligibility and list missing items.
        </Text>
        <View style={s.ctaRow}>
          <Pressable
            onPress={() => router.push('/programs')}
            style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
          >
            <Ionicons name="search-outline" size={16} color={theme.brandText} />
            <Text style={[s.btnPrimaryText, { color: theme.brandText }]}>Browse programs</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/info/language-requirements')}
            style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]}
          >
            <Ionicons name="chatbubbles-outline" size={16} color={theme.primary} />
            <Text style={[s.btnGhostText, { color: theme.primary }]}>Check language requirements</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- Reusable bits ---------- */
function Block({ theme, icon, title, children }) {
  return (
    <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
      <View style={s.blockHeader}>
        <View style={[s.blockIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
          <Ionicons name={icon} size={16} color={theme.primary} />
        </View>
        <Text style={[s.blockTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Bullet({ theme, text }) {
  return (
    <View style={s.bulletRow}>
      <Text style={[s.bullet, { color: theme.primary }]}>•</Text>
      <Text style={s.body}>{text}</Text>
    </View>
  );
}

function Check({ theme, text }) {
  return (
    <View style={s.checkRow}>
      <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
      <Text style={s.body}>{text}</Text>
    </View>
  );
}

function Table({ theme, columns, rows }) {
  return (
    <View style={[s.table, { borderColor: theme.stroke }]}>
      <View style={[s.tr, s.trHead, { backgroundColor: theme.mid, borderColor: theme.stroke }]}>
        {columns.map((c) => (
          <View key={c.key} style={[s.td, { flex: 1, borderColor: theme.stroke }]}>
            <Text style={[s.thText, { color: theme.text }]}>{c.label}</Text>
          </View>
        ))}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={[s.tr, { borderColor: theme.stroke }]}>
          {columns.map((c) => (
            <View key={c.key} style={[s.td, { flex: 1, borderColor: theme.stroke }]}>
              <Text style={[s.tdText, { color: theme.text }]}>{r[c.key]}</Text>
            </View>
          ))}
        </View>
      ))}
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

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  tagText: { fontWeight: '800', fontSize: 12 },

  // Blocks
  block: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  blockHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  blockIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  blockTitle: { fontSize: 18, fontWeight: '900' },

  // Copy
  body: { lineHeight: 20 },

  // Table
  table: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1 },
  trHead: {},
  td: { paddingVertical: 10, paddingHorizontal: 12, borderRightWidth: Platform.OS === 'web' ? 1 : 0 },
  thText: { fontWeight: '800' },
  tdText: {},

  // Bullets & checks
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  bullet: { fontWeight: '900', marginTop: 1 },
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
