// /app/calendar/[id].js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../services/firebase';

export default function EventDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'calendarEvents', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setEvent({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        console.error('Erreur récupération :', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>❌ Événement introuvable</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Affichage image si présente */}
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>📅 {new Date(event.date).toLocaleDateString()}</Text>
      {event.type && <Text style={styles.type}>🗂️ Type : {event.type}</Text>}
      {event.description && <Text style={styles.desc}>{event.description}</Text>}
      {event.link && (
        <TouchableOpacity onPress={() => Linking.openURL(event.link)}>
          <Text style={styles.link}>🔗 {event.link}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 6,
  },
  type: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#64748b',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
