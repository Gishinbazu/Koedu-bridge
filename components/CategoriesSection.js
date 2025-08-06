import { StyleSheet, Text, View } from 'react-native';

export default function CategoriesSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Categories</Text>
      <View style={styles.cardsRow}>
        {['Science', 'Genetics', 'Medicine', 'Astronomy'].map(c => (
          <View key={c} style={styles.card}>
            <Text style={styles.cardTitle}>{c}</Text>
            <Text style={styles.cardDesc}>Description…</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', paddingHorizontal: 20, justifyContent: 'center' },
  header: { fontSize: 24, color: '#003366', marginBottom: 10, textAlign: 'center' },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
  card: {
    width: '45%', backgroundColor: '#003366', padding: 16,
    borderRadius: 6, marginVertical: 8,
  },
  cardTitle: { color: '#fff', fontSize: 18, marginBottom: 6 },
  cardDesc: { color: '#ddd', fontSize: 14 },
});
