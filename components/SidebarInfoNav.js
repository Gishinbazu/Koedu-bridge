// ✅ components/SidebarInfoNav.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SidebarInfoNav({ onClose }) {
  const router = useRouter();
  const [translateX] = useState(new Animated.Value(SCREEN_WIDTH));

  const links = [
    { label: '📅 Key dates', route: '/info/key-dates' },
    { label: '📜 Entry requirements', route: '/info/entry-requirements' },
    { label: '📝 How to apply', route: '/info/how-to-apply' },
    { label: '❌ Unqualified?', route: '/info/unqualified' },
    { label: '💰 Tuition fees', route: '/info/tuition-fees' },
    { label: '🗣️ Language requirements', route: '/info/language-requirements' },
    { label: '📨 After applying', route: '/info/after-apply' },
  ];

  Animated.timing(translateX, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>📚 Information</Text>

        {links.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              router.push(item.route);
              onClose();
            }}
          >
            <Text style={styles.sidebarLink}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.75,
    height: '100%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    zIndex: 2000,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sidebarLink: {
    fontSize: 16,
    color: '#f0f0f0',
  },
});