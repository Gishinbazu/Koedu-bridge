import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UnqualifiedPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚠️ Not Yet Qualified?</Text>

      <Text style={styles.paragraph}>
        Don’t worry — many students start here. If you currently don’t meet the requirements for the program you want to apply to, there are still options available to help you qualify in the future.
      </Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>📚 Improve your language proficiency</Text>
        <Text style={styles.text}>
          Most programs require a minimum English (e.g. IELTS, TOEFL) or Korean (TOPIK) level. Enroll in a preparatory language course and retake the test when ready.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>🎓 Upgrade academic credentials</Text>
        <Text style={styles.text}>
          If your GPA is too low or you don’t have the right degree, you can pursue additional studies or bridge programs in your country or in Korea.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>🗂️ Prepare missing documents</Text>
        <Text style={styles.text}>
          Ensure your transcripts, recommendation letters, or certificates are ready. Missing or unverified documents can delay or block your application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>📆 Apply for the next semester</Text>
        <Text style={styles.text}>
          If you missed a deadline or aren't ready now, use this time to prepare and apply in the next intake.
        </Text>
      </View>

      <Text style={styles.note}>
        🌱 Many successful applicants started with missing requirements — your preparation now can lead to success next semester!
      </Text>
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
    color: '#8B0000',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#003366',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: '#333',
  },
  note: {
    marginTop: 20,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#666',
  },
});
