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

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'calendarEvents', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error('Erreur :', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const renderBadge = (type) => {
    const colors = {
      'vacances': '#10b981',
      'anniversaire': '#facc15',
      'fête': '#f472b6',
      'cours': '#60a5fa',
      'autre': '#a78bfa',
    };

    const emojis = {
      'vacances': '🌴',
      'anniversaire': '🎂',
      'fête': '🎉',
      'cours': '🎓',
      'autre': '📌',
    };

    const color = colors[type?.toLowerCase()] || '#94a3b8';
    const emoji = emojis[type?.toLowerCase()] || '📌';

    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{emoji} {type || 'Autre'}</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1d4ed8" style={{ marginTop: 100 }} />;
  }

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.errorText}>Événement introuvable.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Image Firebase upload */}
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>📅 {new Date(event.date).toLocaleDateString()}</Text>

        {/* ✅ Badge */}
        {event.type && renderBadge(event.type)}

        {/* ✅ Description */}
        {event.description && (
          <Text style={styles.description}>{event.description}</Text>
        )}

        {/* ✅ Lien externe */}
        {event.link && (
          <Text style={styles.link} onPress={() => Linking.openURL(event.link)}>
            🔗 En savoir plus
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour à la liste</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  date: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#334155',
    marginTop: 6,
  },
  link: {
    marginTop: 16,
    color: '#2563eb',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#1e40af',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    marginBottom: 10,
  },
});
