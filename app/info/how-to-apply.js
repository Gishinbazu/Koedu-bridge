import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HowToApplyPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 How to Apply</Text>

      <Text style={styles.paragraph}>
        KOEDU Bridge simplifies your application process. Here’s how to apply for a program in Korea:
      </Text>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 1: Search & Select</Text>
        <Text>Browse programs by university, level, or semester and choose the one that fits you best.</Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 2: Prepare Documents</Text>
        <Text>Collect your transcripts, certificates, passport copy, and language test scores.</Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 3: Submit Online</Text>
        <Text>Create an account, fill the form, upload documents and pay the application fee (if any).</Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 4: Track Your Application</Text>
        <Text>Log in anytime to view your application status and receive updates.</Text>
      </View>

      <View style={styles.step}>
        <Text style={styles.stepTitle}>Step 5: Wait for Results</Text>
        <Text>You’ll receive an email and notification on KOEDU Bridge when a decision is made.</Text>
      </View>

      <Text style={styles.note}>
        ✅ Make sure your documents are complete and correctly formatted to avoid delays.
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
    marginBottom: 16,
    color: '#003366',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  step: {
    marginBottom: 16,
  },
  stepTitle: {
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 4,
    color: '#003366',
  },
  note: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
});
