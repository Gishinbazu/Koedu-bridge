// app/info/faq.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

export default function FAQScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  const allFaqs = useMemo(
    () => [
      {
        q: 'How long does the full process take?',
        a: 'On average 6–12 weeks excluding visa. The D-2 visa adds 2–5 weeks depending on the country.',
      },
      {
        q: 'Can I apply to multiple universities?',
        a: 'Yes. We recommend 2–3 choices. Application fees differ by institution.',
      },
      {
        q: 'Do I need to speak Korean?',
        a: 'Not for English-track programs; basics help daily life. Korean-track programs require TOPIK.',
      },
      {
        q: 'Do you offer airport pickup?',
        a: 'Yes, we provide arrival and settling-in options (SIM, bank, transport) as needed.',
      },
      {
        q: 'What documents are typically required?',
        a: 'Passport, transcripts, diplomas, proof of language proficiency, and country-specific legalizations (e.g., apostille).',
      },
      {
        q: 'Can KOEDU help with scholarships?',
        a: 'We map scholarship options that fit your profile and deadlines (university and government).',
      },
    ],
    []
  );

  const [query, setQuery] = useState('');
  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allFaqs;
    return allFaqs.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [query, allFaqs]);

  // manage expand/collapse
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (idx) => setOpenIndex((i) => (i === idx ? -1 : idx));
  const openAll = () => setOpenIndex(-2); // special state: all open
  const closeAll = () => setOpenIndex(-1);

  // deep link ?q= / #q-2 to a question
  useEffect(() => {
    let idx = null;

    if (params?.q) {
      const n = parseInt(String(params.q), 10);
      if (!isNaN(n) && n >= 1 && n <= faqs.length) idx = n - 1;
    }

    if (idx == null && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/q-(\d+)/i);
      const n = m ? parseInt(m[1], 10) : NaN;
      if (!isNaN(n) && n >= 1 && n <= faqs.length) idx = n - 1;
    }

    if (idx != null) setOpenIndex(idx);
  }, [params?.q, faqs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'FAQ' }} />

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
            <Ionicons name="help-circle-outline" size={16} color="#0b1120" />
            <Text style={styles.badgeText}>FAQ</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
        <Text style={styles.heroSubtitle}>
          Quick answers about applications, documents, visas, and arrival support.
        </Text>

        <View style={styles.chipsRow}>
          <Chip icon="search-outline" label="Search instantly" />
          <Chip icon="layers-outline" label="Open/close all" />
          <Chip icon="chatbubble-ellipses-outline" label="Get support" />
        </View>
      </View>

      {/* CONTROLS (Bachelor-style dark card) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Search</Text>

        <View style={styles.controlRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={16} color="rgba(203,213,245,0.75)" />
            <TextInput
              placeholder="Search FAQ…"
              placeholderTextColor="rgba(203,213,245,0.55)"
              style={styles.search}
              value={query}
              onChangeText={setQuery}
              accessibilityLabel="Search FAQ"
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={openAll}
              style={({ pressed }) => [styles.pill, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Open all"
            >
              <Ionicons name="add-circle-outline" size={16} color="#0b1120" />
              <Text style={styles.pillTextDark}>Open all</Text>
            </Pressable>

            <Pressable
              onPress={closeAll}
              style={({ pressed }) => [styles.pillGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Close all"
            >
              <Ionicons name="remove-circle-outline" size={16} color="#e5edff" />
              <Text style={styles.pillText}>Close all</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* FAQ LIST */}
      <View style={styles.sectionsWrap}>
        {faqs.length === 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.paragraph}>No results. Try a different keyword.</Text>
          </View>
        ) : (
          faqs.map((f, i) => (
            <Accordion
              key={`${f.q}-${i}`}
              title={`Q${i + 1}. ${f.q}`}
              open={openIndex === -2 || openIndex === i}
              onToggle={() => toggle(i)}
            >
              <Text style={styles.paragraph}>{f.a}</Text>
            </Accordion>
          ))
        )}

        {/* CTA (Bachelor style) */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Still have questions?</Text>
          <Text style={styles.ctaSubtitle}>
            Send us your profile and target intake — we’ll answer with a clear plan.
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

        <Text style={styles.footerNote}>
          Email: <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ----------------- UI bits ----------------- */
function Chip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#e5edff" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function Accordion({ title, children, open, onToggle }) {
  return (
    <View style={styles.accordion}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.accHeader, pressed && { opacity: 0.92 }]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: !!open }}
      >
        <Text style={styles.accTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#e5edff" />
      </Pressable>

      {open && <View style={styles.accBody}>{children}</View>}
    </View>
  );
}

/* ----------------- Styles (Bachelor vibe) ----------------- */
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

  sectionsWrap: { width: '100%', maxWidth: 900, marginTop: 12, gap: 12 },

  sectionCard: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
    marginTop: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#e5edff', marginBottom: 10 },
  paragraph: { color: '#cbd5f5', fontSize: 14, lineHeight: 22 },

  /* controls */
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    minWidth: 240,
  },
  search: { flex: 1, color: '#e5edff', paddingVertical: 0 },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#f97316',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  pillGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
  },
  pillTextDark: { color: '#0b1120', fontWeight: '900' },
  pillText: { color: '#e5edff', fontWeight: '900' },

  /* accordion */
  accordion: {
    borderRadius: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
    overflow: 'hidden',
  },
  accHeader: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15,23,42,0.35)',
  },
  accTitle: { color: '#e5edff', fontWeight: '900', fontSize: 14, flex: 1, paddingRight: 10 },
  accBody: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 10 },

  /* CTA */
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
