import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { db } from '../services/firebase'; // ✅ chemin vers ta config Firestore

export default function StatsBar() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, 'koedu_stats', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStats(docSnap.data());
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!stats) return null;

  const items = [
    { label: 'Partner Universities', value: stats.partner_universities },
    { label: 'Applications Submitted', value: stats.applications_submitted },
    { label: 'Accepted Students', value: stats.accepted_students },
    { label: 'Countries Represented', value: stats.countries_represented },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.value}>{item.value.toLocaleString()}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 40,
    backgroundColor: '#f0f4f7',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    minWidth: 160,
    marginBottom: 20,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#003366',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },
  loading: {
    padding: 40,
    alignItems: 'center',
  },
});
