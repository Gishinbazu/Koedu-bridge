import { ScrollView, StyleSheet, Text } from 'react-native';

export default function MastersInfo() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📘 Apply to Master's Studies in Korea</Text>

      <Text style={styles.sectionTitle}>1. Understand the Requirements</Text>
      <Text style={styles.paragraph}>
        Most Korean universities require a completed bachelor's degree, a GPA above 2.5 or 3.0, and sometimes a TOPIK or English proficiency test.
      </Text>

      <Text style={styles.sectionTitle}>2. Choose Your Program</Text>
      <Text style={styles.paragraph}>
        Browse through KOEDU Bridge's list of partner universities and select a program that matches your academic goals.
      </Text>

      <Text style={styles.sectionTitle}>3. Prepare the Documents</Text>
      <Text style={styles.paragraph}>
        Typical documents include:
        {'\n'}- Passport copy
        {'\n'}- Academic transcripts
        {'\n'}- Degree certificate
        {'\n'}- Study plan
        {'\n'}- Recommendation letters
        {'\n'}- Proof of finances
      </Text>

      <Text style={styles.sectionTitle}>4. Submit Online</Text>
      <Text style={styles.paragraph}>
        You can complete your application directly through KOEDU Bridge by uploading all required documents and submitting your form online.
      </Text>

      <Text style={styles.sectionTitle}>5. Wait for Results</Text>
      <Text style={styles.paragraph}>
        The university will review your application. Some programs may request an interview. Results are usually announced 4–6 weeks after submission.
      </Text>

      <Text style={styles.sectionTitle}>6. Visa and Arrival</Text>
      <Text style={styles.paragraph}>
        Once accepted, KOEDU Bridge helps guide you through the visa process (D-2 visa), arrival prep, and campus orientation.
      </Text>

      <Text style={styles.footer}>
        Questions? Visit our FAQ or contact support via koedu.bridge.help@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  footer: {
    marginTop: 30,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#666',
  },
});
