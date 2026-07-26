import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // swipe-to-close handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dx > 10; // swipe right
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          closeSidebar();
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const links = [
    { label: '📅 Key dates', route: '/info/key-dates' },
    { label: '📜 Entry requirements', route: '/info/entry-requirements' },
    { label: '📝 How to apply', route: '/info/how-to-apply' },
    { label: '❌ Unqualified?', route: '/info/unqualified' },
    { label: '💰 Tuition fees', route: '/info/tuition-fees' },
    { label: '🗣️ Language requirements', route: '/info/language-requirements' },
    { label: '📨 After applying', route: '/info/after-apply' },
  ];

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sidebar, { transform: [{ translateX }] }]}
      >
        <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>📚 Information</Text>

        {links.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              router.push(item.route);
              closeSidebar();
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.72,
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
