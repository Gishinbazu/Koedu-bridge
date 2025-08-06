import { ScrollView, StyleSheet, Text } from 'react-native';

export default function DeadlinesInfo() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📅 Dates & Deadlines</Text>

      <Text style={styles.intro}>
        Planning ahead is key to a successful application. Here's a general calendar of important dates. Specific deadlines vary by university.
      </Text>

      <Text style={styles.sectionTitle}>📘 Spring Intake (March Entry)</Text>
      <Text style={styles.paragraph}>
        • Application Period: September – October (previous year)
        {'\n'}• Results: November – December
        {'\n'}• Visa Application: December – January
        {'\n'}• Orientation: February
        {'\n'}• Semester Starts: March 2nd (usually)
      </Text>

      <Text style={styles.sectionTitle}>📙 Fall Intake (September Entry)</Text>
      <Text style={styles.paragraph}>
        • Application Period: April – May
        {'\n'}• Results: June – July
        {'\n'}• Visa Application: July – August
        {'\n'}• Orientation: End of August
        {'\n'}• Semester Starts: Early September
      </Text>

      <Text style={styles.sectionTitle}>📌 Tips</Text>
      <Text style={styles.paragraph}>
        ✔️ Submit documents early – translations and apostilles can take time.
        {'\n'}✔️ Check language test deadlines (TOPIK, IELTS, etc.)
        {'\n'}✔️ Be mindful of scholarship deadlines (can be earlier!)
      </Text>

      <Text style={styles.footer}>
        Questions about deadlines? Reach out to us: koedu.bridge.help@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
  intro: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
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
