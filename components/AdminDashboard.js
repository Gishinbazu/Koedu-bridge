import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../services/firebase';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, 'applications'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app =>
    app.name?.toLowerCase().includes(search.toLowerCase()) ||
    app.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#003366" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>📋 Tableau de bord Admin</Text>

      <TextInput
        placeholder="Rechercher par nom ou email"
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 20 }}
      />

      <FlatList
        data={filteredApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/admin/detail/${item.id}`)}
            style={{ padding: 15, backgroundColor: '#f1f9ff', marginBottom: 10, borderRadius: 10 }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: '#666' }}>{item.email}</Text>
            <Text style={{ color: '#888', fontSize: 12 }}>Statut: {item.status || 'En attente'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
