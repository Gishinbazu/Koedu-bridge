// /app/programs/entry-requirements.js
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function EntryRequirementsPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Entry requirements</Text>
      <Text style={styles.text}>
        To apply to a Korean university, you must meet certain academic and language requirements. 
        This usually includes high school or undergraduate transcripts and proof of English proficiency 
        (e.g. TOEFL, IELTS, TOPIK for Korean).
      </Text>
      {/* ... Add more structured content here ... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#003366',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
