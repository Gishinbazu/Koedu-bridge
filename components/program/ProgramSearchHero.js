// components/ProgramSearchHero.js
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

function Pill({ children, style }) {
  return (
    <View style={[{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14, height: 48, justifyContent: 'center', backgroundColor: '#fff' }, style]}>
      {children}
    </View>
  );
}

export default function ProgramSearchHero({ initial = {} }) {
  const router = useRouter();

  const [semester, setSemester] = useState(initial.semester ?? 'Any');
  const [keyword, setKeyword]   = useState(initial.keyword ?? '');
  const [level, setLevel]       = useState(initial.level ?? 'All');
  const [showMore, setShowMore] = useState(false);

  // filtres avancés (exemples)
  const [universityId, setUniversityId] = useState(initial.universityId ?? '');
  const [language, setLanguage]         = useState(initial.language ?? '');

  const goSearch = useCallback(() => {
    const qp = new URLSearchParams({
      semester: semester || 'Any',
      q: keyword || '',
      level: level || 'All',
      universityId: universityId || '',
      language: language || '',
    }).toString();
    // web: URL propre / native: push normal
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = `/programs?${qp}`;
    } else {
      router.push(`/programs?${qp}`);
    }
  }, [semester, keyword, level, universityId, language, router]);

  return (
    <View style={{ width: '100%', alignSelf: 'center', paddingHorizontal: 16 }}>
      {/* Rangée principale */}
      <View style={{
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }
      }}>
        {/* Semester */}
        <Pill style={{ minWidth: 160 }}>
          <TextInput
            value={semester}
            onChangeText={setSemester}
            placeholder="Any semester"
            style={{ outlineStyle: 'none' }}
          />
        </Pill>

        {/* Keywords */}
        <Pill style={{ flex: 1 }}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Keywords e.g. AI, Business, Seoul…"
            returnKeyType="search"
            onSubmitEditing={goSearch}
            style={{ outlineStyle: 'none' }}
          />
        </Pill>

        {/* Level */}
        <Pill style={{ minWidth: 160 }}>
          <TextInput
            value={level}
            onChangeText={setLevel}
            placeholder="All levels"
            style={{ outlineStyle: 'none' }}
          />
        </Pill>

        {/* Find */}
        <Pressable
          onPress={goSearch}
          style={{ backgroundColor: '#0b3b79', height: 48, borderRadius: 14, paddingHorizontal: 18, justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Find courses</Text>
        </Pressable>

        {/* More filters toggle */}
        <Pressable
          onPress={() => setShowMore(v => !v)}
          style={{ height: 48, borderRadius: 14, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ color: '#0b3b79', fontWeight: '600' }}>{showMore ? 'Hide filters' : 'More filters'}</Text>
        </Pressable>
      </View>

      {/* Rangée avancée (dépliable) */}
      {showMore && (
        <View style={{ marginTop: 10, flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Pill style={{ minWidth: 220 }}>
            <TextInput
              value={universityId}
              onChangeText={setUniversityId}
              placeholder="University ID (optional)"
              style={{ outlineStyle: 'none' }}
            />
          </Pill>
          <Pill style={{ minWidth: 220 }}>
            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="Language (optional)"
              style={{ outlineStyle: 'none' }}
            />
          </Pill>

          <Pressable onPress={goSearch}
            style={{ backgroundColor: '#0b3b79', height: 48, borderRadius: 14, paddingHorizontal: 18, justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Apply filters</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
