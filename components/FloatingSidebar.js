import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebase';

export default function FloatingSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isOpen ? 300 : 0,
        useNativeDriver: false,
        friction: 6,
        tension: 60,
      }),
      Animated.timing(opacityAnim, {
        toValue: isOpen ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleNavigation = (path) => {
    toggleMenu();
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toggleMenu();
      router.replace('/auth/logout'); // ou '/login' si tu n’as pas de page logout
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la déconnexion. Réessaie.');
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMenu}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <Animated.View style={[styles.sidebar, { right: slideAnim, opacity: opacityAnim }]}>
        <SidebarLink label="Accueil" icon="home" path="/user/dashboard" onPress={handleNavigation} />
        <SidebarLink label="À propos" icon="information-circle" path="/about" onPress={handleNavigation} />
        <SidebarLink label="Services" icon="construct" path="/services" onPress={handleNavigation} />
        <SidebarLink label="Contact" icon="call" path="/contact" onPress={handleNavigation} />
        <SidebarLink label="Universités & Accueil" icon="earth-outline" path="/user/home" onPress={handleNavigation} />
        <SidebarLink label="Profil" icon="person" path="/user/profile" onPress={handleNavigation} />
        <SidebarLink label="Paramètres" icon="settings" path="/user/EditProfile" onPress={handleNavigation} />
        <SidebarLink label="Calendrier" icon="calendar" path="/calendar" onPress={handleNavigation} />

        {/* ✅ Bouton de déconnexion personnalisé */}
        <SidebarLink label="Se déconnecter" icon="log-out" path="/auth/logout" onPress={handleLogout} danger />
      </Animated.View>
    </>
  );
}

function SidebarLink({ label, icon, path, onPress, danger = false }) {
  return (
    <TouchableOpacity style={styles.link} onPress={() => onPress(path)}>
      <Ionicons name={icon} size={20} color={danger ? '#dc2626' : '#1e3a8a'} />
      <Text style={[styles.linkText, danger && { color: '#dc2626' }]}>{label}</Text>
    </TouchableOpacity>
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
  sidebar: {
    position: 'absolute',
    top: 80,
    right: 0,
    backgroundColor: '#f9fafb',
    width: 240,
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  linkText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1e3a8a',
  },
});
