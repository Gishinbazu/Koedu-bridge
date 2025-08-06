import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { db } from '../../services/firebase';

const roleIcons = {
  user: '👤 Utilisateur',
  admin: '🛠️ Admin',
  manager: '📋 Manager',
  superadmin: '👑 Superadmin',
};

const roleColors = {
  user: '#6c757d',
  admin: '#0d6efd',
  manager: '#20c997',
  superadmin: '#fd7e14',
};

const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsLandscape(window.width > window.height);
    };
    const subscription = Dimensions.addEventListener('change', onChange);

    return () => subscription?.remove();
  }, []);

  return isLandscape;
};

export default function ManageUsersScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [counts, setCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', address: '', role: 'user' });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
   const router = useRouter();

  const isLandscape = useOrientation();
  const isWideLayout = Dimensions.get('window').width >= 768 || isLandscape;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
      countRoles(list);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
      setLoading(false);
    }
  };

  const countRoles = (list) => {
    const roles = { user: 0, admin: 0, manager: 0, superadmin: 0 };
    list.forEach(u => {
      if (roles[u.role] !== undefined) roles[u.role]++;
    });
    setCounts(roles);
  };

  const applyFilters = () => {
    let list = [...users];
    if (filterRole !== 'all') {
      list = list.filter(u => u.role === filterRole);
    }
    if (searchText.trim() !== '') {
      const search = searchText.toLowerCase();
      list = list.filter(u => (u.name || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search));
    }
    setFilteredUsers(list);
  };

  const handleChangeRole = (userId, currentRole) => {
    if (currentRole === 'superadmin') {
      Alert.alert('🔒 Refusé', 'Impossible de modifier un superadmin.');
      return;
    }
    setSelectedUser({ id: userId });
    setShowRoleModal(true);
  };

  const handleDeleteUser = (userId, role) => {
    if (role === 'superadmin') {
      Alert.alert('🔒 Interdit', 'Impossible de supprimer un superadmin.');
      return;
    }
    Alert.alert('Suppression', 'Voulez-vous vraiment supprimer cet utilisateur ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'users', userId));
            Alert.alert('🗑️ Supprimé');
            fetchUsers();
          } catch (err) {
            Alert.alert('❌ Erreur', err.message);
          }
        },
      },
    ]);
  };

  const handleExportCSV = async () => {
    try {
      const csv = Papa.unparse(filteredUsers.map(u => ({
        Nom: u.name,
        Email: u.email,
        Téléphone: u.phone,
        Adresse: u.address,
        Rôle: u.role,
      })));
      const fileUri = FileSystem.documentDirectory + 'users.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('❌ Erreur export', error.message);
    }
  };

  const handleCreateUser = async () => {
    const { name, email, role } = newUser;
    if (!name || !email || !['user', 'admin', 'manager'].includes(role)) {
      Alert.alert('⚠️ Champs invalides', 'Vérifie le nom, l’email et le rôle.');
      return;
    }
    try {
      await addDoc(collection(db, 'users'), { ...newUser, createdAt: new Date() });
      Alert.alert('✅ Utilisateur ajouté');
      setNewUser({ name: '', email: '', phone: '', address: '', role: 'user' });
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      Alert.alert('❌ Erreur', error.message);
    }
  };

  const confirmRoleChange = async () => {
    if (!['user', 'admin', 'manager'].includes(newRole)) {
      Alert.alert('⚠️ Invalide', 'Utilisez : user, admin ou manager');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), { role: newRole });
      Alert.alert('✅ Rôle mis à jour', `Nouveau rôle : ${newRole}`);
      setShowRoleModal(false);
      setNewRole('');
      setSelectedUser(null);
      fetchUsers();
    } catch (e) {
      Alert.alert('❌ Erreur', e.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { flexDirection: isWideLayout ? 'row' : 'column' }]}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name || '—'}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.info}>📞 {item.phone || 'Non fourni'}</Text>
        <Text style={styles.info}>🏠 {item.address || 'Adresse inconnue'}</Text>
        <Text style={[styles.role, { color: roleColors[item.role] || '#333' }]}>
          {roleIcons[item.role] || item.role}
        </Text>
      </View>
      <View style={[styles.cardActions, { flexDirection: isWideLayout ? 'column' : 'row' }]}>
        <TouchableOpacity style={styles.modifyBtn} onPress={() => handleChangeRole(item.id, item.role)}>
          <Text style={styles.btnText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item.id, item.role)}>
          <Text style={styles.btnText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
       <Animated.View entering={FadeInLeft.duration(300)}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <AntDesign name="arrowleft" size={22} color="#007AFF" />
          <Text style={{ color: '#007AFF', fontSize: 16, marginLeft: 5 }}>Retour</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.title}>👥 Gestion des utilisateurs</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Rechercher par nom ou email..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterRow}>
        {['all', 'user', 'admin', 'manager'].map((role) => (
          <TouchableOpacity
            key={role}
            onPress={() => setFilterRole(role)}
            style={[styles.filterBtn, filterRole === role && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filterRole === role && styles.filterTextActive]}>
              {role === 'all' ? 'Tous' : role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.countText}>
        👤 {counts.user || 0}   🛠️ {counts.admin || 0}   📋 {counts.manager || 0}   👑 {counts.superadmin || 0}
      </Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
          <Text style={styles.exportText}>📤 Exporter CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addText}>{showForm ? '✖️ Fermer' : '➕ Ajouter'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          {['name', 'email', 'phone', 'address', 'role'].map((field) => (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newUser[field]}
              onChangeText={(text) => setNewUser({ ...newUser, [field]: text })}
            />
          ))}
          <TouchableOpacity style={styles.saveBtn} onPress={handleCreateUser}>
            <Text style={styles.saveBtnText}>💾 Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isWideLayout ? '50%' : '85%' }]}>
            <Text style={styles.modalTitle}>Changer le rôle</Text>
            <TextInput
              placeholder="user, admin, manager"
              value={newRole}
              onChangeText={setNewRole}
              style={styles.input}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={confirmRoleChange}>
              <Text style={styles.saveBtnText}>✅ Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowRoleModal(false)}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isTablet ? 40 : 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
    textAlign: isTablet ? 'center' : 'left',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#dee2e6',
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: '#0d6efd',
  },
  filterText: {
    color: '#495057',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  countText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#343a40',
    textAlign: isTablet ? 'center' : 'left',
  },
  actionButtons: {
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isTablet ? 'center' : 'stretch',
    gap: 10,
    marginBottom: 16,
  },
  exportBtn: {
    backgroundColor: '#20c997',
    padding: 12,
    borderRadius: 8,
    flex: isTablet ? 0.48 : 1,
  },
  exportText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#0d6efd',
    padding: 12,
    borderRadius: 8,
    flex: isTablet ? 0.48 : 1,
  },
  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#e9ecef',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#adb5bd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveBtn: {
    backgroundColor: '#198754',
    padding: 14,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: isTablet ? 20 : 10,
  },
  cardContent: {
    flex: 3,
  },
  cardActions: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: isTablet ? 'column' : 'row',
    gap: 10,
    marginTop: isTablet ? 0 : 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  email: {
    color: '#6c757d',
    marginBottom: 5,
  },
  info: {
    color: '#495057',
    fontSize: 13,
  },
  role: {
    fontWeight: '600',
    marginTop: 5,
  },
  modifyBtn: {
    backgroundColor: '#0d6efd',
    padding: 10,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: isTablet ? '50%' : '85%',
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#212529',
  },
  cancelText: {
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 10,
  },
});
