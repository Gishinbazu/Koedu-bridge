import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchSection({ onSearch }) {
  const [course, setCourse] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    onSearch?.({ course, category });
    // ou faire une recherche via API ici
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder="Course Name or ID"
        placeholderTextColor="#666"
        value={course}
        onChangeText={setCourse}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#666"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Search Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: {
    width: windowWidth * 0.9,
    alignSelf: 'center',
    marginVertical: 30,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 8,
    elevation: 3, // pour ombre dans Android
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
