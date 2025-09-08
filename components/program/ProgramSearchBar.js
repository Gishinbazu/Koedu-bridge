// components/program/ProgramSearchBar.js
import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

function Select({ value, onChange, options, style, testID }) {
  if (Platform.OS === 'web') {
    return (
      <View style={[style, { paddingHorizontal: 0, paddingVertical: 0 }]}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            height: 44,
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '0 10px',
            fontSize: 14,
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
          }}
          data-testid={testID}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </View>
    );
  }
  return (
    <Picker selectedValue={value} onValueChange={onChange} style={[style, { height: 44 }]} dropdownIconColor="#111">
      {options.map((opt) => (
        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
      ))}
    </Picker>
  );
}

export default function ProgramSearchBar({
  initialSemester = 'Any',
  initialLevel = 'All',
  initialKeyword = '',
  onSearch,
  showReset = false,
  onReset,
}) {
  const [semester, setSemester] = useState(initialSemester);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [level, setLevel] = useState(initialLevel);

  // si les props initiales changent (navigation), on resynchronise les champs
  useEffect(() => setSemester(initialSemester), [initialSemester]);
  useEffect(() => setLevel(initialLevel), [initialLevel]);
  useEffect(() => setKeyword(initialKeyword), [initialKeyword]);

  const semesterOptions = useMemo(
    () => [
      { label: 'Any semester', value: 'Any' },
      { label: '2026 Spring', value: '2026-Spring' },
      { label: '2025 Fall', value: '2025-Fall' },
      { label: '2025 Spring', value: '2025-Spring' },
    ],
    []
  );

  const levelOptions = useMemo(
    () => [
      { label: 'All levels', value: 'All' },
      { label: 'Bachelor', value: 'Bachelor' },
      { label: 'Master', value: 'Master' },
      { label: 'PhD', value: 'PhD' },
      { label: 'Language Program', value: 'Language' },
    ],
    []
  );

  const submit = () => onSearch?.({ semester, keyword, level });

  const reset = () => {
    setSemester('Any');
    setLevel('All');
    setKeyword('');
    onReset?.();
  };

  return (
    <View
      style={styles.container}
      // très important pour que la barre capte les interactions même si un parent est Pressable
      onStartShouldSetResponder={() => true}
    >
      <Select
        testID="semester-select"
        value={semester}
        onChange={setSemester}
        options={semesterOptions}
        style={[styles.field, styles.select]}
      />

      <TextInput
        placeholder="Keywords e.g. AI, Business, Seoul..."
        value={keyword}
        onChangeText={setKeyword}
        style={[styles.field, styles.input]}
        returnKeyType="search"
        onSubmitEditing={submit}   // Enter déclenche la recherche
      />

      <Select
        testID="level-select"
        value={level}
        onChange={setLevel}
        options={levelOptions}
        style={[styles.field, styles.select]}
      />

      <Pressable onPress={submit} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Find courses</Text>
      </Pressable>

      {showReset && (
        <Pressable onPress={reset} style={[styles.button, styles.ghostBtn]} accessibilityRole="button">
          <Text style={[styles.buttonText, styles.ghostText]}>Reset</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    elevation: 2,
    width: '100%',
    maxWidth: 920,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
  },
  field: {
    flex: 1,
    minWidth: 160,
  },
  select: {},
  input: {
    flex: 2,
    height: 44,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minWidth: 220,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0b3b79',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  buttonText: { color: '#fff', fontWeight: '800' },
  ghostBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd5e1' },
  ghostText: { color: '#0b3b79' },
});
