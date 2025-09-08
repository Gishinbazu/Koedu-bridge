// components/SidebarInfoNav.js — upgraded & unified (Modal + AppTheme + polish)
// - Single, canonical file (removes duplicate definitions)
// - Themed via useAppTheme (overlay/blur/surface/text/accents)
// - Velocity & distance threshold for swipe-to-close
// - Proper Modal onRequestClose (Android back)
// - Accessible roles/labels & improved touch targets
// - Responsive width cap + keyboard-safe TextInput

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useAppTheme } from '../theme/AppTheme';

const SWIPE_CLOSE_RATIO = 0.25; // 25% drag to close
const SWIPE_CLOSE_VX = 0.7;     // or fast fling

export default function SidebarInfoNav({ visible = true, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { theme } = useAppTheme();

  // Animations
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current; // base slide-in
  const dragX = useRef(new Animated.Value(0)).current; // user drag offset
  const overlayOpacity = useRef(new Animated.Value(0)).current; // dim background
  const combinedTranslateX = Animated.add(translateX, dragX);

  // Quick filter
  const [query, setQuery] = useState('');

  const links = useMemo(
    () => [
      { label: 'Key dates', route: '/info/key-dates', icon: 'calendar' },
      { label: 'Entry requirements', route: '/info/entry-requirements', icon: 'reader' },
      { label: 'How to apply', route: '/info/how-to-apply', icon: 'create' },
      { label: 'Unqualified?', route: '/info/unqualified', icon: 'alert-circle' },
      { label: 'Tuition fees', route: '/info/tuition-fees', icon: 'cash' },
      { label: 'Language requirements', route: '/info/language-requirements', icon: 'chatbubbles' },
      { label: 'After applying', route: '/info/after-apply', icon: 'send' },
    ],
    []
  );

  const filteredLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(l => l.label.toLowerCase().includes(q));
  }, [links, query]);

  // Open/close animations when `visible` changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // reset position so next open animates from the edge
      translateX.setValue(SCREEN_WIDTH);
      dragX.setValue(0);
      overlayOpacity.setValue(0);
    }
  }, [visible, SCREEN_WIDTH, translateX, dragX, overlayOpacity]);

  // Android hardware back closes the panel
  useEffect(() => {
    if (!visible) return;
    const onBack = () => {
      closeWithAnim();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [visible]);

  const closeWithAnim = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onClose?.();
    });
  }, [SCREEN_WIDTH, translateX, overlayOpacity, onClose]);

  // Swipe-to-close (drag toward right)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && g.dx > 6,
      onPanResponderMove: (_, g) => {
        const dx = Math.max(0, g.dx);
        dragX.setValue(dx);
        // soften overlay while dragging
        const t = Math.min(dx / (SCREEN_WIDTH * 0.8), 1);
        overlayOpacity.setValue(1 - 0.9 * t);
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.dx > SCREEN_WIDTH * SWIPE_CLOSE_RATIO || g.vx > SWIPE_CLOSE_VX;
        if (shouldClose) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 180,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }).start(() => onClose?.());
        } else {
          Animated.spring(dragX, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
          Animated.timing(overlayOpacity, { toValue: 1, duration: 120, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const handleNavigate = useCallback((route) => {
    router.push(route);
    closeWithAnim();
  }, [router, closeWithAnim]);

  const isActive = useCallback((route) => pathname?.startsWith(route), [pathname]);

  const stopPropagation = (e) => e.stopPropagation?.();

  const PANEL_WIDTH = Math.min(SCREEN_WIDTH * 0.86, 420);

  return (
    <Modal
      visible={visible}
      animationType="none" // we do our own animations
      transparent
      statusBarTranslucent
      onRequestClose={closeWithAnim} // Android back for Modal
      presentationStyle={Platform.select({ ios: 'overFullScreen', android: 'overFullScreen', default: 'overFullScreen' })}
    >
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: theme.overlay, opacity: overlayOpacity },
        ]}
        accessibilityViewIsModal
        importantForAccessibility="yes"
      >
        {/* Backdrop blur + tap to close */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeWithAnim}
          accessibilityRole="button"
          accessibilityLabel="Close information menu"
        >
          <BlurView intensity={40} tint={theme.blurTint} style={StyleSheet.absoluteFill} />
        </Pressable>

        {/* Panel */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              width: PANEL_WIDTH,
              transform: [{ translateX: combinedTranslateX }],
              backgroundColor: theme.surface,
              borderColor: theme.stroke,
            },
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={stopPropagation}
          {...panResponder.panHandlers}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View style={[styles.brandBadge, { backgroundColor: theme.surfaceAlt }]}> 
                  <Ionicons name="school" size={18} color={theme.text} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Information</Text>
              </View>
              <Pressable
                onPress={closeWithAnim}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                style={[styles.iconBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.stroke }]}
              >
                <Ionicons name="close" size={26} color={theme.text} />
              </Pressable>
            </View>

            {/* Search */}
            <View style={[styles.searchBox, { backgroundColor: theme.surfaceAlt, borderColor: theme.stroke }]}> 
              <Ionicons name="search" size={18} color={theme.subText} style={{ marginRight: 8 }} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search in info…"
                placeholderTextColor={theme.subText}
                style={[styles.searchInput, { color: theme.text }]}
                returnKeyType="search"
              />
            </View>

            {/* Links */}
            <ScrollView style={styles.menuList} contentContainerStyle={{ paddingBottom: 14 }} keyboardShouldPersistTaps="handled">
              {filteredLinks.map((item) => {
                const active = isActive(item.route);
                return (
                  <Pressable
                    key={item.route}
                    onPress={() => handleNavigate(item.route)}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to ${item.label}`}
                    android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                    style={[styles.menuItem, active && { backgroundColor: theme.primary + '33' }]}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIconWrap, active && { backgroundColor: theme.primary }]}>
                        <Ionicons name={item.icon} size={18} color={active ? '#111' : theme.subText} />
                      </View>
                      <Text style={[styles.itemLabel, { color: active ? '#111' : theme.text }]}>{item.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={active ? '#111' : theme.subText} />
                  </Pressable>
                );
              })}

              {filteredLinks.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="information-circle-outline" size={22} color={theme.subText} />
                  <Text style={{ color: theme.subText }}>No matches</Text>
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: theme.stroke }]}> 
              <Ionicons name="shield-checkmark" size={16} color={theme.subText} />
              <Text style={{ color: theme.subText, fontSize: 12 }}>Content managed by KOEDU Bridge</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    elevation: 10000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderWidth: Platform.OS === 'web' ? 1 : StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  iconBtn: { padding: 8, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 40, marginBottom: 8, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: Platform.select({ ios: 10, android: 6, default: 6 }) },
  menuList: { marginTop: 6, flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, marginVertical: 2 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
  emptyState: { marginTop: 20, alignItems: 'center', gap: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
});
