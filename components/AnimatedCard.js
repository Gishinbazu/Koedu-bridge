// components/AnimatedCard.js
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AnimatedCard({ label, desc, bg, path }) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(path)}>
      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={[styles.card, { backgroundColor: bg }]}
      >
        <Text style={styles.cardTitle}>{label}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </MotiView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 180,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'center',
    margin: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 14,
    color: '#eee',
    marginTop: 8,
  },
});
