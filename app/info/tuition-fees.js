// app/info/tuition-fees.js
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TopNavbar from '../../components/TopNavbar';

export default function TuitionFeesPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopNavbar />
      <Text style={styles.title}>🎓 Tuition Fees</Text>

      <Text style={styles.paragraph}>
        Tuition fees in Korean universities vary depending on the university, program, and whether the institution is public or private. Here's a general breakdown:
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Estimated Tuition Fees</Text>
        <Text style={styles.paragraph}>
          • Public universities: ₩1,600,000 – ₩4,000,000 per semester{'\n'}
          • Private universities: ₩3,000,000 – ₩6,500,000 per semester{'\n'}
          • Engineering & Medicine may cost more
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 Payment Schedule</Text>
        <Text style={styles.paragraph}>
          Most universities require payment once per semester. You will be provided with detailed instructions after receiving your admission offer.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 Additional Costs</Text>
        <Text style={styles.paragraph}>
          • Application Fee: ₩60,000 – ₩150,000 (one-time){'\n'}
          • Student Insurance: ₩50,000 – ₩150,000 per semester{'\n'}
          • Dormitory (optional): ₩600,000 – ₩1,200,000 per semester
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💳 How to Pay</Text>
        <Text style={styles.paragraph}>
          Payments can usually be made via:
          {'\n'}• Bank Transfer (International or Korean bank)
          {'\n'}• Credit/Debit Card (if supported)
          {'\n'}• Payment portal via university website
        </Text>
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.note}>
          🛈 Note: KOEDU Bridge does not collect tuition payments directly. All payments must be made through the official university channels.
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
    backgroundColor: '#e7f4ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  note: {
    color: '#003366',
    fontStyle: 'italic',
    fontSize: 14,
  },
});
