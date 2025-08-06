import { ScrollView, StyleSheet, Text } from 'react-native';

export default function BachelorsInfo() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📗 Apply to Bachelor's Studies in Korea</Text>

      <Text style={styles.sectionTitle}>1. Who Can Apply?</Text>
      <Text style={styles.paragraph}>
        Students who have completed high school (or will soon graduate) can apply for undergraduate programs in Korea. A minimum GPA of 2.5 or equivalent is generally required.
      </Text>

      <Text style={styles.sectionTitle}>2. Select a University and Major</Text>
      <Text style={styles.paragraph}>
        Use KOEDU Bridge to explore programs available across Korean universities. Choose based on your interest, language of instruction, and location.
      </Text>

      <Text style={styles.sectionTitle}>3. Prepare the Required Documents</Text>
      <Text style={styles.paragraph}>
        Common documents include:
        {'\n'}- High school diploma (or expected graduation)
        {'\n'}- Transcripts
        {'\n'}- Passport copy
        {'\n'}- Personal statement
        {'\n'}- Letter of recommendation
        {'\n'}- Language certificate (TOPIK or English test)
      </Text>

      <Text style={styles.sectionTitle}>4. Application Process</Text>
      <Text style={styles.paragraph}>
        Submit your application through KOEDU Bridge. You can track your application status online and get notified when results are released.
      </Text>

      <Text style={styles.sectionTitle}>5. After Admission</Text>
      <Text style={styles.paragraph}>
        Once admitted, you will receive a Certificate of Admission needed for your D-2 student visa. KOEDU Bridge also offers guidance for accommodation, orientation, and settlement.
      </Text>

      <Text style={styles.footer}>
        Still have questions? Visit our FAQ or email support: koedu.bridge.help@gmail.com
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
