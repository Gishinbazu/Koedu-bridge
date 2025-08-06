import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function KoeduFormSection({ title, fields, formData, setFormData }) {
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChangeText={(value) => handleChange(field.key, value)}
            keyboardType={field.keyboard || 'default'}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
});
