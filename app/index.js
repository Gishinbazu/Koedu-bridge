// app/index.js — KOEDU Bridge Home (admin-aware hero, polished theming)

import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  useFonts,
} from '@expo-google-fonts/merriweather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AcademicInfoSection from '../components/AcademicInfoSection';
import AdmissionInfoCards from '../components/AdmissionInfoCards';
import AdmissionsBanner from '../components/AdmissionsBanner';
import FAQSection from '../components/FAQSection';
import FeaturedCourses from '../components/FeaturedCourses';
import KPIBar from '../components/KPIBar';
import ProgramSearchBar from '../components/program/ProgramSearchBar';
import StorySection from '../components/StorySection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import TopNavbar from '../components/TopNavbar';
import { getCurrentUser } from '../services/authApi';

// ---------- THEME PRESETS ----------
const SCHEMES = {
  royal: {
    light: {
      top: '#f7f9ff',
      mid: '#eef3fb',
      bottom: '#eaf0f9',
      surface: '#ffffff',
      surfaceAlt: 'rgba(255,255,255,0.85)',
      stroke: '#e5e7eb',
      text: '#0b2a4a',
      subText: '#475569',
      primary: '#0b3b79',
      brand: '#0b3b79',
      brandText: '#ffffff',
      chipBg: '#f8fafc',
      chipText: '#0b2a4a',
    },
    dark: {
      top: '#0a0a0a',
      mid: '#111111',
      bottom: '#171717',
      surface: '#121212',
      surfaceAlt: 'rgba(20,20,20,0.78)',
      stroke: '#262626',
      text: '#e5e7eb',
      subText: '#cbd5e1',
      primary: '#8ab4ff',
      brand: '#3b82f6',
      brandText: '#0b1020',
      chipBg: '#1f2937',
      chipText: '#e5e7eb',
    },
  },
  emerald: {
    light: {
      top: '#f3fbf8',
      mid: '#e7f7f0',
      bottom: '#dcf2ea',
      surface: '#ffffff',
      surfaceAlt: 'rgba(255,255,255,0.9)',
      stroke: '#e5e7eb',
      text: '#064e3b',
      subText: '#0f766e',
      primary: '#065f46',
      brand: '#059669',
      brandText: '#ffffff',
      chipBg: '#ecfdf5',
      chipText: '#064e3b',
    },
    dark: {
      top: '#031d17',
      mid: '#07261f',
      bottom: '#0b2f27',
      surface: '#112420',
      surfaceAlt: 'rgba(15,40,34,0.82)',
      stroke: '#153a32',
      text: '#def7ee',
      subText: '#a7f3d0',
      primary: '#34d399',
      brand: '#10b981',
      brandText: '#04221a',
      chipBg: '#12352d',
      chipText: '#d1fae5',
    },
  },
  terracotta: {
    light: {
      top: '#fff7f3',
      mid: '#fdeee8',
      bottom: '#fde5db',
      surface: '#ffffff',
      surfaceAlt: 'rgba(255,255,255,0.9)',
      stroke: '#f3d5c8',
      text: '#3b1810',
      subText: '#7c2d12',
      primary: '#7c2d12',
      brand: '#ea580c',
      brandText: '#ffffff',
      chipBg: '#fff1e7',
      chipText: '#7c2d12',
    },
    dark: {
      top: '#1a0e0a',
      mid: '#220f0a',
      bottom: '#2a110a',
      surface: '#1b130f',
      surfaceAlt: 'rgba(27,19,15,0.82)',
      stroke: '#3b241a',
      text: '#ffe5d6',
      subText: '#fec9a3',
      primary: '#ff8a4c',
      brand: '#fb923c',
      brandText: '#2a110a',
      chipBg: '#2b1a12',
      chipText: '#ffd6bd',
    },
  },
};

function getTheme(isDark, scheme) {
  const s = SCHEMES[scheme] || SCHEMES.royal;
  return isDark ? s.dark : s.light;
}

// ---------- Layout helpers ----------
const ContentWrapper = ({ children, narrow = false }) => (
  <View style={[styles.wrapper, narrow && { maxWidth: 900 }]}>{children}</View>
);

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message ?? 'Something went wrong' };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallbackBox}>
          <Text style={styles.fallbackTitle}>⚠️ Section indisponible</Text>
          <Text style={styles.fallbackText}>
            {this.props.hint ??
              "Une erreur s'est produite lors du chargement de cette section."}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Reduced motion (web)
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'matchMedia' in window
    ) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mq.matches);
      const h = () => setReduced(mq.matches);
      mq.addEventListener ? mq.addEventListener('change', h) : mq.addListener(h);
      return () =>
        mq.removeEventListener
          ? mq.removeEventListener('change', h)
          : mq.removeListener(h);
    }
  }, []);
  return reduced;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scheme, setScheme] = useState('royal');
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const [fontsLoaded] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
  });

  // utilisateur connecté (admin ou autre)
  const [currentUser, setCurrentUser] = useState(null);

  // Load saved theme & scheme
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedScheme = await AsyncStorage.getItem('scheme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
        if (savedScheme && SCHEMES[savedScheme]) setScheme(savedScheme);
      } catch {}
    })();
  }, []);

  // Charger l'utilisateur connecté pour personnaliser le hero
  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser();
        // ✅ safe si API renvoie { user: ... }
        setCurrentUser(me?.user || me || null);
      } catch (e) {
        console.log('getCurrentUser error on home:', e?.message);
        setCurrentUser(null);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  const setSchemePersist = async (name) => {
    setScheme(name);
    try {
      await AsyncStorage.setItem('scheme', name);
    } catch {}
  };

  // Redirect to /programs with query params
  const handleProgramSearch = ({ semester, level, keyword }) => {
    const qp = new URLSearchParams({
      q: (keyword || '').trim(),
      level: level || 'All',
      semester: semester || 'Any',
    }).toString();
    router.push(`/programs?${qp}`);
  };

  const isSmall = width < 520;
  const reduceAnimations = reduceMotion || isSmall || Platform.OS !== 'web';

  const [videoSrc, setVideoSrc] = useState({
    uri: 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4',
  });

  const HERO_IMG = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Sunmoon-university.jpg',
  };

  const PRIMARY = 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4';
  const SECONDARY =
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  const [heroVideoError, setHeroVideoError] = useState(false);
  const useFallbackImage = heroVideoError || reduceAnimations;

  const heroHeight = useMemo(() => {
    const aspect = 9 / 16;
    const fit = Math.round(width * aspect);
    const min = isSmall ? 480 : 680;
    const max = 980;
    return Math.min(max, Math.max(min, fit));
  }, [width, isSmall]);

  const theme = useMemo(
    () => getTheme(isDarkMode, scheme),
    [isDarkMode, scheme]
  );

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={[theme.top, theme.mid, theme.bottom]} style={styles.bg}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Top navbar */}
      <View
        style={[
          { zIndex: 50 },
          isSmall && { paddingTop: Math.max(insets.top, 8) },
        ]}
      >
        <TopNavbar />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          isSmall && mobile.container,
          Platform.OS !== 'web' && {
            paddingBottom: (isSmall ? 80 : 60) + Math.max(insets.bottom, 6),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View
          style={[
            styles.heroWrapper,
            styles.heroFullBleed,
            isSmall && mobile.heroWrapper,
            { height: heroHeight },
          ]}
        >
          {useFallbackImage ? (
            <ImageBackground
              source={HERO_IMG}
              style={styles.heroVideo}
              resizeMode="cover"
            >
              <HeroOverlay theme={theme} isSmall={isSmall}>
                <View
                  style={[
                    styles.heroGlass,
                    isSmall && mobile.heroGlass,
                    {
                      backgroundColor: theme.surfaceAlt,
                      borderColor: theme.stroke,
                      padding: isSmall ? 16 : 22,
                      ...(Platform.OS === 'web'
                        ? { backdropFilter: 'saturate(1.15) blur(12px)' }
                        : {}),
                      marginTop: Platform.OS !== 'web' ? insets.top / 2 : 0,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                    pointerEvents="none"
                  />

                  <HeroContent
                    router={router}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    onSearch={handleProgramSearch}
                    scheme={scheme}
                    setScheme={setSchemePersist}
                    isSmall={isSmall}
                    currentUser={currentUser}
                  />
                </View>
              </HeroOverlay>
            </ImageBackground>
          ) : (
            <>
              <Video
                source={{ uri: videoSrc.uri || PRIMARY }}
                style={styles.heroVideo}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
                usePoster
                posterSource={HERO_IMG}
                onError={(e) => {
                  console.warn('Video error:', e);
                  if (videoSrc.uri !== SECONDARY) setVideoSrc({ uri: SECONDARY });
                  else setHeroVideoError(true);
                }}
                renderToHardwareTextureAndroid
                ignoreSilentSwitch="obey"
              />

              <HeroOverlay theme={theme} isSmall={isSmall}>
                <View
                  style={[
                    styles.heroGlass,
                    isSmall && mobile.heroGlass,
                    {
                      backgroundColor: theme.surfaceAlt,
                      borderColor: theme.stroke,
                      padding: isSmall ? 16 : 22,
                      ...(Platform.OS === 'web'
                        ? { backdropFilter: 'saturate(1.15) blur(12px)' }
                        : {}),
                      marginTop: Platform.OS !== 'web' ? insets.top / 2 : 0,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.06)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                    pointerEvents="none"
                  />

                  <HeroContent
                    router={router}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    onSearch={handleProgramSearch}
                    scheme={scheme}
                    setScheme={setSchemePersist}
                    isSmall={isSmall}
                    currentUser={currentUser}
                  />
                </View>
              </HeroOverlay>
            </>
          )}
        </View>

        {/* KPI strip */}
        <ContentWrapper>
          <KPIBar theme={theme} isSmall={isSmall} />
        </ContentWrapper>

        <GradientDivider theme={theme} />

        <ContentWrapper narrow>
          <SectionHeader
            title="Plan your journey"
            subtitle="From application to arrival – clear steps, real support"
            theme={theme}
            isSmall={isSmall}
          />
          <AcademicInfoSection />
        </ContentWrapper>

        <ContentWrapper>
          <StorySection />
        </ContentWrapper>

        <ContentWrapper narrow>
          <AdmissionsBanner />
        </ContentWrapper>

        <ContentWrapper>
          <FAQSection />
        </ContentWrapper>

        <ContentWrapper>
          <AdmissionInfoCards />
        </ContentWrapper>

        <ContentWrapper>
          <ErrorBoundary hint="Impossible de charger les programmes mis en avant.">
            <SectionHeader
              title="Featured programs"
              subtitle="Curated options for the next intake"
              theme={theme}
              isSmall={isSmall}
            />
            <FeaturedCourses />
          </ErrorBoundary>
        </ContentWrapper>

        <ContentWrapper>
          <SectionHeader
            title="What students say"
            subtitle="Real stories from KOEDU Bridge alumni"
            theme={theme}
            isSmall={isSmall}
          />
          <TestimonialsCarousel />
        </ContentWrapper>

        <FooterCta theme={theme} router={router} isSmall={isSmall} />
      </ScrollView>

      {/* Floating theme switcher */}
      <FloatingThemeSwitch
        theme={theme}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        scheme={scheme}
        setScheme={setSchemePersist}
        isSmall={isSmall}
        insets={insets}
      />
    </LinearGradient>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
const HeroOverlay = ({ children, isSmall }) => (
  <View style={[styles.heroOverlay, isSmall && mobile.heroOverlay]}>
    <LinearGradient
      colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.65)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    {children}
  </View>
);

const HeroContent = ({
  router,
  theme,
  isDarkMode,
  toggleTheme,
  onSearch,
  scheme,
  setScheme,
  isSmall,
  currentUser,
}) => {
  const [scale] = useState(new Animated.Value(1));
  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const schemes = [
    { key: 'royal', swatch: '#0b3b79' },
    { key: 'emerald', swatch: '#059669' },
    { key: 'terracotta', swatch: '#ea580c' },
  ];

  const isLoggedIn = !!currentUser;
  const isAdmin =
    currentUser?.role === 'admin' || currentUser?.userRole === 'admin';

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    (isAdmin ? 'Admin' : 'Student');

  return (
    <View style={styles.heroContent}>
      <View style={styles.textBlock}>
        {/* ---------- TITRE ---------- */}
        <Text style={[styles.titleLarge, isSmall && mobile.titleLarge]}>
          {isAdmin ? (
            <>
              Welcome to your page{' '}
              <Text style={{ color: theme.brand }}>{displayName}</Text>
            </>
          ) : isLoggedIn ? (
            <>
              Welcome to your page{' '}
              <Text style={{ color: theme.brand }}>{displayName}</Text>
            </>
          ) : (
            <>
              Apply to Korean universities{' '}
              <Text style={{ color: theme.brand }}>with KOEDU Bridge</Text>
            </>
          )}
        </Text>

        {/* ---------- SOUS-TITRE ---------- */}
        <Text
          style={[
            styles.description,
            { color: theme.subText, opacity: 0.98 },
            isSmall && mobile.description,
          ]}
        >
          {isAdmin
            ? 'Manage your students, applications and KOEDU Bridge content from your dashboard.'
            : isLoggedIn
            ? 'Track your Korean university applications and continue your journey with KOEDU Bridge.'
            : 'Choose your program. Submit your application. Start your journey.'}
        </Text>

        {/* ---------- BARRE DE RECHERCHE : visible pour invités ET étudiants ---------- */}
        {!isAdmin && (
          <>
            <View style={{ width: '100%', marginTop: 18, marginBottom: 10 }}>
              <ProgramSearchBar onSearch={onSearch} />
            </View>

            {isSmall ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2 }}
                style={{ width: '100%', marginBottom: 10 }}
              >
                {[
                  'AI',
                  'Business',
                  'Seoul',
                  'English track',
                  'Design',
                  'Data',
                  'Nursing',
                  'Mechanical',
                ].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => onSearch({ keyword: t })}
                    style={{
                      backgroundColor: theme.chipBg,
                      borderColor: theme.stroke,
                      borderWidth: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.chipText,
                        fontWeight: '700',
                        fontSize: 14,
                      }}
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                {['AI', 'Business', 'Seoul', 'English track'].map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => onSearch({ keyword: t })}
                    style={{
                      backgroundColor: theme.chipBg,
                      borderColor: theme.stroke,
                      borderWidth: 1,
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: theme.chipText, fontWeight: '600' }}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        {/* ---------- BOUTONS ---------- */}
        <View style={[styles.heroButtons, isSmall && mobile.heroButtons]}>
          {isAdmin ? (
            <>
              {/* ADMIN: dashboard + edit stats */}
              <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => router.push('/admin/dashboard')}
                  style={[
                    styles.button,
                    isSmall && mobile.button,
                    { backgroundColor: theme.brand },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: theme.brandText }]}>
                    Go to your Dashboard
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable
                style={[
                  styles.outlineBtn,
                  isSmall && mobile.outlineBtn,
                  { borderColor: theme.brand },
                ]}
                onPress={() => router.push('/admin/edit-stats')}
              >
                <Text style={[styles.outlineText, { color: theme.brand }]}>
                  Edit statistics
                </Text>
              </Pressable>
            </>
          ) : isLoggedIn ? (
            <>
              {/* ÉTUDIANT CONNECTÉ */}
              <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => router.push('/student/dashboard')} // ✅ FIXED
                  style={[
                    styles.button,
                    isSmall && mobile.button,
                    { backgroundColor: theme.brand },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: theme.brandText }]}>
                    View my applications
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable
                style={[
                  styles.outlineBtn,
                  isSmall && mobile.outlineBtn,
                  { borderColor: theme.brand },
                ]}
                onPress={() => router.push('/programs')} // ✅ OK
              >
                <Text style={[styles.outlineText, { color: theme.brand }]}>
                  Browse programs
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* VISITEUR NON CONNECTÉ */}
              <Animated.View style={{ transform: [{ scale }] }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => router.push('/auth/signup')}
                  style={[
                    styles.button,
                    isSmall && mobile.button,
                    { backgroundColor: theme.brand },
                  ]}
                >
                  <Text style={[styles.buttonText, { color: theme.brandText }]}>
                    Apply now
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable
                style={[
                  styles.outlineBtn,
                  isSmall && mobile.outlineBtn,
                  { borderColor: theme.brand },
                ]}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={[styles.outlineText, { color: theme.brand }]}>
                  Sign in
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Theme & palette controls */}
        <View style={{ marginTop: 18, alignItems: 'center' }}>
          <Pressable onPress={toggleTheme} accessibilityLabel="Toggle color theme">
            <Text style={{ color: theme.text, textDecorationLine: 'underline' }}>
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </Text>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {schemes.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => setScheme(s.key)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: s.swatch,
                  borderWidth: s.key === scheme ? 3 : 1,
                  borderColor: s.key === scheme ? '#ffffff' : theme.stroke,
                }}
                accessibilityLabel={`Color scheme: ${s.key}`}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const SectionHeader = ({ title, subtitle, theme, isSmall }) => (
  <View style={{ marginBottom: 14 }}>
    <Text
      style={[
        styles.sectionTitle,
        isSmall && mobile.sectionTitle,
        { color: theme.text },
      ]}
    >
      {title}
    </Text>
    {!!subtitle && (
      <Text
        style={[
          styles.sectionSubtitle,
          isSmall && mobile.sectionSubtitle,
          { color: theme.subText },
        ]}
      >
        {subtitle}
      </Text>
    )}
  </View>
);

const GradientDivider = ({ theme }) => (
  <LinearGradient
    colors={[theme.bottom, '#ffffff00']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.gradientDivider}
  />
);

const FooterCta = ({ theme, router, isSmall }) => (
  <View
    style={[
      styles.footerCta,
      isSmall && mobile.footerCta,
      { borderTopColor: theme.stroke },
    ]}
  >
    <ContentWrapper narrow>
      <View
        style={[
          styles.footerCtaCard,
          isSmall && mobile.footerCtaCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.stroke,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.footerTitle,
              isSmall && mobile.footerTitle,
              { color: theme.text },
            ]}
          >
            Ready to start?
          </Text>
          <Text
            style={[
              styles.footerSubtitle,
              isSmall && mobile.footerSubtitle,
              { color: theme.subText },
            ]}
          >
            Create an account and get paired with a KOEDU Bridge Manager.
          </Text>
        </View>

        <View
          style={{
            flexDirection: isSmall ? 'column' : 'row',
            gap: 10,
            width: isSmall ? '100%' : undefined,
          }}
        >
          <Pressable
            style={[
              styles.button,
              isSmall && mobile.button,
              {
                minWidth: isSmall ? '100%' : 140,
                backgroundColor: theme.brand,
              },
            ]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[styles.buttonText, { color: theme.brandText }]}>
              Create account
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.outlineBtn,
              isSmall && mobile.outlineBtn,
              {
                minWidth: isSmall ? '100%' : 120,
                borderColor: theme.brand,
              },
            ]}
            onPress={() => router.push('/programs')}
          >
            <Text style={[styles.outlineText, { color: theme.brand }]}>
              Browse programs
            </Text>
          </Pressable>
        </View>
      </View>
    </ContentWrapper>
  </View>
);

const FloatingThemeSwitch = ({
  theme,
  isDarkMode,
  toggleTheme,
  scheme,
  setScheme,
  isSmall,
  insets,
}) => (
  <View
    style={[
      styles.fabWrap,
      isSmall && mobile.fabWrap,
      {
        bottom:
          (isSmall ? 10 : 20) +
          (Platform.OS !== 'web' ? Math.max(insets.bottom, 4) : 0),
      },
    ]}
  >
    <View
      style={[
        styles.fabCard,
        isSmall && mobile.fabCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.stroke,
        },
      ]}
    >
      <Pressable
        onPress={toggleTheme}
        style={{ paddingVertical: 6, paddingHorizontal: 10 }}
      >
        <Text style={{ color: theme.text, fontWeight: '700' }}>
          {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      </Pressable>

      {['royal', 'emerald', 'terracotta'].map((k) => (
        <Pressable
          key={k}
          onPress={() => setScheme(k)}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            marginHorizontal: 6,
            backgroundColor: {
              royal: '#0b3b79',
              emerald: '#059669',
              terracotta: '#ea580c',
            }[k],
            borderWidth: k === scheme ? 2 : 1,
            borderColor: k === scheme ? '#fff' : theme.stroke,
          }}
        />
      ))}
    </View>
  </View>
);

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { paddingBottom: 60 },
  wrapper: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  heroWrapper: {
    width: '100%',
    height: 560,
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...(Platform.OS === 'web' ? { willChange: 'transform' } : {}),
  },
  heroFullBleed:
    Platform.OS === 'web'
      ? { width: '100vw', marginLeft: 'calc(50% - 50vw)' }
      : {},

  heroVideo: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 36,
  },
  heroGlass: {
    width: '100%',
    maxWidth: 960,
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  heroContent: { alignItems: 'center', width: '100%' },
  textBlock: { alignItems: 'center', width: '100%' },
  titleLarge: {
    fontFamily: 'Merriweather_700Bold',
    fontSize: 36,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 44,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  description: {
    fontFamily: 'Merriweather_400Regular',
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 26,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    elevation: 4,
  },
  buttonText: { fontWeight: '700', fontSize: 16 },
  outlineBtn: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
  },
  outlineText: { fontWeight: '700', fontSize: 16 },

  sectionTitle: { fontFamily: 'Merriweather_700Bold', fontSize: 22 },
  sectionSubtitle: { marginTop: 4, fontSize: 14 },

  gradientDivider: { height: 1, marginVertical: 18 },

  footerCta: { borderTopWidth: 1, paddingTop: 18, paddingBottom: 36 },
  footerCtaCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerTitle: { fontFamily: 'Merriweather_700Bold', fontSize: 18 },
  footerSubtitle: {},

  fallbackBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
  },
  fallbackTitle: { fontWeight: '800', marginBottom: 6, color: '#a8071a' },
  fallbackText: { color: '#5c0011' },

  fabWrap: { position: 'absolute', right: 14, bottom: 20 },
  fabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 2,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

/** Mobile overrides (≤520px) */
const mobile = StyleSheet.create({
  container: { paddingBottom: 80, paddingHorizontal: 10 },
  wrapper: { paddingHorizontal: 12, marginBottom: 18, maxWidth: '100%' },

  heroWrapper: {
    height: 360,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroOverlay: { paddingHorizontal: 12, paddingVertical: 20 },
  heroGlass: { maxWidth: 720, padding: 14, borderRadius: 16 },

  titleLarge: { fontSize: 26, lineHeight: 32, marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 14 },

  heroButtons: { flexDirection: 'column', gap: 10, width: '100%' },

  button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },
  outlineBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12 },

  sectionTitle: { fontSize: 20 },
  sectionSubtitle: { fontSize: 13 },

  footerCta: { paddingTop: 14, paddingBottom: 28 },
  footerCtaCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  footerTitle: { fontSize: 18 },
  footerSubtitle: { fontSize: 14 },

  fabWrap: { right: 10, bottom: 10 },
  fabCard: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 999 },
});
