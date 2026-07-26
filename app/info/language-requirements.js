// app/info/language-requirements.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer'; // optional spacer under global navbar
import { useAppTheme } from '../../theme/AppTheme';

export default function LanguageRequirementsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);
  const { theme } = useAppTheme();

  const sections = useMemo(
    () => [
      { key: 'overview', title: 'Overview', icon: 'information-circle-outline' },
      { key: 'english', title: 'English-medium', icon: 'language-outline' },
      { key: 'korean', title: 'Korean-medium', icon: 'school-outline' },
      { key: 'proof', title: 'Proof & waivers', icon: 'document-text-outline' },
      { key: 'cta', title: 'Check my eligibility', icon: 'checkmark-done-circle-outline' },
    ],
    []
  );

  const [offsets, setOffsets] = useState(Object.fromEntries(sections.map(s => [s.key, 0])));
  const onLayoutSection = (key, y) => setOffsets(prev => ({ ...prev, [key]: y }));

  const scrollToKey = useCallback((key) => {
    const y = offsets[key] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#section-${key}`);
    }
  }, [offsets]);

  useEffect(() => {
    let initialKey = null;
    if (params?.section && sections.some(s => s.key === params.section)) initialKey = params.section;
    if (!initialKey && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/section-([a-z0-9-]+)/i);
      const hk = m?.[1];
      if (hk && sections.some(s => s.key === hk)) initialKey = hk;
    }
    if (initialKey) {
      const t = setTimeout(() => scrollToKey(initialKey), 120);
      return () => clearTimeout(t);
    }
  }, [params?.section, sections, scrollToKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={[s.page, { backgroundColor: theme.top }]}>
      <Stack.Screen options={{ title: 'Language & Requirements' }} />
      <HeaderSpacer />

      {/* Hero */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={s.heroIcon}>
          <Ionicons name="language-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.h1, { color: theme.text }]}>Language & Requirements</Text>
          <Text style={[s.sub, { color: theme.subText }]}>
            Typical test thresholds for English- and Korean-track programs. Competitive majors may expect more.
          </Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          style={[s.backBtn, { borderColor: theme.stroke, backgroundColor: theme.surface }]}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={18} color={theme.primary} />
          <Text style={[s.backText, { color: theme.primary }]}>Back</Text>
        </Pressable>
      </View>

      {/* Compact TOC chips */}
      <View style={[s.chips, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        {sections.map((sec) => (
          <Pressable
            key={sec.key}
            onPress={() => scrollToKey(sec.key)}
            style={[s.chip, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}
            accessibilityRole="button"
            accessibilityLabel={`Go to ${sec.title}`}
          >
            <Ionicons name={sec.icon} size={14} color={theme.primary} />
            <Text style={[s.chipText, { color: theme.chipText }]}>{sec.title}</Text>
          </Pressable>
        ))}
      </View>

      {/* Overview */}
      <Card onLayout={(e) => onLayoutSection('overview', e.nativeEvent.layout.y)} theme={theme}>
        <Text style={[s.lead, { color: theme.text }]}>
          Universities set their own thresholds. The ranges below are <Text style={{ fontWeight: '800' }}>typical minimums</Text>;
          strong applicants often exceed them, especially for scholarships or selective departments.
        </Text>
      </Card>

      {/* Two-track panel: English vs Korean */}
      <View style={s.dualWrap}>
        {/* English-medium */}
        <Card onLayout={(e) => onLayoutSection('english', e.nativeEvent.layout.y)} theme={theme} style={{ flex: 1 }}>
          <TrackHeader icon="flag-outline" title="English-medium programs" theme={theme} />
          <BadgeRow
            theme={theme}
            items={[
              { label: 'TOEFL iBT 71–80' },
              { label: 'IELTS 5.5–6.0' },
              { label: 'Duolingo 95–105' },
            ]}
          />
          <Bullets
            theme={theme}
            items={[
              'Higher scores recommended for competitive majors or scholarships.',
              'Waivers possible with prior studies fully in English (proof required).',
            ]}
          />
        </Card>

        {/* Korean-medium */}
        <Card onLayout={(e) => onLayoutSection('korean', e.nativeEvent.layout.y)} theme={theme} style={{ flex: 1 }}>
          <TrackHeader icon="school-outline" title="Korean-medium programs" theme={theme} />
          <BadgeRow
            theme={theme}
            items={[
              { label: 'TOPIK II 3–4 (entry)' },
              { label: 'TOPIK II 5–6 (recommended)' },
            ]}
          />
          <Bullets
            theme={theme}
            items={[
              'University language centers (KLI) can help you reach the level pre-matriculation.',
              'Some majors may require higher Korean, especially writing-heavy tracks.',
            ]}
          />
        </Card>
      </View>

      {/* Proof & waivers */}
      <Card onLayout={(e) => onLayoutSection('proof', e.nativeEvent.layout.y)} theme={theme}>
        <SectionTitle icon="document-text-outline" title="Proof & waivers" theme={theme} />
        <Table
          zebra
          theme={theme}
          columns={[
            { key: 'type', label: 'Requirement' },
            { key: 'accepted', label: 'Typically accepted' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={[
            { type: 'English proficiency', accepted: 'TOEFL / IELTS / Duolingo', notes: 'Score validity window applies' },
            { type: 'Korean proficiency', accepted: 'TOPIK II (3–6)', notes: 'Higher for competitive majors' },
            { type: 'Waiver', accepted: 'Prior studies in English', notes: 'Transcripts + medium-of-instruction letter' },
          ]}
        />
      </Card>

      {/* CTA */}
      <CTA
        theme={theme}
        onLayout={(e) => onLayoutSection('cta', e.nativeEvent.layout.y)}
        title="Check my eligibility"
        subtitle="We assess your level and propose a plan (language courses, timeline)."
        primary={{ label: 'Get assessed', href: '/contact' }}
        secondary={{ label: 'Find a program', href: '/programs' }}
      />
    </ScrollView>
  );
}

/* --------- Themed building blocks --------- */
function Card({ children, onLayout, theme, style }) {
  return (
    <View
      style={[
        s.card,
        { borderColor: theme.stroke, backgroundColor: theme.surface, shadowColor: '#000' },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

function SectionTitle({ icon, title, theme }) {
  return (
    <View style={s.sectionTitleRow}>
      <Ionicons name={icon} size={18} color={theme.primary} />
      <Text style={[s.h3, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function TrackHeader({ icon, title, theme }) {
  return (
    <View style={s.trackHeader}>
      <Ionicons name={icon} size={18} color={theme.primary} />
      <Text style={[s.h2, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function BadgeRow({ items, theme }) {
  return (
    <View style={s.badgeRow}>
      {items.map((b, i) => (
        <View key={i} style={[s.badge, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
          <Text style={[s.badgeText, { color: theme.chipText }]}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Bullets({ items, theme }) {
  return (
    <View style={{ gap: 6, marginTop: 6 }}>
      {items.map((t, i) => (
        <View key={i} style={s.bulletRow}>
          <Ionicons name="checkmark-circle-outline" size={16} color={theme.primary} style={{ marginTop: 2 }} />
          <Text style={[s.body, { color: theme.text }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function CTA({ title, subtitle, primary, secondary, onLayout, theme }) {
  const router = useRouter();
  const go = (href) => href?.startsWith('/') && router.push(href);
  return (
    <View
      style={[
        s.cta,
        { borderColor: theme.stroke, backgroundColor: theme.surface, shadowColor: '#000' },
      ]}
      onLayout={onLayout}
    >
      <Text style={[s.h2, { color: theme.text }]}>{title}</Text>
      {!!subtitle && <Text style={[s.sub, { color: theme.subText }]}>{subtitle}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {!!primary && (
          <Pressable onPress={() => go(primary.href)} style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]} accessibilityRole="button">
            <Text style={s.btnPrimaryText}>{primary.label}</Text>
          </Pressable>
        )}
        {!!secondary && (
          <Pressable onPress={() => go(secondary.href)} style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]} accessibilityRole="button">
            <Text style={[s.btnGhostText, { color: theme.primary }]}>{secondary.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Table({ columns, rows, zebra = false, theme }) {
  return (
    <View style={[s.table, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
      <View style={[s.tr, s.trHead, { borderBottomColor: theme.stroke, backgroundColor: theme.mid }]}>
        {columns.map((c) => (
          <View key={c.key} style={[s.td, { flex: 1 }]}>
            <Text style={[s.thText, { color: theme.text }]}>{c.label}</Text>
          </View>
        ))}
      </View>
      {rows.map((r, i) => {
        const zebraBg = zebra && i % 2 === 1 ? (theme.surfaceAlt ?? 'rgba(0,0,0,0.03)') : theme.surface;
        return (
          <View key={i} style={[s.tr, { borderBottomColor: theme.stroke, backgroundColor: zebraBg }]}>
            {columns.map((c) => (
              <View key={c.key} style={[s.td, { flex: 1 }]}>
                <Text style={[s.tdText, { color: theme.text }]}>{r[c.key]}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

/* ----------------- Styles ----------------- */
const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', paddingBottom: 40 },

  // hero
  hero: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  heroIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginTop: 2,
  },

  // chips TOC
  chips: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: { fontWeight: '800' },

  // text scales
  h1: { fontSize: 26, fontWeight: '900' },
  h2: { fontSize: 20, fontWeight: '900' },
  h3: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
  sub: { marginTop: 2 },
  body: { lineHeight: 20 },
  lead: { lineHeight: 22 },

  // back btn
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  backText: { fontWeight: '800' },

  // dual track
  dualWrap: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },

  // cards
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  // badges
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  badge: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10 },
  badgeText: { fontWeight: '800', fontSize: 13 },

  // bullets
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'flex-start' },

  // CTA
  cta: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  btn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '900' },
  btnGhost: { backgroundColor: 'transparent' },
  btnGhostText: { fontWeight: '900' },

  // table
  table: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1 },
  trHead: {},
  td: { paddingVertical: 10, paddingHorizontal: 12 },
  thText: { fontWeight: '900' },
  tdText: {},
});
