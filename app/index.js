// app/index.js
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  useFonts,
} from '@expo-google-fonts/merriweather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import AcademicInfoSection from '../components/AcademicInfoSection';
import AdmissionInfoCards from '../components/AdmissionInfoCards';
import AdmissionsBanner from '../components/AdmissionsBanner';
import FAQSection from '../components/FAQSection';
import FeaturedCourses from '../components/FeaturedCourses';
import ProgramSearchBar from '../components/ProgramSearchBar';
import StorySection from '../components/StorySection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import TopNavbar from '../components/TopNavbar';

import { db } from '../services/firebase';

const ContentWrapper = ({ children }) => (
  <View style={styles.wrapper}>{children}</View>
);

/** Small boundary so a child can't crash the whole page */
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
            {this.props.hint ?? "Une erreur s'est produite lors du chargement de cette section."}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { width } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      } catch {}
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  // Search programs (Firestore) — guarded
  const handleProgramSearch = async ({ semester, keyword, level }) => {
    const kw = (keyword || '').trim().toLowerCase();
    try {
      const q = query(collection(db, 'programs'));
      const snapshot = await getDocs(q);
      const allPrograms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allPrograms.filter(p => {
        const inText =
          (p.title?.toLowerCase().includes(kw) || p.description?.toLowerCase().includes(kw));
        const matchLevel = !level || level === 'All' || p.level === level;
        return inText && matchLevel;
      });

      setSearchResults(filtered);
    } catch (e) {
      console.error('[program search] Firestore error:', e);
      setSearchResults([]);
    }
  };

  // ── Responsive media choices ───────────────────────────────────────────────
  const isSmall = width < 480;
  const isTabletDown = width < 768;

  // On Android or small screens, prefer the lightweight image.
  const useFallbackImage = videoError || Platform.OS === 'android' || isTabletDown;

  // Small/light image for native or very small screens
  const useSmallImage = Platform.OS !== 'web' || isSmall;
  const HERO_IMG_MOBILE = require('../assets/images/hero-mobile.jpg.png'); // add this file
  const HERO_IMG_DESKTOP = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Sunmoon-university.jpg',
  };

  const bgTop = isDarkMode ? '#0a0a0a' : '#f6f7fb';
  const bgBottom = isDarkMode ? '#1a1a1a' : '#eef2f7';
  const textColor = isDarkMode ? '#eee' : '#111';

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={[bgTop, bgBottom]} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TopNavbar />

        <View style={styles.heroWrapper}>
          {useFallbackImage ? (
            <ImageBackground
              source={useSmallImage ? HERO_IMG_MOBILE : HERO_IMG_DESKTOP}
              style={styles.heroVideo}
              resizeMode="cover"
            >
              <View style={[styles.heroOverlay, isSmall && styles.heroOverlaySm]}>
                <HeroContent
                  router={router}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onSearch={handleProgramSearch}
                />
              </View>
            </ImageBackground>
          ) : (
            <>
              <Video
                source={{ uri: 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4' }}
                style={styles.heroVideo}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
                usePoster
                posterSource={useSmallImage ? HERO_IMG_MOBILE : HERO_IMG_DESKTOP}
                onError={(e) => { console.error('video error', e); setVideoError(true); }}
              />
              <View style={[styles.heroOverlay, isSmall && styles.heroOverlaySm]}>
                <HeroContent
                  router={router}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onSearch={handleProgramSearch}
                />
              </View>
            </>
          )}
        </View>

        <ContentWrapper>
          <AcademicInfoSection />
        </ContentWrapper>

        <ContentWrapper>
          <StorySection />
        </ContentWrapper>

        <ContentWrapper>
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
            <FeaturedCourses />
          </ErrorBoundary>
        </ContentWrapper>

        <ContentWrapper>
          <TestimonialsCarousel />
        </ContentWrapper>

        {searchResults.length > 0 && (
          <ContentWrapper>
            <Text style={[styles.searchTitle, { color: textColor }]}>Search Results:</Text>
            {searchResults.map((program) => (
              <View key={program.id} style={{ marginBottom: 15 }}>
                <Pressable onPress={() => router.push('/program/' + program.id)}>
                  <Text style={[styles.resultTitle, { color: '#003366' }]}>{program.title}</Text>
                </Pressable>
                <Text style={{ color: textColor }}>{program.university} – {program.level}</Text>
                <Text style={{ color: '#666' }}>{program.description}</Text>
              </View>
            ))}
          </ContentWrapper>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Hero with integrated search
const HeroContent = ({ router, isDarkMode, toggleTheme, onSearch }) => {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.heroContent}>
      <View style={styles.textBlock}>
        <Text style={styles.titleLarge}>
          Apply to Korean universities <Text style={styles.highlight}>with KOEDU Bridge</Text>
        </Text>
        <Text style={styles.description}>
          Choose your program. Submit your application. Start your journey.
        </Text>

        <View style={{ width: '100%', marginVertical: 16 }}>
          <ProgramSearchBar onSearch={onSearch} />
        </View>

        <View style={styles.heroButtons}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => router.push('/auth/signup')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Apply now</Text>
            </Pressable>
          </Animated.View>

          <Pressable style={styles.outlineBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.outlineText}>Sign in</Text>
          </Pressable>
        </View>

        <Pressable onPress={toggleTheme} style={{ marginTop: 24 }}>
          <Text style={{ color: isDarkMode ? '#f7cc53' : '#00366', textDecorationLine: 'underline' }}>
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

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
    height: 550,
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroVideo: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // show video through
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  heroOverlaySm: {
    backgroundColor: 'rgba(0,0,0,0.45)', // a bit stronger on small screens
  },
  heroContent: { maxWidth: 700, alignItems: 'center', width: '100%', paddingHorizontal: 16 },
  textBlock: { alignItems: 'center', width: '100%' },
  titleLarge: {
    fontFamily: 'Merriweather_700Bold',
    fontSize: 30,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 40,
  },
  highlight: { color: '#f7cc53', fontWeight: '900' },
  description: {
    fontFamily: 'Merriweather_400Regular',
    color: '#ddd',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  heroButtons: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  button: {
    backgroundColor: '#f7cc53',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    elevation: 4,
  },
  buttonText: { color: '#002244', fontWeight: '700', fontSize: 16 },
  outlineBtn: {
    borderColor: '#f7cc53',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 8,
  },
  outlineText: { color: '#f7cc53', fontWeight: '700', fontSize: 16 },
  searchTitle: { fontFamily: 'Merriweather_700Bold', fontSize: 18, marginBottom: 10 },
  resultTitle: { fontFamily: 'Merriweather_700Bold', fontSize: 16, marginBottom: 4 },
  fallbackBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff1f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
  },
  fallbackTitle: { fontWeight: '800', marginBottom: 6, color: '#a8071a' },
  fallbackText: { color: '#5c0011' },
});
