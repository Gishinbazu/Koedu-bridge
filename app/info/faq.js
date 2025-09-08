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

export default function FAQScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  const allFaqs = useMemo(
    () => [
      { q: 'How long does the full process take?', a: 'On average 6–12 weeks excluding visa. The D-2 visa adds 2–5 weeks depending on the country.' },
      { q: 'Can I apply to multiple universities?', a: 'Yes. We recommend 2–3 choices. Application fees differ by institution.' },
      { q: 'Do I need to speak Korean?', a: 'Not for English-track programs; basics help daily life. Korean-track programs require TOPIK.' },
      { q: 'Do you offer airport pickup?', a: 'Yes, we provide arrival and settling-in options (SIM, bank, transport) as needed.' },
      { q: 'What documents are typically required?', a: 'Passport, transcripts, diplomas, proof of language proficiency, and country-specific legalizations (e.g., apostille).' },
      { q: 'Can KOEDU help with scholarships?', a: 'We map scholarship options that fit your profile and deadlines (university and government).' },
    ],
    []
  );

  const [query, setQuery] = useState('');
  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allFaqs;
    return allFaqs.filter(
      item =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
    );
  }, [query, allFaqs]);

  // manage expand/collapse
  const [openIndex, setOpenIndex] = useState(0);
  const toggle = (idx) => setOpenIndex(i => (i === idx ? -1 : idx));
  const openAll = () => setOpenIndex(-2); // special state: all open
  const closeAll = () => setOpenIndex(-1);

  // deep link ?q= / #q-2 to a question
  useEffect(() => {
    let idx = null;
    if (params?.q) {
      const n = parseInt(String(params.q), 10);
      if (!isNaN(n) && n >= 1 && n <= faqs.length) idx = n - 1;
    }
    if (!idx && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/q-(\d+)/i);
      const n = m ? parseInt(m[1], 10) : NaN;
      if (!isNaN(n) && n >= 1 && n <= faqs.length) idx = n - 1;
    }
    if (idx != null) setOpenIndex(idx);
  }, [params?.q, faqs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'FAQ' }} />

      <Header title="FAQ" subtitle="Answers to the most common questions." onBack={() => router.back()} />

      {/* Controls */}
      <View style={s.controlRow}>
        <View style={s.searchWrap}>
          <Ionicons name="search" size={16} color="#64748b" />
          <TextInput
            placeholder="Search FAQ…"
            placeholderTextColor="#94a3b8"
            style={s.search}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search FAQ"
          />
        </View>

        <View style={s.actions}>
          <Pressable onPress={openAll} style={({ pressed }) => [s.pill, pressed && s.pressed]}>
            <Ionicons name="add-circle-outline" size={16} color="#0f172a" />
            <Text>Open all</Text>
          </Pressable>
          <Pressable onPress={closeAll} style={({ pressed }) => [s.pill, pressed && s.pressed]}>
            <Ionicons name="remove-circle-outline" size={16} color="#0f172a" />
            <Text>Close all</Text>
          </Pressable>
        </View>
      </View>

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <Card>
          <Text style={s.body}>No results. Try a different keyword.</Text>
        </Card>
      ) : (
        faqs.map((f, i) => (
          <Accordion
            key={`${f.q}-${i}`}
            title={`Q${i + 1}. ${f.q}`}
            open={openIndex === -2 || openIndex === i}
            onToggle={() => toggle(i)}
          >
            <Text style={s.body}>{f.a}</Text>
          </Accordion>
        ))
      )}
    </ScrollView>
  );
}

/* ----------------- UI ----------------- */
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

function Card({ children }) {
  return <View style={s.card}>{children}</View>;
}

function Accordion({ title, children, open, onToggle }) {
  return (
    <View style={s.accordion}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [s.accHeader, pressed && s.accPressed]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: !!open }}
      >
        <Text style={s.h3}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#0f172a" />
      </Pressable>
      {open && <View style={s.accBody}>{children}</View>}
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
  h3: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sub: { color: '#64748b', marginTop: 2 },
  body: { color: '#334155', lineHeight: 20 },

  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: '#ffffff', marginBottom: 10 },

  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, flex: 1, minWidth: 240,
  },
  search: { flex: 1, color: '#0f172a', paddingVertical: 0 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff',
  },
  pressed: { backgroundColor: '#eef2ff' },

  accordion: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#fff',
    overflow: 'hidden', marginBottom: 8,
  },
  accHeader: { paddingVertical: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accPressed: { backgroundColor: '#f8fafc' },
  accBody: { paddingHorizontal: 12, paddingBottom: 12 },
});
