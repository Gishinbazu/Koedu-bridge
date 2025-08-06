import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { auth } from '../../services/firebase';

const { width, height } = Dimensions.get('window');

const menuItems = [
  { label: '🏠 Dashboard', path: '/manager/ManagerDashboard' },
  { label: '📊 Statistics', path: '/manager/statistics' },
  { label: '👤 Gestion des utilisateurs', path: '/manager/manage-users' },
  { label: '📅 Calendar', path: '/manager/calendar' },
  { label: '💬 Team Chat', path: '/manager/chat' },
  { label: '👥 Team', path: '/manager/team' },
  { label: '⚙️ Paramètres', path: '/manager/edit-profile' },
];

export default function RightBarMenu() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const toggleMenu = () => {
    const toValue = visible ? 300 : 0;
    const toOpacity = visible ? 0 : 1;
    const toScale = visible ? 0.95 : 1;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: toOpacity,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: toScale,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setVisible(!visible);
    });
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Souhaitez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await auth.signOut();
          closeMenu();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <>
      {/* 🔘 Toggle button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.toggleButton}>
        <Text style={styles.toggleText}>{visible ? '❌' : '☰'}</Text>
      </TouchableOpacity>

      {/* 🔲 Overlay noir transparent */}
      {visible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
        </TouchableWithoutFeedback>
      )}

      {/* 📋 Sidebar animé */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
            opacity: overlayOpacity,
          },
        ]}
      >
        <Text style={styles.logo}>KOEDU</Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              closeMenu();
              router.push(item.path);
            }}
          >
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.menuItem, styles.logout]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, { color: '#dc2626' }]}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#1e3a8a',
    borderRadius: 30,
    padding: 10,
    zIndex: 1000,
  },
  toggleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 80,
    right: 0,
    backgroundColor: '#f9fafb',
    width: 260,
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  logout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});
