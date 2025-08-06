// components/Header.js
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 70;

export default function Header({ scrollY }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const links = [
    { label: 'Home', route: '/' },
    {
      label: 'Pages',
      dropdown: [
        { label: 'About', route: '/about' },
        { label: 'FAQ', route: '/faq' },
        { label: 'Pricing', route: '/pricing' },
      ],
    },
    {
      label: 'Courses',
      dropdown: [
        { label: 'Science', route: '/science' },
        { label: 'Medicine', route: '/medicine' },
        { label: 'Astronomy', route: '/astronomy' },
      ],
    },
    { label: 'Gallery', route: '/gallery' },
    { label: 'Blog', route: '/blog' },
    { label: 'Shop', route: '/shop' },
    { label: 'Contacts', route: '/contacts' },
  ];

  const renderDropdown = (label, items) => {
    if (activeDropdown !== label) return null;
    return (
      <View style={styles.dropdown}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              router.push(item.route);
              setActiveDropdown(null);
            }}
          >
            <Text style={styles.dropdownItem}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const animatedLogoStyle = useAnimatedStyle(() => {
    const y = scrollY?.value ?? 0;
    return {
      transform: [
        {
          scale: interpolate(y, [0, 100], [1, 0.85], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return (
    <BlurView intensity={90} tint="light" style={styles.container}>
      <Animated.Text style={[styles.logo, animatedLogoStyle]}>
        KOEDU Bridge
      </Animated.Text>

      {/* Mobile navigation */}
      {isMobile ? (
        <>
          <TouchableOpacity onPress={() => setIsDrawerOpen(!isDrawerOpen)}>
            <Text style={styles.hamburger}>☰</Text>
          </TouchableOpacity>

          {isDrawerOpen && (
            <View style={styles.drawer}>
              {links.map((link) => (
                <View key={link.label}>
                  {link.dropdown ? (
                    link.dropdown.map((sub) => (
                      <TouchableOpacity
                        key={sub.label}
                        onPress={() => {
                          router.push(sub.route);
                          setIsDrawerOpen(false);
                        }}
                      >
                        <Text style={styles.drawerItem}>{sub.label}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        router.push(link.route);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <Text style={styles.drawerItem}>{link.label}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.actionText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.actionText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        // Desktop navigation
        <ScrollView
          horizontal
          contentContainerStyle={styles.menu}
          showsHorizontalScrollIndicator={false}
        >
          {links.map((link) => (
            <View key={link.label} style={{ position: 'relative' }}>
              {link.dropdown ? (
                <>
                  <TouchableOpacity onPress={() => toggleDropdown(link.label)}>
                    <Text style={styles.menuItem}>{link.label} ⌄</Text>
                  </TouchableOpacity>
                  {renderDropdown(link.label, link.dropdown)}
                </>
              ) : (
                <TouchableOpacity onPress={() => router.push(link.route)}>
                  <Text style={styles.menuItem}>{link.label}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Desktop login/signup */}
      {!isMobile && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.actionText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.signupBtn]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[styles.actionText, styles.signupText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 20,
    backgroundColor:
      Platform.OS === 'android' ? 'rgba(255,255,255,0.85)' : 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    zIndex: 999,
  },
  logo: {
    fontSize: 24,
    color: '#003366',
    fontWeight: 'bold',
  },
  hamburger: {
    fontSize: 26,
    paddingHorizontal: 10,
    color: '#003366',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItem: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    fontSize: 14,
    paddingVertical: 6,
    color: '#003366',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 51, 102, 0.05)',
  },
  signupBtn: {
    backgroundColor: '#003366',
  },
  actionText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '500',
  },
  signupText: {
    color: '#fff',
  },
  drawer: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    zIndex: 999,
  },
  drawerItem: {
    fontSize: 18,
    color: '#003366',
    paddingVertical: 8,
  },
});
