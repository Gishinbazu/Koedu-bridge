// app/info/after-apply.js
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TopNavbar from '../../components/TopNavbar';

export default function AfterApplyPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopNavbar />
      <Text style={styles.title}>📤 After You Apply</Text>

      <Text style={styles.paragraph}>
        Once you have submitted your application through KOEDU Bridge, several steps follow. Here's what to expect and how to prepare.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1️⃣ Application Review</Text>
        <Text style={styles.paragraph}>
          Your application is sent to the university for evaluation. This may take several weeks depending on the program.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2️⃣ Admission Results</Text>
        <Text style={styles.paragraph}>
          You’ll be notified through KOEDU Bridge when your result is available. The status will show:
          {'\n'}• Accepted
          {'\n'}• Rejected
          {'\n'}• Waiting list
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3️⃣ Accepting Your Offer</Text>
        <Text style={styles.paragraph}>
          If accepted, you must confirm your place by a specific deadline. This may include paying a tuition deposit.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4️⃣ Visa & Documents</Text>
        <Text style={styles.paragraph}>
          Once you've accepted, the university will issue documents needed for your D-2 student visa application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5️⃣ Prepare for Arrival</Text>
        <Text style={styles.paragraph}>
          Book your flight, apply for housing, and attend any pre-departure sessions offered by the university or KOEDU Bridge.
        </Text>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tip}>
          🛈 TIP: Stay connected to your KOEDU Bridge account — all updates and next steps are communicated there.
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
  tipBox: {
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  tip: {
    color: '#004d99',
    fontStyle: 'italic',
    fontSize: 14,
  },
});
