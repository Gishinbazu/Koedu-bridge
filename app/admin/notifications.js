import { useRouter } from 'expo-router';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../services/firebase';
import TopBar from '../admin/TopBar';

export default function AdminNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [filterDate, setFilterDate] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const now = new Date();
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Marquer toutes comme lues
      const unread = snapshot.docs.filter((doc) => !doc.data().read);
      if (unread.length > 0) {
        const batch = writeBatch(db);
        unread.forEach((docSnap) => {
          batch.update(doc(db, 'notifications', docSnap.id), { read: true });
        });
        await batch.commit();
      }

      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, []);

  const deleteAllNotifications = () => {
    Alert.alert('Confirmer', 'Supprimer toutes les notifications ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const batch = writeBatch(db);
          notifications.forEach((n) => {
            batch.delete(doc(db, 'notifications', n.id));
          });
          await batch.commit();
        },
      },
    ]);
  };

  const deleteSingleNotification = (id) => {
    Alert.alert('Confirmer', 'Supprimer cette notification ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'notifications', id));
        },
      },
    ]);
  };

  const filterByDate = (date) => {
    setFilterDate(date);
  };

  const filterByType = (type) => {
    setFilterType(type);
  };

  const applyFilters = (notifList) => {
    const now = new Date();
    return notifList.filter((notif) => {
      const createdAt = notif.createdAt?.toDate?.();
      let passDate = true;
      if (filterDate === 'today') {
        passDate = createdAt?.toDateString() === now.toDateString();
      } else if (filterDate === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        passDate = createdAt >= weekAgo;
      }

      const passType = filterType === 'all' || notif.type === filterType;

      return passDate && passType;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notification, !item.read && styles.unread]}
      onPress={() => {
        if (item.applicationId) {
          router.push(`/admin/${item.applicationId}`);
        }
      }}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title || 'Nouvelle notification'}</Text>
          <Text style={styles.body}>{item.message}</Text>
          <Text style={styles.time}>
            {item.createdAt?.toDate().toLocaleString() || 'Date inconnue'}
          </Text>
        </View>

        <TouchableOpacity onPress={() => deleteSingleNotification(item.id)}>
          <Text style={styles.trash}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredNotifications = applyFilters(notifications);

  return (
    <View style={styles.container}>
      <TopBar title="Notifications Admin" />

      <View style={styles.filterBar}>
        <View style={styles.filters}>
          <TouchableOpacity onPress={() => filterByDate('all')}>
            <Text style={filterDate === 'all' ? styles.activeFilter : styles.filter}>🗓️ Tout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterByDate('today')}>
            <Text style={filterDate === 'today' ? styles.activeFilter : styles.filter}>📅 Aujourd'hui</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterByDate('week')}>
            <Text style={filterDate === 'week' ? styles.activeFilter : styles.filter}>📆 7j</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <TouchableOpacity onPress={() => filterByType('all')}>
            <Text style={filterType === 'all' ? styles.activeFilter : styles.filter}>🔖 Tout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterByType('submission')}>
            <Text style={filterType === 'submission' ? styles.activeFilter : styles.filter}>📩 Soumission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => filterByType('status')}>
            <Text style={filterType === 'status' ? styles.activeFilter : styles.filter}>📋 Statut</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={deleteAllNotifications} style={styles.clearBtn}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🧼 Tout supprimer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucune notification.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  list: {
    padding: 16,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#f39c12',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#003366',
  },
  body: {
    color: '#333',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  trash: {
    fontSize: 20,
    color: '#888',
    padding: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontStyle: 'italic',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  filter: {
    color: '#888',
    fontSize: 14,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: '#003366',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  clearBtn: {
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
