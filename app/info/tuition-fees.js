// app/info/tuition-fees.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function TuitionFeesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  const sections = useMemo(
    () => [
      { key: 'overview', title: 'Overview' },
      { key: 'ranges', title: 'Tuition ranges' },
      { key: 'scholarships', title: 'Scholarships' },
      { key: 'tips', title: 'Budget tips' },
      { key: 'cta', title: 'Next steps' },
    ],
    []
  );

  // capture offsets
  const [offsets, setOffsets] = useState(Object.fromEntries(sections.map(s => [s.key, 0])));
  const onLayoutSection = (key, y) =>
    setOffsets(prev => ({ ...prev, [key]: y }));

  const scrollToKey = (key) => {
    const y = offsets[key] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#section-${key}`);
    }
  };

  useEffect(() => {
    let initialKey = null;
    if (params?.section && sections.some(s => s.key === params.section)) {
      initialKey = params.section;
    }
    if (!initialKey && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/section-([a-z0-9-]+)/i);
      const hk = m?.[1];
      if (hk && sections.some(s => s.key === hk)) initialKey = hk;
    }
    if (initialKey) {
      const t = setTimeout(() => scrollToKey(initialKey), 120);
      return () => clearTimeout(t);
    }
  }, [params?.section, sections]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Tuition & Scholarships' }} />

      <Header title="Tuition & Scholarships" subtitle="Overview of study costs in Korea and common scholarship routes." onBack={() => router.back()} />

      {/* Sticky TOC */}
      <View style={s.toc}>
        <Text style={s.tocTitle}>📘 On this page</Text>
        <View style={{ gap: 6 }}>
          {sections.map((sec) => (
            <Pressable
              key={sec.key}
              style={({ pressed }) => [s.tocItem, pressed && s.pressed]}
              onPress={() => scrollToKey(sec.key)}
              accessibilityRole="button"
              accessibilityLabel={`Go to ${sec.title}`}
            >
              <Text style={s.tocDot}>•</Text>
              <Text style={s.tocText}>{sec.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Overview */}
      <Card onLayout={(e) => onLayoutSection('overview', e.nativeEvent.layout.y)}>
        <Text style={s.lead}>
          Costs vary by university and program. Below are **indicative** ranges and frequent scholarship mechanisms
          so you can plan a realistic budget before you apply.
        </Text>
      </Card>

      {/* Tuition Ranges */}
      <Card onLayout={(e) => onLayoutSection('ranges', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Indicative tuition ranges (per semester)</Text>
        <Table
          columns={[
            { key: 'level', label: 'Level' },
            { key: 'tuition', label: 'Tuition (USD)' },
            { key: 'notes', label: 'Notes' },
          ]}
          rows={[
            { level: 'Bachelor', tuition: '$1,800 – $3,500', notes: 'Varies by faculty' },
            { level: 'Master', tuition: '$2,000 – $4,200', notes: 'Labs may add extra fees' },
            { level: 'Language (KLI)', tuition: '$1,100 – $1,600', notes: 'Per session (~10–12 weeks)' },
          ]}
        />
      </Card>

      {/* Scholarships */}
      <Card onLayout={(e) => onLayoutSection('scholarships', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Common scholarships</Text>
        <Bullet text="Entrance discounts (20%–50%) based on academic profile." />
        <Bullet text="Internal scholarships (merit, need, department)." />
        <Bullet text="Research / Teaching assistantships (faculty-dependent)." />
        <Bullet text="Government scholarships (e.g., GKS) — competitive." />
      </Card>

      {/* Budget Tips */}
      <Card onLayout={(e) => onLayoutSection('tips', e.nativeEvent.layout.y)}>
        <Text style={s.h3}>Budget tips</Text>
        <Bullet text="Plan for living costs: housing, transport, meals, insurance, phone." />
        <Bullet text="Consider part-time campus jobs within visa rules." />
        <Bullet text="Check dorm vs. studio costs; factor semester breaks." />
      </Card>

      {/* CTA */}
      <CTA
        onLayout={(e) => onLayoutSection('cta', e.nativeEvent.layout.y)}
        title="Estimate my budget"
        subtitle="Talk to an advisor for a personalized plan."
        primary={{ label: 'Talk to an advisor', href: '/contact' }}
        secondary={{ label: 'Browse programs', href: '/programs' }}
      />
    </ScrollView>
  );
}

/* ----------------- Reusable bits for this screen ----------------- */
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

function Card({ children, onLayout }) {
  return (
    <View style={s.card} onLayout={onLayout}>
      {children}
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

function CTA({ title, subtitle, primary, secondary, onLayout }) {
  const router = useRouter();
  const go = (href) => href?.startsWith('/') && router.push(href);
  return (
    <View style={s.cta} onLayout={onLayout}>
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
          <View key={c.key} style={[s.td, { flex: 1 }]}>
            <Text style={s.thText}>{c.label}</Text>
          </View>
        ))}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={s.tr}>
          {columns.map((c) => (
            <View key={c.key} style={[s.td, { flex: 1 }]}>
              <Text style={s.tdText}>{r[c.key]}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/* ----------------- Styles ----------------- */
const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  backText: { color: '#0b3b79', fontWeight: '700' },

  h1: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  h2: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  h3: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  sub: { color: '#64748b', marginTop: 2 },
  body: { color: '#334155', lineHeight: 20 },
  lead: { color: '#334155', lineHeight: 22 },

  card: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: '#ffffff',
    marginBottom: 10,
  },

  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'flex-start' },
  bullet: { color: '#0b3b79', fontWeight: '800', marginTop: 1 },

  cta: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, backgroundColor: '#ffffff', marginTop: 6 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: '#0b3b79', borderColor: '#0b3b79' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: '#cbd5e1' },
  btnGhostText: { color: '#0b3b79', fontWeight: '800' },

  table: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  trHead: { backgroundColor: '#f8fafc' },
  td: { paddingVertical: 10, paddingHorizontal: 12 },
  thText: { fontWeight: '800', color: '#0f172a' },
  tdText: { color: '#334155' },

  // sticky TOC
  toc: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e2e8f0',
    ...(Platform.OS === 'web'
      ? { position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'saturate(1.1) blur(4px)' }
      : null),
  },
  tocTitle: { fontSize: 16, fontWeight: '800', color: '#0b3b79', marginBottom: 6 },
  tocItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  tocDot: { color: '#0b3b79', fontWeight: '800' },
  tocText: { fontSize: 14, color: '#0b3b79' },
  pressed: { backgroundColor: '#e6effa' },
});
