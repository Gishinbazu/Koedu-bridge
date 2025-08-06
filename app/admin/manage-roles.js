import { useRouter } from 'expo-router';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../services/firebase';

export default function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
      } catch (err) {
        console.error('Erreur chargement utilisateurs:', err);
      }
    };

    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const role = snap.data().role;
        setCurrentRole(role);

        if (role !== 'superadmin') {
          Alert.alert('Accès refusé', 'Seul un superadmin peut accéder à cette page.', [
            { text: 'OK', onPress: () => router.replace('/admin/dashboard') }
          ]);
        }
      }
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'user' ? 'admin' : 'user';

    Alert.alert(
      'Changer le rôle',
      `Confirmer changement de rôle vers "${nextRole}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', userId), { role: nextRole });
              setUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, role: nextRole } : u)
              );
            } catch (err) {
              console.error('Erreur changement de rôle', err);
            }
          }
        }
      ]
    );
  };

  const handleDelete = async (userId, role) => {
    if (role === 'superadmin') return;

    Alert.alert(
      'Supprimer',
      'Confirmer la suppression de cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId));
              setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (err) {
              console.error('Erreur suppression utilisateur', err);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestion des rôles</Text>

      {users.map((user) => (
        <View key={user.id} style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.role}>Rôle actuel : {user.role}</Text>
          </View>

          <View style={styles.actions}>
            {user.role !== 'superadmin' && (
              <TouchableOpacity onPress={() => handleRoleChange(user.id, user.role)}>
                <Icon name="account-convert" size={22} color="#0066cc" />
              </TouchableOpacity>
            )}
            {user.role !== 'superadmin' && (
              <TouchableOpacity onPress={() => handleDelete(user.id, user.role)} style={{ marginLeft: 16 }}>
                <Icon name="delete-outline" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#eee',
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  role: {
    fontSize: 14,
    color: '#777',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
