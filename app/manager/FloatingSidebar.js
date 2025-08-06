import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../services/firebase';

export default function FloatingSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Erreur', 'La déconnexion a échoué.');
    }
  };

  const menuItems = [
    { label: '🏠 Dashboard', path: '/manager/ManagerDashboard' },
    { label: '👤 Gestion des utilisateurs', path: '/manager/manage-users' },
    { label: '💬 Team Chat', path: '/manager/chat' },
    { label: '📅 Calendar', path: '/manager/calendar' },
    { label: '👥 Team', path: '/manager/team' },
    { label: '📊 Statistics', path: '/manager/statistics' },
    { label: '⚙️ Paramètres', path: '/manager/edit-profile' },
  ];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>KOEDU Bridge</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => router.push(item.path)}
        >
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.menuText}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 20,
    elevation: 4,
    height: '100%',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuItem: {
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutBtn: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: '#ffecec',
    borderRadius: 8,
  },
});
