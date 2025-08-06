import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../services/firebase';

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'calendarEvents'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(list);
      } catch (error) {
        console.error('Erreur chargement events :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/app/event/${item.id}`)}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>📅 {item.date}</Text>
        <Text style={styles.type}>🔖 {item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📌 Événements à venir</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
        <Text style={styles.buttonText}>Voir tous les événements à venir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  date: {
    color: '#475569',
    marginBottom: 2,
  },
  type: {
    color: '#64748b',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
