import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import SidebarInfoNav from './SidebarInfoNav';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TopNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Apply', route: '/auth/signup' },
    { label: 'Login', route: '/auth/login' },
  ];

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push('/')}> 
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/koedu.png')}
            style={styles.logo}
          />
          <Text style={styles.brand}>KOEDU Bridge</Text>
        </View>
      </TouchableOpacity>

      {/* Desktop nav */}
      {Platform.OS === 'web' && (
        <View style={styles.linksContainer}>
          {navItems.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => router.push(item.route)}>
              <Text style={styles.link}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Text style={styles.link}>Menu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mobile hamburger */}
      {Platform.OS !== 'web' && (
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Ionicons name={menuOpen ? 'close' : 'menu'} size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Mobile menu list */}
      {menuOpen && (
        <View style={styles.mobileMenu}>
          {navItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setMenuOpen(false);
                router.push(item.route);
              }}
            >
              <Text style={styles.mobileLink}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              setSidebarVisible(true);
            }}
          >
            <Text style={styles.mobileLink}>Menu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sidebar overlay */}
      {sidebarVisible && <SidebarInfoNav onClose={() => setSidebarVisible(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  link: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileMenu: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 8,
    elevation: 6,
  },
  mobileLink: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 6,
  },
});
