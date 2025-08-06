import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../services/firebase';

// ✅ MenuItem défini en haut
const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={22} color="white" />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'applications'));
        const apps = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(apps);
      } catch (err) {
        console.error('Erreur chargement', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* ✅ Sidebar visible uniquement sur web */}
      {Platform.OS === 'web' && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>KOEDU Bridge</Text>
          <MenuItem icon="home" label="Home" onPress={() => router.push('/admin/home')} />
          <MenuItem icon="view-dashboard" label="Dashboard" onPress={() => router.push('/admin/dashboard')}/>
          <MenuItem icon="account-group" label="Contacts" />
          <MenuItem icon="calendar" label="Événements" onPress={() => router.push('/admin/events')} />
          <MenuItem icon="email" label="Messages" />
          <MenuItem icon="cog" label="Paramètres" onPress={() => router.push('/admin/settings')} />
        </View>
      )}

      {/* ✅ Main content */}
      <ScrollView style={styles.main}>
        <Text style={styles.title}>Candidatures Récentes</Text>
        {loading ? (
          <Text>Chargement...</Text>
        ) : (
          applications.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={styles.card}
              onPress={() => router.push(`/admin/${app.id}`)}
            >
              <Text style={styles.cardTitle}>
                {app.nom || 'Sans nom'} - {app.nationalite}
              </Text>
              <Text style={styles.cardStatus}>
                Statut : {app.status?.toUpperCase() || 'EN ATTENTE'}
              </Text>
              <Text style={styles.cardEmail}>Email : {app.email}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    height: '100%',
    backgroundColor: '#f0f2f5',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#1a237e',
    padding: 20,
    gap: 10,
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  main: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardStatus: {
    color: '#555',
    marginTop: 4,
  },
  cardEmail: {
    color: '#777',
    marginTop: 2,
  },
});
