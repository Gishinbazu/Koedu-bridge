import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../services/firebase';

export default function SuperadminList() {
  const [superadmins, setSuperadmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuperadmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const data = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.role === 'superadmin') {
            data.push({
              id: doc.id,
              email: userData.email,
              createdAt: userData.createdAt,
            });
          }
        });

        setSuperadmins(data);
      } catch (error) {
        console.error('Erreur lors du chargement des superadmins :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperadmins();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Chargement des superadmins...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.date}>
        Créé le : {item.createdAt?.toDate().toLocaleString() ?? 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Liste des Superadmins</Text>
      <FlatList
        data={superadmins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
