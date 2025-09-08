// app/universities/index.js
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import UniversityCard from '../../components/university/UniversityCard';
import { useUniversitySearch } from '../../hooks/useUniversitySearch';

export default function UniversitiesIndex() {
  const router = useRouter();
  const { searchUniversities } = useUniversitySearch();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');

  const run = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await searchUniversities({ region, type, keyword }));
    } finally {
      setLoading(false);
    }
  }, [region, type, keyword, searchUniversities]);

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.h1}>Universities</Text>

      <View style={s.filters}>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search universities…"
          style={s.input}
          returnKeyType="search"
          onSubmitEditing={run}
        />
        <Pressable onPress={run} style={s.btn}>
          <Text style={s.btnText}>Search</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator />
          <Text style={{ color: '#666', marginTop: 6 }}>Loading…</Text>
        </View>
      ) : (
        <>
          <Text style={s.count}>{rows.length} result(s)</Text>
          <View style={s.grid}>
            {rows.map((u) => (
              <UniversityCard
                key={u.id}
                university={u}
                // ⬇️ Navigate to /programs with universityId in the URL
                onPress={() =>
                  router.push(
                    `/programs?q=&level=All&semester=Any&universityId=${encodeURIComponent(
                      u.id
                    )}`
                  )
                }
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    padding: 16,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 40,
  },
  h1: { fontSize: 26, fontWeight: '800', marginBottom: 10 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#0b3b79',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  center: { paddingVertical: 24, alignItems: 'center' },
  count: { marginBottom: 8, color: '#555' },
  grid: { flexDirection: 'column', gap: 10 },
});
