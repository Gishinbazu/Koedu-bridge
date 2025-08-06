import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../services/firebase';
import TopBar from './TopBar';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'calendarEvents'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(list);
    } catch (error) {
      console.error('Erreur lors du chargement des événements', error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer cet événement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'calendarEvents', id));
          fetchEvents();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>📅 {item.date} 🕒 {item.hour}</Text>
        <Text style={styles.type}>📌 {item.type}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/admin/edit-event/${item.id}`)}
          >
            <Text style={styles.editText}>✏️ Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteText}>🗑️ Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar />

      <TouchableOpacity
        onPress={() => router.push('/admin/add-event')}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>➕ Ajouter un événement</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  date: {
    color: '#475569',
    marginTop: 4,
  },
  type: {
    fontStyle: 'italic',
    color: '#3b82f6',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
