// components/ProgramSearchBar.js
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProgramSearchBar({ onSearch }) {
  const [semester, setSemester] = useState('Spring 2026');
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch({ semester, keyword });
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={semester}
        style={styles.picker}
        onValueChange={(itemValue) => setSemester(itemValue)}
      >
        <Picker.Item label="Spring 2026" value="Spring 2026" />
        <Picker.Item label="Fall 2025" value="Fall 2025" />
        <Picker.Item label="Spring 2025" value="Spring 2025" />
      </Picker>

      <TextInput
        placeholder="Keywords e.g. subject/course name/location"
        value={keyword}
        onChangeText={setKeyword}
        style={styles.input}
      />

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
    shadowOpacity: 0.2,
    elevation: 3,
    maxWidth: 800,
    width: '100%',
  },
  picker: {
    flex: 1,
    minWidth: 150,
  },
  input: {
    flex: 3,
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
