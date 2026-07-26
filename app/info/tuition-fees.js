// app/info/tuition-fees.js
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

import HeaderSpacer from '../../components/HeaderSpacer'; // ✅ optional spacer under global navbar
import { useAppTheme } from '../../theme/AppTheme';

export default function TuitionFeesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);
  const { theme } = useAppTheme();

  const sections = useMemo(
    () => [
      { key: 'overview', title: 'Overview', icon: 'book-outline' },
      { key: 'ranges', title: 'Tuition ranges', icon: 'cash-outline' },
      { key: 'scholarships', title: 'Scholarships', icon: 'ribbon-outline' },
      { key: 'tips', title: 'Budget tips', icon: 'bulb-outline' },
      { key: 'cta', title: 'Next steps', icon: 'arrow-forward-circle-outline' },
    ],
    []
  );

  // capture offsets
  const [offsets, setOffsets] = useState(Object.fromEntries(sections.map(s => [s.key, 0])));
  const onLayoutSection = (key, y) => setOffsets(prev => ({ ...prev, [key]: y }));

  const scrollToKey = useCallback((key) => {
    const y = offsets[key] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#section-${key}`);
    }
  }, [offsets]);

  // initial deep-linking
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
  }, [params?.section, sections, scrollToKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={[s.page, { backgroundColor: theme.top }]}>
      <Stack.Screen options={{ title: 'Tuition & Scholarships' }} />
      <HeaderSpacer />

      {/* === HERO (different look vs. Language page) === */}
      <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        <View style={s.heroIcon}>
          <Ionicons name="cash-outline" size={22} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.h1, { color: theme.text }]}>Tuition & Scholarships</Text>
          <Text style={[s.sub, { color: theme.subText }]}>
            A practical view of study costs in Korea and where scholarships usually help.
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

      {/* === PILL NAV (replaces sticky card TOC) === */}
      <View style={[s.pills, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
        {sections.map((sec) => (
          <Pressable
            key={sec.key}
            onPress={() => scrollToKey(sec.key)}
            style={({ pressed }) => [
              s.pill,
              { borderColor: theme.stroke, backgroundColor: theme.surface },
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Go to ${sec.title}`}
          >
            <Ionicons name={sec.icon} size={16} color={theme.primary} />
            <Text style={[s.pillText, { color: theme.primary }]}>{sec.title}</Text>
          </Pressable>
        ))}
      </View>

      {/* === Sections === */}

      {/* Overview */}
      <Card onLayout={(e) => onLayoutSection('overview', e.nativeEvent.layout.y)} theme={theme}>
        <Text style={[s.lead, { color: theme.text }]}>
          Costs vary by university and program. Below are <Text style={{ fontWeight: '800' }}>indicative</Text> ranges and frequent scholarship mechanisms so you can plan a realistic budget before you apply.
        </Text>
      </Card>

      {/* Tuition ranges — price chips + zebra table */}
      <Card onLayout={(e) => onLayoutSection('ranges', e.nativeEvent.layout.y)} theme={theme}>
        <SectionTitle icon="cash-outline" title="Indicative tuition ranges (per semester)" theme={theme} />

        <View style={s.priceChipsRow}>
          <PriceChip label="Bachelor" value="$1,800–$3,500" theme={theme} />
          <PriceChip label="Master" value="$2,000–$4,200" theme={theme} />
          <PriceChip label="KLI (10–12 wks)" value="$1,100–$1,600" theme={theme} />
        </View>

        <Table
          zebra
          theme={theme}
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

      {/* Scholarships — banner + bullets */}
      <Card onLayout={(e) => onLayoutSection('scholarships', e.nativeEvent.layout.y)} theme={theme}>
        <SectionTitle icon="ribbon-outline" title="Common scholarships" theme={theme} />

        <InfoBanner
          theme={theme}
          icon="star-outline"
          text="Early applications with strong academics often receive 20%–50% entrance discounts."
        />

        <Bullets
          items={[
            'Entrance discounts (20%–50%) based on academic profile.',
            'Internal scholarships (merit, need, department).',
            'Research / Teaching assistantships (faculty-dependent).',
            'Government scholarships (e.g., GKS) — competitive.',
          ]}
          theme={theme}
        />
      </Card>

      {/* Budget tips — compact checklist */}
      <Card onLayout={(e) => onLayoutSection('tips', e.nativeEvent.layout.y)} theme={theme}>
        <SectionTitle icon="bulb-outline" title="Budget tips" theme={theme} />
        <Checklist
          items={[
            'Plan for living costs: housing, transport, meals, insurance, phone.',
            'Consider part-time campus jobs within visa rules.',
            'Compare dorm vs. studio; include semester breaks.',
          ]}
          theme={theme}
        />
      </Card>

      {/* CTA */}
      <CTA
        onLayout={(e) => onLayoutSection('cta', e.nativeEvent.layout.y)}
        theme={theme}
        title="Estimate my budget"
        subtitle="Talk to an advisor for a personalized plan."
        primary={{ label: 'Talk to an advisor', href: '/contact' }}
        secondary={{ label: 'Browse programs', href: '/programs' }}
      />
    </ScrollView>
  );
}

/* ----------------- Bits (themed) ----------------- */
function SectionTitle({ icon, title, theme }) {
  return (
    <View style={s.sectionTitleRow}>
      <Ionicons name={icon} size={18} color={theme.primary} />
      <Text style={[s.h3, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function Card({ children, onLayout, theme }) {
  return (
    <View
      style={[
        s.card,
        { borderColor: theme.stroke, backgroundColor: theme.surface, shadowColor: '#000' },
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

function PriceChip({ label, value, theme }) {
  return (
    <View style={[s.priceChip, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
      <Text style={[s.priceChipLabel, { color: theme.chipText }]}>{label}</Text>
      <Text style={[s.priceChipValue, { color: theme.primary }]}>{value}</Text>
    </View>
  );
}

function InfoBanner({ icon = 'information-circle-outline', text, theme }) {
  return (
    <View style={[s.banner, { borderColor: theme.stroke, backgroundColor: theme.surfaceAlt ?? 'rgba(0,0,0,0.04)' }]}>
      <Ionicons name={icon} size={18} color={theme.primary} />
      <Text style={[s.bannerText, { color: theme.text }]}>{text}</Text>
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

function Checklist({ items, theme }) {
  return (
    <View style={{ gap: 6 }}>
      {items.map((t, i) => (
        <View key={i} style={s.checkRow}>
          <View style={[s.checkBox, { borderColor: theme.stroke }]} />
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

  // pill nav
  pills: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: { fontWeight: '800' },

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

  // price chips
  priceChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  priceChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 160,
  },
  priceChipLabel: { fontWeight: '700', opacity: 0.9 },
  priceChipValue: { fontWeight: '900', marginTop: 2 },

  // banner
  banner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerText: { fontWeight: '700' },

  // lists
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'flex-start' },
  checkRow: { flexDirection: 'row', gap: 10, marginTop: 6, alignItems: 'flex-start' },
  checkBox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, marginTop: 2 },

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
