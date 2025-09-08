// components/Header.js (polished UI, better a11y, safer behaviors)
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 70;

const LIGHT = {
  brand: '#003366',
  brandDark: '#0b3b79',
  text: '#0f172a',
  textMuted: '#475569',
  border: '#e5e7eb',
  surface: '#ffffff',
  surfaceAlt: 'rgba(255,255,255,0.85)',
  blurTint: 'light',
  backdrop: 'rgba(15,23,42,0.35)'
};

const DARK = {
  brand: '#7ab8ff',
  brandDark: '#a0c8ff',
  text: '#e5e7eb',
  textMuted: '#94a3b8',
  border: '#273244',
  surface: '#0b1220',
  surfaceAlt: 'rgba(11,18,32,0.7)',
  blurTint: 'dark',
  backdrop: 'rgba(0,0,0,0.5)'
};

function makeStyles(T) {
  return StyleSheet.create({
    root: {
      // sticky works on web; falls back to default on native without harm
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    wrapper: {
      backgroundColor: Platform.OS === 'android' ? T.surfaceAlt : 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    container: {
      height: HEADER_HEIGHT,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: T.border,
    },
    logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoBadge: {
      width: 30,
      height: 30,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: T.blurTint === 'light' ? 'rgba(0,51,102,0.12)' : 'rgba(122,184,255,0.18)',
      borderWidth: 1,
      borderColor: T.border,
    },
    logoBadgeText: { fontWeight: '800', color: T.brand },
    logo: {
      fontSize: 20,
      color: T.text,
      fontWeight: '800',
      letterSpacing: 0.2,
    },
    beta: {
      marginLeft: 8,
      fontSize: 11,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
      color: T.blurTint === 'light' ? T.brand : '#0b1220',
      backgroundColor: T.blurTint === 'light' ? 'rgba(0, 51, 102, 0.06)' : 'rgba(122,184,255,0.12)'
    },
    hamburger: { fontSize: 26, paddingHorizontal: 10, color: T.brand },

    // Desktop menu
    menu: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    menuItem: {
      marginHorizontal: 10,
      fontSize: 15,
      color: T.text,
      fontWeight: '600',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    menuItemActive: {
      color: T.brandDark,
      backgroundColor: T.blurTint === 'light' ? 'rgba(11,59,121,0.06)' : 'rgba(122,184,255,0.12)',
    },
    underline: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 4,
      height: 2,
      borderRadius: 2,
      backgroundColor: T.brand,
    },
    dropdown: {
      position: 'absolute',
      top: 40,
      left: 0,
      backgroundColor: T.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: T.border,
      paddingVertical: 6,
      paddingHorizontal: 8,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
      zIndex: 1000,
      minWidth: 220,
    },
    dropdownRow: { paddingVertical: 2, paddingHorizontal: 4 },
    dropdownItem: { fontSize: 14, color: T.brand, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
    dropdownActive: { fontWeight: '800', color: T.brandDark, backgroundColor: T.blurTint === 'light' ? 'rgba(11,59,121,0.06)' : 'rgba(122,184,255,0.12)' },

    // Right actions
    actions: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: {
      marginLeft: 10,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: T.blurTint === 'light' ? 'rgba(0, 51, 102, 0.06)' : 'rgba(122,184,255,0.12)',
      borderWidth: 1,
      borderColor: T.border,
    },
    signupBtn: { backgroundColor: T.brand, borderColor: T.brand },
    actionText: { fontSize: 14, color: T.blurTint === 'light' ? T.brand : '#0b1220', fontWeight: '700' },
    signupText: { color: '#fff', fontWeight: '800' },
    signupTextMobile: { color: T.brand, fontWeight: '800', marginTop: 6 },

    // Drawer (mobile)
    backdrop: {
      position: 'absolute',
      top: HEADER_HEIGHT,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: T.backdrop,
    },
    drawer: {
      position: 'absolute',
      top: HEADER_HEIGHT + 8,
      right: 12,
      left: 12,
      backgroundColor: T.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 18,
      elevation: 12,
      borderWidth: 1,
      borderColor: T.border,
    },
    drawerSection: {
      fontSize: 12,
      color: T.textMuted,
      textTransform: 'uppercase',
      marginTop: 8,
      marginBottom: 2,
      letterSpacing: 0.7,
    },
    drawerItem: {
      fontSize: 16,
      color: T.brand,
      paddingVertical: 12,
      paddingHorizontal: 6,
      borderRadius: 10,
    },
    drawerItemActive: {
      fontWeight: '800',
      color: T.brandDark,
      backgroundColor: T.blurTint === 'light' ? 'rgba(11,59,121,0.06)' : 'rgba(122,184,255,0.12)'
    },
    drawerDivider: {
      height: 1,
      backgroundColor: T.border,
      marginVertical: 12,
    },
  });
}

/**
 * Props:
 *  - scrollY?: Animated.SharedValue<number>
 */
export default function Header({ scrollY }) {
  const router = useRouter();
  const pathname = usePathname?.() ?? '/';
  const { width } = useWindowDimensions();
  const isMobile = width < 980; // slightly wider desktop threshold

  // System scheme (auto)
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const T = isDark ? DARK : LIGHT;
  const styles = useMemo(() => makeStyles(T), [isDark]);

  // UI state
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownAnchorRefs = useRef({});

  const toggleDropdown = (key) => setActiveDropdown((k) => (k === key ? null : key));
  const closeAllOverlays = () => {
    setActiveDropdown(null);
    setIsDrawerOpen(false);
  };

  // simple fade for dropdowns
  const fade = useSharedValue(0);
  useEffect(() => {
    fade.value = withTiming(activeDropdown ? 1 : 0, { duration: 140 });
  }, [activeDropdown]);

  // Close overlays on route change (web/native)
  useEffect(() => closeAllOverlays(), [pathname]);

  // ESC to close (web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeAllOverlays();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ROUTES (adapt to your sitemap)
  const links = useMemo(
    () => [
      { label: 'Home', route: '/' },
      {
        label: 'Programs',
        dropdown: [
          { label: 'Find programs', route: '/programs' },
          { label: 'Universities', route: '/universities' },
          { label: 'Admissions guide', route: '/info/admissions-guide' },
        ],
      },
      {
        label: 'Support',
        dropdown: [
          { label: 'FAQ', route: '/faq' },
          { label: 'Pricing', route: '/pricing' },
          { label: 'Contact', route: '/contacts' },
        ],
      },
      { label: 'News', route: '/news' },
      { label: 'About', route: '/about' },
    ],
    []
  );

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const y = scrollY?.value ?? 0;
    return {
      height: HEADER_HEIGHT,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: T.border,
      shadowOpacity: interpolate(y, [0, 20], [0.04, 0.12], Extrapolate.CLAMP),
      shadowRadius: interpolate(y, [0, 20], [6, 12], Extrapolate.CLAMP),
      transform: [{ translateY: 0 }],
    };
  });

  const animatedLogoStyle = useAnimatedStyle(() => {
    const y = scrollY?.value ?? 0;
    return {
      transform: [
        { scale: interpolate(y, [0, 100], [1, 0.92], Extrapolate.CLAMP) },
      ],
      opacity: interpolate(y, [0, 60], [1, 0.94], Extrapolate.CLAMP),
    };
  });

  const dropdownStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: withTiming(activeDropdown ? 0 : 4, { duration: 160 }) }],
  }));

  const isActive = (route) => pathname === route || pathname?.startsWith(route + '/');

  const MenuButton = ({ label, onPress, active, hasDropdown, onOpenDropdown, anchorKey }) => (
    <View style={{ position: 'relative' }}
      ref={(node) => { if (anchorKey) dropdownAnchorRefs.current[anchorKey] = node; }}
    >
      <Pressable
        onPress={hasDropdown ? onOpenDropdown : onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: hasDropdown ? active : undefined }}
        android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        style={({ pressed, hovered }) => [
          styles.menuItem,
          (active || hovered) && styles.menuItemActive,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={{ fontWeight: '700', color: hasDropdown ? T.text : active ? T.brandDark : T.text }}>
          {label}{hasDropdown ? ' ⌄' : ''}
        </Text>
      </Pressable>
      {active && !hasDropdown && <View style={styles.underline} />}
    </View>
  );

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.wrapper, animatedHeaderStyle]}
        // elevation layer for Android + rounded bottom edge feel
      >
        <BlurView intensity={80} tint={T.blurTint} style={styles.container}>
          {/* Left: Logo */}
          <Pressable
            onPress={() => { closeAllOverlays(); router.push('/'); }}
            accessibilityRole="button"
            style={styles.logoWrap}
          >
            <View style={styles.logoBadge}><Text style={styles.logoBadgeText}>KB</Text></View>
            <Animated.Text style={[styles.logo, animatedLogoStyle]}>KOEDU Bridge</Animated.Text>
            <Text style={styles.beta}>v2</Text>
          </Pressable>

          {/* Center: Nav */}
          {isMobile ? (
            <TouchableOpacity
              onPress={() => {
                setIsDrawerOpen((v) => !v);
                setActiveDropdown(null);
              }}
              accessibilityLabel="Open navigation menu"
            >
              <Text style={styles.hamburger}>☰</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              contentContainerStyle={styles.menu}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {links.map((link) => (
                <View key={link.label} style={{ position: 'relative' }}>
                  {link.dropdown ? (
                    <>
                      <MenuButton
                        label={link.label}
                        hasDropdown
                        active={activeDropdown === link.label}
                        onOpenDropdown={() => toggleDropdown(link.label)}
                        anchorKey={link.label}
                      />
                      {activeDropdown === link.label && (
                        <Animated.View style={[styles.dropdown, dropdownStyle]}
                        >
                          {link.dropdown.map((item) => (
                            <Pressable
                              key={item.route}
                              onPress={() => {
                                router.push(item.route);
                                setActiveDropdown(null);
                              }}
                              style={({ pressed, hovered }) => [
                                styles.dropdownRow,
                                hovered && { transform: [{ translateX: 2 }] },
                              ]}
                            >
                              <Text style={[
                                styles.dropdownItem,
                                isActive(item.route) && styles.dropdownActive,
                              ]}>
                                {item.label}
                              </Text>
                            </Pressable>
                          ))}
                        </Animated.View>
                      )}
                    </>
                  ) : (
                    <MenuButton
                      label={link.label}
                      onPress={() => router.push(link.route)}
                      active={isActive(link.route)}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {/* Right: Auth actions (desktop only) */}
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
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>
      </Animated.View>

      {/* Mobile drawer + backdrop */}
      {isDrawerOpen && (
        <>
          <Pressable style={styles.backdrop} onPress={closeAllOverlays} />
          <View style={styles.drawer}>
            {links.map((link) => (
              <View key={link.label}>
                {link.dropdown ? (
                  <>
                    <Text style={styles.drawerSection}>{link.label}</Text>
                    {link.dropdown.map((sub) => (
                      <TouchableOpacity
                        key={sub.route}
                        onPress={() => {
                          router.push(sub.route);
                          closeAllOverlays();
                        }}
                      >
                        <Text style={[styles.drawerItem, isActive(sub.route) && styles.drawerItemActive]}>
                          {sub.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      router.push(link.route);
                      closeAllOverlays();
                    }}
                  >
                    <Text style={[styles.drawerItem, isActive(link.route) && styles.drawerItemActive]}>
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <View style={styles.drawerDivider} />
            <TouchableOpacity onPress={() => { router.push('/auth/login'); closeAllOverlays(); }}>
              <Text style={styles.drawerItem}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { router.push('/auth/signup'); closeAllOverlays(); }}>
              <Text style={[styles.drawerItem, styles.drawerItemActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
