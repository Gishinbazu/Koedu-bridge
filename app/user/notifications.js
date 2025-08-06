import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/fr'; // Pour afficher "il y a 5 min" en français
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../services//firebase';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    } catch (error) {
      console.error('Erreur chargement notifications :', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (item) => {
    try {
      const ref = doc(db, 'notifications', item.id);
      await updateDoc(ref, { read: true });
      fetchNotifications(); // refresh
    } catch (e) {
      console.error('Erreur mise à jour lecture :', e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.read ? styles.read : styles.unread]}
      onPress={() => markAsRead(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>
        {item.createdAt && moment(item.createdAt.toDate()).fromNow()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Mes notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucune notification pour le moment.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  unread: {
    backgroundColor: '#eef5ff',
  },
  read: {
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  body: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
