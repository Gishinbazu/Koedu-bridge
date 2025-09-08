// app/programs/index.js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

import ProgramCard from '../../components/program/ProgramCard';
import ProgramSearchBar from '../../components/program/ProgramSearchBar';
import { useProgramSearch } from '../../hooks/useProgramSearch';

// (optional) quick DB sanity check — remove in prod
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

const PAGE_SIZE = 12;

// Small presentational chip for active filters
function FilterChip({ label, onClear }) {
  return (
    <View style={s.chip} accessibilityRole="text" aria-label={`${label} filter active`}>
      <Text style={s.chipText}>{label}</Text>
      {!!onClear && (
        <Pressable onPress={onClear} style={s.chipClose} accessibilityLabel={`Clear ${label}`}>
          <Ionicons name="close" size={14} color="#0b3b79" />
        </Pressable>
      )}
    </View>
  );
}

export default function ProgramsIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialQ = (params.q ?? '').toString();
  const initialLevel = (params.level ?? 'All').toString();
  const initialSemester = (params.semester ?? 'Any').toString();
  const initialUniversityId = (params.universityId ?? '').toString(); // ⬅️ read from URL

  const { searchPrograms } = useProgramSearch();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState([]);
  const [q, setQ] = useState(initialQ);
  const [level, setLevel] = useState(initialLevel);
  const [semester, setSemester] = useState(initialSemester);
  const [universityId, setUniversityId] = useState(initialUniversityId); // ⬅️ state
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // optional: direct DB check once
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'programs'));
        console.log('[DBG] programs count =', snap.size);
      } catch (e) {
        console.error('[DBG] programs direct getDocs error:', e);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  // keep URL in sync (web) — includes universityId
  const syncUrl = useCallback((next) => {
    const qp = new URLSearchParams({
      q: next.keyword || '',
      level: next.level || 'All',
      semester: next.semester || 'Any',
      universityId: next.universityId || '',
    }).toString();

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = `/programs?${qp}`;
      window.history.replaceState(null, '', url);
    }
  }, []);

  const runSearch = useCallback(
    async (overrides = {}) => {
      const payload = {
        keyword: overrides.keyword ?? q,
        level: overrides.level ?? level,
        semester: overrides.semester ?? semester,
        universityId: overrides.universityId ?? universityId, // ⬅️ pass to hook
        orderByTitle: false,
      };

      setLoading(true);
      setErrorMsg('');
      try {
        const rows = await searchPrograms(payload);
        setResults(rows);
        setPage(1);
        syncUrl(payload);
      } catch (e) {
        console.error('[ProgramsIndex] search error:', e);
        setErrorMsg('Unable to fetch programs right now.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [q, level, semester, universityId, searchPrograms, syncUrl]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await runSearch({});
    setRefreshing(false);
  }, [runSearch]);

  const resetFilters = useCallback(() => {
    const payload = { keyword: '', level: 'All', semester: 'Any', universityId: '' };
    setQ(payload.keyword);
    setLevel(payload.level);
    setSemester(payload.semester);
    setUniversityId(payload.universityId);
    setResults([]);
    setPage(1);
    syncUrl(payload);
  }, [syncUrl]);

  // when ProgramSearchBar submits
  const handleBarSearch = useCallback(
    ({ semester: sem, keyword, level: lvl, universityId: uid }) => {
      setSemester(sem);
      setQ(keyword);
      setLevel(lvl);
      if (typeof uid === 'string') setUniversityId(uid); // keep ID if provided
      runSearch({ semester: sem, keyword, level: lvl, universityId: uid });
    },
    [runSearch]
  );

  // auto-run on mount if URL has any initial filters (incl. universityId)
  useEffect(() => {
    if (initialUniversityId || initialQ || initialLevel !== 'All' || initialSemester !== 'Any') {
      runSearch({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: render a richer empty state
  const EmptyState = () => (
    <View style={s.emptyBox}>
      <View style={s.emptyIconWrap}>
        <Ionicons name="school" size={28} color="#0b3b79" />
      </View>
      <Text style={s.emptyTitle}>No programs found</Text>
      <Text style={s.emptyText}>
        Try adjusting your filters or keywords. You can also hit <Text style={{ fontWeight: '700' }}>Reset</Text>{' '}
        to clear all filters.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <Pressable onPress={() => runSearch({ keyword: '' })} style={[s.btn, { minWidth: 120 }]}>
          <Text style={s.btnText}>Search all</Text>
        </Pressable>
        <Pressable onPress={resetFilters} style={[s.btn, s.btnGhost, { minWidth: 120 }]}>
          <Text style={[s.btnText, s.btnGhostText]}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );

  const hasActiveFilters = useMemo(() => {
    return (
      (q && q.trim().length > 0) ||
      level !== 'All' ||
      semester !== 'Any' ||
      (universityId && universityId.trim().length > 0)
    );
  }, [q, level, semester, universityId]);

  return (
    <ScrollView
      contentContainerStyle={s.page}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      {/* header */}
      <View style={[s.headerRow, Platform.OS === 'web' ? s.headerStickyWeb : null]}>
        <Pressable
          onPress={() => router.back()}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color="#0b3b79" />
          <Text style={s.backText}>Back</Text>
        </Pressable>

        <View style={s.titleWrap}>
          <Ionicons name="library" size={22} color="#0b3b79" />
          <Text style={s.h1}>Programs</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      {/* search bar (always visible) */}
      <View style={s.cardWrap}>
        <ProgramSearchBar
          initialSemester={initialSemester}
          initialLevel={initialLevel}
          initialKeyword={initialQ}
          initialUniversityId={initialUniversityId}
          onSearch={handleBarSearch}
          showReset
          onReset={resetFilters}
        />
      </View>

      {/* quick text filter row (optional) */}
      <View style={s.quickRow}>
        <View style={s.inputWrap}>
          <Ionicons name="search" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Quick filter by title, tags, or keywords…"
            style={s.input}
            returnKeyType="search"
            onSubmitEditing={() => runSearch({ keyword: q })}
          />
        </View>
        <Pressable onPress={() => runSearch({ keyword: q })} style={s.btn}>
          <Text style={s.btnText}>Search</Text>
        </Pressable>
        <Pressable onPress={resetFilters} style={[s.btn, s.btnGhost]}>
          <Text style={[s.btnText, s.btnGhostText]}>Reset</Text>
        </Pressable>
      </View>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <View style={s.chipsRow}>
          {q ? <FilterChip label={`Keyword: “${q}”`} onClear={() => { setQ(''); runSearch({ keyword: '' }); }} /> : null}
          {level !== 'All' ? (
            <FilterChip label={`Level: ${level}`} onClear={() => { setLevel('All'); runSearch({ level: 'All' }); }} />
          ) : null}
          {semester !== 'Any' ? (
            <FilterChip label={`Semester: ${semester}`} onClear={() => { setSemester('Any'); runSearch({ semester: 'Any' }); }} />
          ) : null}
          {universityId ? (
            <FilterChip label={`University: ${universityId}`} onClear={() => { setUniversityId(''); runSearch({ universityId: '' }); }} />
          ) : null}
          <Pressable onPress={resetFilters} style={s.clearAllBtn}>
            <Ionicons name="sparkles" size={14} color="#0b3b79" />
            <Text style={s.clearAllText}>Clear all</Text>
          </Pressable>
        </View>
      )}

      {/* loading */}
      {loading && (
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={{ color: '#666', marginTop: 6 }}>Searching…</Text>
        </View>
      )}

      {/* error */}
      {!loading && !!errorMsg && (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* results */}
      {!loading && !errorMsg && (
        <>
          <View style={s.countRow}>
            <Text style={s.count}><Text style={{ fontWeight: '800', color: '#0b3b79' }}>{results.length}</Text> result{results.length === 1 ? '' : 's'}</Text>
            {results.length > PAGE_SIZE ? (
              <Text style={s.subtle}>Showing {paged.length} per page</Text>
            ) : null}
          </View>

          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <View style={s.grid}>
                {paged.map((p) => (
                  <View key={p.id} style={s.gridItem}>
                    <ProgramCard
                      program={p}
                      onPress={() => router.push(`/programs/${encodeURIComponent(p.id)}`)}
                    />
                  </View>
                ))}
              </View>

              {totalPages > 1 && (
                <View style={s.pager}>
                  <Pressable
                    disabled={page <= 1}
                    onPress={() => setPage((x) => Math.max(1, x - 1))}
                    style={[s.pill, page <= 1 && s.pillDisabled]}
                    accessibilityLabel="Previous page"
                  >
                    <Ionicons name="chevron-back" size={16} color="#0f172a" />
                    <Text>Prev</Text>
                  </Pressable>

                  <Text style={{ marginHorizontal: 8 }}>
                    Page <Text style={{ fontWeight: '700' }}>{page}</Text> / {totalPages}
                  </Text>

                  <Pressable
                    disabled={page >= totalPages}
                    onPress={() => setPage((x) => Math.min(totalPages, x + 1))}
                    style={[s.pill, page >= totalPages && s.pillDisabled]}
                    accessibilityLabel="Next page"
                  >
                    <Text>Next</Text>
                    <Ionicons name="chevron-forward" size={16} color="#0f172a" />
                  </Pressable>
                </View>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { padding: 16, maxWidth: 1100, alignSelf: 'center', width: '100%', paddingBottom: 40 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerStickyWeb: Platform.select({
    web: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: 'rgba(255,255,255,0.9)',
      backdropFilter: 'saturate(1.2) blur(6px)',
      borderBottomWidth: 1,
      borderColor: '#eef2f7',
      paddingVertical: 8,
      marginBottom: 14,
    },
    default: {},
  }),
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  backText: { color: '#0b3b79', fontWeight: '700' },

  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  h1: { fontSize: 26, fontWeight: '800' },

  cardWrap: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 12,
  },

  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'center' },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 44,
  },
  btn: {
    backgroundColor: '#0b3b79',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd5e1' },
  btnGhostText: { color: '#0b3b79' },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    borderColor: '#bfd5ff',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipText: { color: '#0b3b79', fontWeight: '600' },
  chipClose: {
    marginLeft: 6,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cfe0ff',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  clearAllText: { color: '#0b3b79', fontWeight: '700' },

  center: { paddingVertical: 24, alignItems: 'center' },
  errorBox: {
    padding: 12,
    backgroundColor: '#fff1f0',
    borderColor: '#ffccc7',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: { color: '#a8071a' },

  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subtle: { color: '#64748b' },
  count: { color: '#334155' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    maxWidth: '48%',
    // On large web screens allow 3 columns comfortably
    ...(Platform.OS === 'web' ? { maxWidth: '31%' } : null),
  },

  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  pillDisabled: { opacity: 0.5 },

  emptyBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef4ff',
    borderWidth: 1,
    borderColor: '#bfd5ff',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0b3b79', marginBottom: 6 },
  emptyText: { color: '#475569', textAlign: 'center' },
});
