import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import SidebarInfoNav from './SidebarInfoNav';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NAV_HEIGHT = 56;

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname?.() || '/';
  const theme = useColorScheme?.() || 'light';
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const isWeb = Platform.OS === 'web';
  const isDark = theme === 'dark';

  // Smooth drop animation for the mobile menu
  const dropAnim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  useEffect(() => {
    Animated.timing(dropAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const navItems = useMemo(
    () => [
      { label: 'Home', route: '/' },
      { label: 'Programs', route: '/programs' },
      { label: 'Apply', route: '/auth/signup', cta: true },
      { label: 'Login', route: '/auth/login' },
    ],
    []
  );

  const handleNavigate = (route) => {
    setMenuOpen(false);
    router.push(route);
  };

  const bg = isDark ? '#0B1A2A' : '#08305F';
  const fg = '#ffffff';
  const subtle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.85)';

  const MobileMenu = (
    <Animated.View
      style={[
        styles.mobileMenu,
        {
          backgroundColor: bg,
          shadowColor: '#000',
          transform: [
            {
              translateY: dropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-10, 0],
              }),
            },
          ],
          opacity: dropAnim,
        },
      ]}
    >
      {navItems.map((item, idx) => (
        <Pressable
          key={idx}
          onPress={() => handleNavigate(item.route)}
          style={({ pressed }) => [styles.mobileItem, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.mobileLink, item.cta && styles.ctaMobile]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
      <View style={styles.mobileDivider} />
      <Pressable onPress={() => { setMenuOpen(false); setSidebarVisible(true); }}>
        <Text style={styles.mobileLink}>Info Menu</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.navWrap,
        isWeb && styles.navWrapWebFixed,
        { backgroundColor: bg },
      ]}
    >
      {/* status bar contrast on native */}
      {Platform.OS !== 'web' && (
        <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} />
      )}

      <View style={styles.navbar}>
        {/* Left: Logo & Brand */}
        <Pressable
          onPress={() => handleNavigate('/')}
          style={({ pressed, hovered }) => [
            styles.logoContainer,
            (pressed || hovered) && { opacity: 0.9, transform: [{ translateY: -0.5 }] },
          ]}
        >
          <Image source={require('../assets/images/koedu.png')} style={styles.logo} />
          <Text style={[styles.brand, { color: fg }]}>KOEDU Bridge</Text>
        </Pressable>

        {/* Desktop links */}
        {isWeb ? (
          <View style={styles.linksRow}>
            {navItems.map((item, idx) => {
              const active = pathname === item.route;
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleNavigate(item.route)}
                  style={({ hovered, pressed }) => [
                    styles.linkBtn,
                    active && styles.linkActive,
                    hovered && styles.linkHover,
                    pressed && { transform: [{ translateY: 1 }] },
                    item.cta && styles.cta,
                  ]}
                  role="link"
                  aria-current={active ? 'page' : undefined}
                >
                  <Text style={[styles.linkText, item.cta && styles.ctaText]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setSidebarVisible(true)}
              style={({ hovered }) => [styles.linkBtn, hovered && styles.linkHover]}
            >
              <View style={styles.menuPill}>
                <Ionicons name="grid-outline" size={16} color={fg} />
                <Text style={styles.linkText}>Info</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          // Mobile hamburger
          <Pressable
            onPress={() => setMenuOpen((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
            style={({ pressed }) => [styles.hamBtn, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name={menuOpen ? 'close' : 'menu'} size={28} color={fg} />
          </Pressable>
        )}
      </View>

      {/* Mobile dropdown */}
      {Platform.OS !== 'web' && menuOpen && MobileMenu}

      {/* Sidebar overlay */}
      {sidebarVisible && (
        <SidebarInfoNav onClose={() => setSidebarVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navWrap: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 8 : 4,
    paddingBottom: 8,
    borderBottomWidth: Platform.OS === 'web' ? StyleSheet.hairlineWidth : 0,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  navWrapWebFixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  navbar: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  linkHover: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  linkActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  linkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cta: {
    backgroundColor: '#FFD166',
    borderColor: '#FFD166',
  },
  ctaText: {
    color: '#0b1a2a',
    fontWeight: '800',
  },
  menuPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hamBtn: {
    padding: 6,
    borderRadius: 8,
  },
  mobileMenu: {
    position: 'absolute',
    top: NAV_HEIGHT + 10,
    right: 12,
    left: 12,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mobileItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  mobileLink: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  ctaMobile: {
    backgroundColor: 'rgba(255,209,102,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mobileDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 8,
  },
});
