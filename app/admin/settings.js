import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../services/firebase';

export default function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
        setCurrentUser({ id: snap.id, uid: user.uid, ...snap.data() });
      }
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleRoleChange = async (userId, current) => {
    const nextRole = current === 'user' ? 'admin' : 'user';
    Alert.alert(
      'Modifier le rôle',
      `Changer le rôle en "${nextRole}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', userId), { role: nextRole });
              setUsers(users.map(u => u.id === userId ? { ...u, role: nextRole } : u));
            } catch (err) {
              console.error('Erreur mise à jour rôle', err);
            }
          }
        }
      ]
    );
  };

  const handleDelete = (userId) => {
    const isSelf = userId === currentUser?.id;
    Alert.alert(
      isSelf ? 'Supprimer mon compte' : 'Supprimer un utilisateur',
      isSelf
        ? 'Es-tu sûr(e) de vouloir supprimer ton propre compte ?'
        : 'Confirmer la suppression de cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId));
              setUsers(users.filter(u => u.id !== userId));
              if (isSelf) {
                auth.currentUser.delete();
                router.replace('/login');
              }
            } catch (err) {
              console.error('Erreur suppression', err);
            }
          }
        }
      ]
    );
  };

  const renderUsersByRole = (roleLabel, emoji) => {
    if (roleLabel === 'superadmin' && currentUser?.role !== 'superadmin') return null;

    const filtered = users.filter((u) => u.role?.toLowerCase() === roleLabel);
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{emoji} {roleLabel.toUpperCase()}s</Text>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>Aucun {roleLabel}</Text>
        ) : (
          filtered.map((user) => {
            const isSelf = user.id === currentUser?.id;
            const isDeletable =
              (currentUser?.role === 'superadmin' && user.role !== 'superadmin') ||
              (currentUser?.role === 'admin' && user.role === 'user') ||
              isSelf;
            const isModifiable =
              (currentUser?.role === 'superadmin' && user.role !== 'superadmin') ||
              (currentUser?.role === 'admin' && user.role === 'user');

            return (
              <View key={user.id} style={styles.card}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <Text style={styles.role}>Rôle : {user.role}</Text>
                  </View>
                  <View style={styles.actions}>
                    {isModifiable && (
                      <TouchableOpacity onPress={() => handleRoleChange(user.id, user.role)}>
                        <Icon name="account-convert" size={22} color="#0066cc" />
                      </TouchableOpacity>
                    )}
                    {isDeletable && (
                      <TouchableOpacity onPress={() => handleDelete(user.id)} style={{ marginLeft: 16 }}>
                        <Icon name="delete-outline" size={22} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres Administrateur</Text>

      {currentUser?.role === 'superadmin' && (
        <TouchableOpacity
          style={styles.platformBtn}
          onPress={() => router.push('/admin/platform-settings')}
        >
          <Icon name="cog-outline" size={20} color="white" />
          <Text style={styles.platformBtnText}>Modifier les paramètres de la plateforme</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.platformBtn, { backgroundColor: '#4caf50' }]}
        onPress={() => router.push('/admin/edit-profile')}
      >
        <Icon name="account-edit" size={20} color="white" />
        <Text style={styles.platformBtnText}>Modifier mes infos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.platformBtn, { backgroundColor: '#e53935' }]}
        onPress={() => handleDelete(currentUser?.id)}
      >
        <Icon name="account-remove" size={20} color="white" />
        <Text style={styles.platformBtnText}>Supprimer mon compte</Text>
      </TouchableOpacity>

      {renderUsersByRole('superadmin', '👑')}
      {renderUsersByRole('admin', '🛠️')}
      {renderUsersByRole('user', '👤')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  empty: {
    fontStyle: 'italic',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformBtn: {
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  platformBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});
