// components/ProgramSearchBar.js
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProgramSearchBar({ onSearch }) {
  const [semester, setSemester] = useState('Spring 2026');
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState('All');

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ semester, keyword, level });
    }
  };

  return (
    <View style={styles.container}>
      {/* Semester */}
      <Picker
        selectedValue={semester}
        style={styles.picker}
        onValueChange={(val) => setSemester(val)}
      >
        <Picker.Item label="Spring 2026" value="Spring 2026" />
        <Picker.Item label="Fall 2025" value="Fall 2025" />
        <Picker.Item label="Spring 2025" value="Spring 2025" />
      </Picker>

      {/* Keyword search */}
      <TextInput
        placeholder="Keywords e.g. course name, AI, Seoul..."
        value={keyword}
        onChangeText={setKeyword}
        style={styles.input}
      />

      {/* Level filter */}
      <Picker
        selectedValue={level}
        style={styles.picker}
        onValueChange={(val) => setLevel(val)}
      >
        <Picker.Item label="All levels" value="All" />
        <Picker.Item label="Bachelor" value="Bachelor" />
        <Picker.Item label="Master" value="Master" />
      </Picker>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Find courses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    width: '100%',
    maxWidth: 800,
  },
  picker: {
    flex: 1,
    minWidth: 140,
  },
  input: {
    flex: 2,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    minWidth: 200,
  },
  button: {
    backgroundColor: '#003366',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
