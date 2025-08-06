// app/info/language-requirements.js
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TopNavbar from '../../components/TopNavbar';

export default function LanguageRequirementsPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopNavbar />
      <Text style={styles.title}>📘 English Language Requirements</Text>

      <Text style={styles.paragraph}>
        All programs taught in English require proof of English proficiency. Below are the commonly accepted tests and scores.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Accepted English Tests</Text>
        <Text style={styles.paragraph}>
          • IELTS Academic: 6.0 or higher{'\n'}
          • TOEFL iBT: 79 or higher{'\n'}
          • TOEIC: 700 or higher (may not be accepted by all universities){'\n'}
          • Cambridge English: B2 or above
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 Waivers</Text>
        <Text style={styles.paragraph}>
          You may be exempted from submitting a test score if:
          {'\n'}• You are from a native English-speaking country
          {'\n'}• You completed previous education in English (proof required)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕒 Validity of Scores</Text>
        <Text style={styles.paragraph}>
          Most universities accept test scores that are less than 2 years old at the time of application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Korean Language</Text>
        <Text style={styles.paragraph}>
          For programs taught in Korean, a TOPIK certificate (Test of Proficiency in Korean) is usually required, often level 3 or 4 minimum.
        </Text>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.note}>
          🛈 Tip: Always check with the university’s official website for the most accurate and updated language requirements.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  section: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 4,
  },
  noteBox: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  note: {
    color: '#665c00',
    fontStyle: 'italic',
    fontSize: 14,
  },
});
