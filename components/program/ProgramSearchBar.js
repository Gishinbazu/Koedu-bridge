// components/program/ProgramSearchBar.js
import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

function Select({ value, onChange, options, style, testID, dense = false }) {
  const height = dense ? 40 : 44;

  if (Platform.OS === 'web') {
    return (
      <View style={[style, { paddingHorizontal: 0, paddingVertical: 0 }]}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            height,
            border: '1px solid #d1d5db',
            borderRadius: 10,
            padding: '0 12px',
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
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={[style, { height }]}
      dropdownIconColor="#111"
    >
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
  const { width } = useWindowDimensions();
  const isSmall = width <= 640;

  const [semester, setSemester] = useState(initialSemester);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [level, setLevel] = useState(initialLevel);

  // sync avec les props (quand tu navigues /programs?q=...)
  useEffect(() => setSemester(initialSemester), [initialSemester]);
  useEffect(() => setLevel(initialLevel), [initialLevel]);
  useEffect(() => setKeyword(initialKeyword), [initialKeyword]);

  // 🔸 options de semestre (guides 2026)
  const semesterOptions = useMemo(
    () => [
      { label: 'Any intake (2025–2026)', value: 'Any' },
      { label: 'Spring 2026 • 1st Round', value: '2026S1' },
      { label: 'Spring 2026 • 2nd Round', value: '2026S2' },
      { label: 'Fall 2026', value: '2026F1' },
    ],
    []
  );

  const levelOptions = useMemo(
    () => [
      { label: 'All levels', value: 'All' },
      { label: 'Bachelor (Undergraduate)', value: 'Bachelor' },
      { label: 'Master (Graduate)', value: 'Master' },
      { label: 'PhD', value: 'PhD' },
      { label: 'Language Program', value: 'Language' },
    ],
    []
  );

  const submit = () => {
    const payload = {
      semester,
      level,
      keyword: keyword.trim(),
    };
    onSearch?.(payload);
  };

  const reset = () => {
    setSemester('Any');
    setLevel('All');
    setKeyword('');
    onReset?.();
  };

  const Desktop = () => (
    <View style={styles.rowContainer} onStartShouldSetResponder={() => true}>
      <Select
        testID="semester-select"
        value={semester}
        onChange={setSemester}
        options={semesterOptions}
        style={[styles.field, styles.select]}
      />

      <View style={styles.inputWrap}>
        <TextInput
          placeholder="Search 2026 programs (AI, Business, Nursing, Seoul...)"
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={submit}
        />
      </View>

      <Select
        testID="level-select"
        value={level}
        onChange={setLevel}
        options={levelOptions}
        style={[styles.field, styles.select]}
      />

      <Pressable onPress={submit} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Find programs</Text>
      </Pressable>

      {showReset && (
        <Pressable
          onPress={reset}
          style={[styles.button, styles.ghostBtn]}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, styles.ghostText]}>Reset</Text>
        </Pressable>
      )}
    </View>
  );

  const Mobile = () => (
    <View style={styles.colContainer} onStartShouldSetResponder={() => true}>
      <View style={[styles.inputWrap, styles.mobileFull]}>
        <TextInput
          placeholder="Search 2026 programs (AI, Business, Nursing...)"
          value={keyword}
          onChangeText={setKeyword}
          style={[styles.input, styles.inputMobile]}
          returnKeyType="search"
          onSubmitEditing={submit}
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
        />
        {Platform.OS !== 'ios' && !!keyword && (
          <Pressable
            onPress={() => setKeyword('')}
            style={styles.clearBtn}
            accessibilityLabel="Clear keyword"
          >
            <Text style={styles.clearTxt}>×</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.rowGap}>
        <View style={styles.mobileHalf}>
          <Select
            dense
            testID="level-select"
            value={level}
            onChange={setLevel}
            options={levelOptions}
            style={[styles.field, styles.select, styles.selectMobile]}
          />
        </View>
        <View style={styles.mobileHalf}>
          <Select
            dense
            testID="semester-select"
            value={semester}
            onChange={setSemester}
            options={semesterOptions}
            style={[styles.field, styles.select, styles.selectMobile]}
          />
        </View>
      </View>

      <View style={styles.colGap}>
        <Pressable
          onPress={submit}
          style={[styles.button, styles.buttonFull]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Find programs</Text>
        </Pressable>
        {showReset && (
          <Pressable
            onPress={reset}
            style={[styles.button, styles.ghostBtn, styles.buttonFull]}
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, styles.ghostText]}>Reset</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.shell, isSmall && styles.shellMobile]}>
      {isSmall ? <Mobile /> : <Desktop />}
    </View>
  );
}

const BASE_RADIUS = 10;

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: BASE_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    elevation: 2,
    width: '100%',
    maxWidth: 920,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
  },
  shellMobile: {
    padding: 10,
    borderRadius: BASE_RADIUS,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  rowGap: {
    flexDirection: 'row',
    gap: 10,
  },
  colGap: {
    flexDirection: 'column',
    gap: 10,
  },
  field: {
    flex: 1,
    minWidth: 160,
  },
  inputWrap: {
    flex: 2,
    position: 'relative',
  },
  input: {
    height: 48,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: BASE_RADIUS,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  mobileFull: { width: '100%' },
  mobileHalf: { flex: 1, minWidth: 140 },
  inputMobile: {
    fontSize: 14,
    height: 44,
    paddingLeft: 12,
    paddingRight: 34,
  },
  selectMobile: {
    minWidth: undefined,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  clearTxt: {
    fontSize: 20,
    lineHeight: 24,
    color: '#64748b',
  },
  button: {
    backgroundColor: '#0b3b79',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BASE_RADIUS,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  buttonFull: {
    width: '100%',
    minWidth: undefined,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  ghostBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  ghostText: { color: '#0b3b79' },
  select: {},
});
