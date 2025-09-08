// app/programs/index.js — Public Programs List (upgraded)
import { Stack, useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { db } from '../../services/firebase';

/* ────────── Configs / constants ────────── */
const LEVELS = ['All', 'Bachelor', 'Master', 'PhD', 'Language', 'Certificate'];
const SEMESTERS = ['Any', 'Spring', 'Summer', 'Fall', 'Winter'];

/* Normalize + publication check (supports status OR published) */
function normalizeProgram(raw, id) {
  const published =
    raw?.published === true || (typeof raw?.status === 'string' && raw.status.toLowerCase() === 'published');

  return {
    id,
    published,
    title: raw?.title ?? raw?.name ?? '',
    universityName: raw?.universityName ?? raw?.university ?? '',
    level: raw?.level ?? '',
    semester: raw?.semester ?? '',
    summary: raw?.summary ?? '',
    description: raw?.description ?? '',
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
  };
}

/* Simple debounce hook */
function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function ProgramsIndex() {
  const router = useRouter();

  // Filters / UI state
  const [qtext, setQtext] = useState('');
  const debouncedQ = useDebounced(qtext);
  const [level, setLevel] = useState('All');
  const [semester, setSemester] = useState('Any');

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const allRef = useRef([]); // cache toutes les lignes pour filtrage local

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'programs'), orderBy('title'));
      const snap = await getDocs(q);
      const all = [];
      snap.forEach((docSnap) => {
        const norm = normalizeProgram(docSnap.data(), docSnap.id);
        if (norm.published) all.push(norm);
      });
      allRef.current = all;
      setRows(applyFilters(all, { q: debouncedQ, level, semester }));
    } catch (e) {
      console.warn('[programs/index] load error:', e);
      allRef.current = [];
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, level, semester]);

  // First load
  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [load]);

  // Re-apply filters locally when search/filters change (without refetch)
  useEffect(() => {
    setRows(applyFilters(allRef.current, { q: debouncedQ, level, semester }));
  }, [debouncedQ, level, semester]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  const resultsLabel = useMemo(() => {
    const n = rows.length;
    return n === 0 ? '0 results' : `${n} result${n > 1 ? 's' : ''}`;
  }, [rows]);

  return (
    <ScrollView
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Stack.Screen options={{ title: 'Programs' }} />

      {/* Filters */}
      <View style={s.filtersCard}>
        <View style={s.filtersRow}>
          <Dropdown
            label="Semester"
            value={semester}
            setValue={setSemester}
            options={SEMESTERS}
          />
          <TextInput
            value={qtext}
            onChangeText={setQtext}
            placeholder="Keywords e.g. AI, Business, Seoul…"
            placeholderTextColor="#9aa3b2"
            style={s.input}
          />
          <Dropdown
            label="Level"
            value={level}
            setValue={setLevel}
            options={LEVELS}
          />
        </View>

        <View style={[s.filtersRow, { marginTop: 10 }]}>
          <View style={{ flex: 1 }}>
            <TextInput
              value={qtext}
              onChangeText={setQtext}
              placeholder="Quick filter by title, tags, or keywords…"
              placeholderTextColor="#9aa3b2"
              style={s.input}
            />
          </View>
          <Pressable style={s.btn} onPress={() => setRows(applyFilters(allRef.current, { q: debouncedQ, level, semester }))}>
            <Text style={s.btnText}>Search</Text>
          </Pressable>
          <Pressable style={s.btnGhost} onPress={() => { setQtext(''); setLevel('All'); setSemester('Any'); }}>
            <Text style={s.btnGhostText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {/* Results header */}
      <View style={s.resultsHeader}>
        <Text style={s.resultsText}>{resultsLabel}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={s.smallBtn} onPress={() => setRows(applyFilters(allRef.current, { q: '', level: 'All', semester: 'Any' }))}>
            <Text style={s.smallBtnText}>Search all</Text>
          </Pressable>
          <Pressable style={s.smallBtn} onPress={onRefresh}>
            <Text style={s.smallBtnText}>Reload</Text>
          </Pressable>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={s.note}>Loading…</Text>
        </View>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={s.grid}>
          {rows.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/programs/${p.id}`)}
              style={s.card}
              accessibilityRole="button"
              accessibilityLabel={`Open ${p.title}`}
            >
              <Text style={s.h2} numberOfLines={2}>{p.title || 'Untitled program'}</Text>
              <Text style={s.meta} numberOfLines={1}>{p.universityName || '—'}</Text>
              <Text style={s.meta} numberOfLines={1}>
                {p.level || '—'}{p.semester ? ` • ${p.semester}` : ''}
              </Text>
              {!!p.summary && <Text style={s.body} numberOfLines={3}>{p.summary}</Text>}
              {!!p.tags?.length && (
                <Text style={s.tags} numberOfLines={1}>#{p.tags.join('  #')}</Text>
              )}
              <Text style={s.link}>Learn more →</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

/* ────────── Components ────────── */
function Dropdown({ label, value, setValue, options }) {
  return (
    <View style={s.dropdownWrap}>
      <Text style={s.dropdownLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => setValue(opt)}
              style={[s.pill, active && s.pillActive]}
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${opt}`}
            >
              <Text style={[s.pillText, active && s.pillTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>🎓</Text>
      <Text style={s.emptyTitle}>No programs found</Text>
      <Text style={s.note}>
        Try adjusting your filters or keywords. You can also hit <Text style={{ fontWeight: '800' }}>Search all</Text> to clear all filters.
      </Text>
    </View>
  );
}

/* ────────── Filtering logic ────────── */
function applyFilters(all, { q, level, semester }) {
  const qnorm = (q || '').trim().toLowerCase();
  const wantLevel = (level || 'All').toLowerCase();
  const wantSem = (semester || 'Any').toLowerCase();

  return all.filter((p) => {
    if (wantLevel !== 'all' && (p.level || '').toLowerCase() !== wantLevel) return false;
    if (wantSem !== 'any' && (p.semester || '').toLowerCase() !== wantSem) return false;

    if (!qnorm) return true;

    const hay = [
      p.title,
      p.universityName,
      p.level,
      p.semester,
      p.summary,
      p.description,
      ...(Array.isArray(p.tags) ? p.tags : []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return hay.includes(qnorm);
  });
}

/* ────────── Styles ────────── */
const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', gap: 12, backgroundColor: '#fff', paddingBottom: 40 },

  /* Filters */
  filtersCard: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#fff', padding: 12,
  },
  filtersRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: '#0f172a',
  },
  btn: { backgroundColor: '#0b3b79', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnGhostText: { color: '#0b3b79', fontWeight: '800' },

  dropdownWrap: { flex: 1 },
  dropdownLabel: { color: '#475569', marginBottom: 6, fontWeight: '700' },
  pill: { borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  pillActive: { backgroundColor: '#0b3b79', borderColor: '#0b3b79' },
  pillText: { color: '#0f172a', fontWeight: '800' },
  pillTextActive: { color: '#fff' },

  /* Results header */
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  resultsText: { color: '#0f172a', fontWeight: '800' },
  smallBtn: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  smallBtnText: { color: '#0f172a', fontWeight: '800' },

  /* Grid + cards */
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  card: {
    width: Platform.select({ web: '31.7%', default: '48%' }),
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, backgroundColor: '#0b1220',
  },
  h2: { color: '#e6eefb', fontWeight: '900', fontSize: 18, marginBottom: 4 },
  meta: { color: '#a9b5c7', marginTop: 1 },
  body: { color: '#dce7f7', marginTop: 8, lineHeight: 20 },
  tags: { color: '#8ab4ff', fontWeight: '800', marginTop: 8 },
  link: { color: '#bcd0ff', fontWeight: '900', marginTop: 12 },

  /* Misc */
  center: { alignItems: 'center', padding: 20 },
  note: { color: '#64748b', marginTop: 6 },

  empty: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 18, alignItems: 'center' },
  emptyIcon: { fontSize: 30, marginBottom: 6 },
  emptyTitle: { fontWeight: '900', color: '#0f172a', marginBottom: 6, fontSize: 16 },
});
