import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../services/firebase';

export default function AdminHome() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'applications'));
      const apps = snapshot.docs.map(doc => doc.data());
      setTotalApplications(apps.length);
      setAccepted(apps.filter(a => a.status === 'accepted').length);
      setRejected(apps.filter(a => a.status === 'rejected').length);
      setPending(apps.filter(a => !a.status || a.status === 'pending').length);
    };

    const fetchNotifications = async () => {
      const snapshot = await getDocs(collection(db, 'notifications'));
      const unread = snapshot.docs.filter(doc => !doc.data().read).length;
      setNotificationCount(unread);
    };

    fetchData();
    fetchNotifications();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏛️ Tableau de bord KOEDU Bridge</Text>
        <TouchableOpacity onPress={() => router.push('/admin/notifications')} style={styles.iconWrapper}>
          <Icon name="bell-outline" size={28} color="#003366" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Statistiques globales</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalApplications}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#e0f7fa' }]}>
          <Text style={styles.statNumber}>{pending}</Text>
          <Text style={styles.statLabel}>🕒 En attente</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
          <Text style={styles.statNumber}>{accepted}</Text>
          <Text style={styles.statLabel}>✅ Acceptées</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#ffebee' }]}>
          <Text style={styles.statNumber}>{rejected}</Text>
          <Text style={styles.statLabel}>❌ Rejetées</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push('/admin/index')}>
        <Text style={styles.viewAllText}>📋 Voir toutes les candidatures</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  iconWrapper: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 99,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
    color: '#003366',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 6,
    color: '#555',
  },
  viewAllBtn: {
    backgroundColor: '#003366',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  viewAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
