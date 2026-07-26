// app/info/admissions-guide.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

/* ---------------- Theme tokens (aligned with “royal” palette) ---------------- */
const TOKENS = {
  light: {
    pageBg: '#f7f9ff',
    heroTop: '#eef4ff',
    heroBottom: '#ffffff',
    text: '#0b2a4a',
    subText: '#475569',
    cardBg: '#ffffff',
    softBg: '#f8fafc',
    stroke: '#e5e7eb',
    link: '#0b3b79',
    badgeBg: '#eef2ff',
    badgeBorder: '#c7d2fe',
    chipBg: '#f1f5f9',
    chipHover: '#e6effa',
    timeline: '#cfe0ff',
  },
  dark: {
    pageBg: '#0a0f1a',
    heroTop: '#0b2a4a',
    heroBottom: '#0a1830',
    text: '#e6ecff',
    subText: '#c9d7ff',
    cardBg: '#0f1422',
    softBg: '#10182a',
    stroke: '#1e2a3c',
    link: '#8ab4ff',
    badgeBg: '#122342',
    badgeBorder: '#1f3a65',
    chipBg: '#0f1b2e',
    chipHover: '#0d233f',
    timeline: '#214a86',
  },
};

export default function AdmissionsGuide() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  /* ---------------- Persisted theme (same "theme" key as app/index) ---------------- */
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('theme');
        if (saved) setIsDarkMode(saved === 'dark');
      } catch {}
    })();
  }, []);
  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try { await AsyncStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  const theme = isDarkMode ? TOKENS.dark : TOKENS.light;

  /* ---------------- Content ---------------- */
  const steps = useMemo(
    () => [
      {
        key: 'inspiration',
        title: 'Step 1 — Inspiration',
        desc:
          'Start your journey by exploring what it means to study in Korea: student life, types of universities, education system, and fields of study. Use KOEDU Bridge or StudyinKorea.go.kr for more insights.',
        icon: 'sparkles-outline',
      },
      {
        key: 'learn-uni',
        title: 'Step 2 — Learn more about the university',
        desc:
          'Check university websites or use KOEDU Bridge to find verified programs. Understand courses, requirements, tuition fees, and location.',
        icon: 'school-outline',
      },
      {
        key: 'application',
        title: 'Step 3 — The admissions application',
        desc:
          'Start your application directly on KOEDU Bridge. Submit personal info and documents, and pay application fees if required. We guide you through every step.',
        icon: 'document-text-outline',
      },
      {
        key: 'scholarships',
        title: 'Step 4 — Scholarships',
        desc:
          'Explore scholarships from Korean universities or government sources. We help you identify options that match your profile.',
        icon: 'card-outline',
      },
      {
        key: 'after-apply',
        title: 'Step 5 — After applying',
        desc:
          'Track your status from your KOEDU dashboard. Meanwhile, prepare translations, visa paperwork, or any additional steps.',
        icon: 'time-outline',
      },
      {
        key: 'results',
        title: 'Step 6 — Admissions results!',
        desc:
          'You’ll be notified by KOEDU when results are available. If admitted, congrats! Move on to the next administrative steps.',
        icon: 'trophy-outline',
      },
      {
        key: 'prepare-move',
        title: 'Step 7 — Preparing to move to Korea',
        desc:
          "Time to pack! KOEDU provides checklists, visa support, and pre-departure guidance so you're ready to begin your academic life in Korea.",
        icon: 'airplane-outline',
      },
    ],
    []
  );

  /* ---------------- Layout/scroll helpers ---------------- */
  const [offsets, setOffsets] = useState(Array(steps.length).fill(0));
  const [activeIndex, setActiveIndex] = useState(0);

  const setOffset = (index, y) =>
    setOffsets((prev) => {
      const next = [...prev];
      next[index] = y;
      return next;
    });

  const scrollToY = (y) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ y: Math.max(0, y - 10), animated: true });
  };

  const scrollToStep = (index) => {
    const y = offsets[index] ?? 0;
    scrollToY(y);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#step-${index + 1}`);
    }
    setActiveIndex(index);
  };

  const goPrev = () => activeIndex > 0 && scrollToStep(activeIndex - 1);
  const goNext = () => activeIndex < steps.length - 1 && scrollToStep(activeIndex + 1);
  const scrollToTop = () => scrollToY(0);

  // Deep-linking: ?step=3 or #step-3
  useEffect(() => {
    const q = params?.step ? Number(params.step) : NaN;
    let initial = Number.isFinite(q) && q >= 1 && q <= steps.length ? q : null;
    if (!initial && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/step-(\d+)/i);
      const n = m ? parseInt(m[1], 10) : NaN;
      if (Number.isFinite(n) && n >= 1 && n <= steps.length) initial = n;
    }
    if (initial) {
      const t = setTimeout(() => scrollToStep(initial - 1), 120);
      return () => clearTimeout(t);
    }
  }, [params?.step, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[styles.container, { backgroundColor: theme.pageBg }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* space for the fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* ---------------- HERO ---------------- */}
      <LinearGradient
        colors={[theme.heroTop, theme.heroBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { borderColor: theme.stroke, backgroundColor: theme.cardBg }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={18} color={theme.link} />
            <Text style={[styles.backText, { color: theme.link }]}>Back</Text>
          </TouchableOpacity>

          {/* Light Mode Switch (ON = Light) */}
          <View style={styles.switchWrap}>
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={18}
              color={isDarkMode ? '#e6ecff' : '#0b2a4a'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.switchLabel, { color: isDarkMode ? '#e6ecff' : '#0b2a4a' }]}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
              value={!isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#94a3b8', true: '#c7d2fe' }}
              thumbColor="#ffffff"
              ios_backgroundColor="rgba(255,255,255,0.25)"
            />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Your Admissions Journey with KOEDU Bridge
        </Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          A step-by-step guide to help you from start to finish.
        </Text>

        {/* Hero image */}
        <View
          style={[
            styles.imageWrapper,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.stroke,
              shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/student-travel.webp')}
            style={styles.image}
          />
        </View>
      </LinearGradient>

      {/* ---------------- Sticky Overview ---------------- */}
      <View
        style={[
          styles.contentBox,
          {
            backgroundColor: theme.chipBg,
            borderColor: theme.stroke,
            ...(Platform.OS === 'web'
              ? { backdropFilter: 'saturate(1.15) blur(8px)' }
              : null),
          },
        ]}
      >
        <Text style={[styles.contentTitle, { color: theme.text }]}>📘 Content Overview</Text>

        <View style={styles.tocGrid}>
          {steps.map((s, index) => {
            const active = activeIndex === index;
            return (
              <Pressable
                key={s.key}
                onPress={() => scrollToStep(index)}
                style={({ pressed }) => [
                  styles.tocItem,
                  {
                    backgroundColor: active ? theme.badgeBg : theme.chipBg,
                    borderColor: active ? theme.badgeBorder : theme.stroke,
                  },
                  pressed && { backgroundColor: theme.chipHover },
                ]}
              >
                <Ionicons
                  name={s.icon}
                  size={16}
                  color={active ? theme.link : theme.subText}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.contentLink,
                    { color: active ? theme.link : theme.text },
                  ]}
                  numberOfLines={1}
                >
                  Step {index + 1}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ---------------- Intro lead ---------------- */}
      <View style={[styles.introWrapper, { backgroundColor: theme.cardBg, borderColor: theme.stroke }]}>
        <Text style={[styles.intro, { color: theme.subText }]}>
          <Text style={{ fontWeight: '800', color: theme.text }}>Studying in Korea</Text>
          {'\n'}
          Navigating your way through the process can feel overwhelming at first. This
          guide shows what to do, when to do it, and where to find the right information.
          With KOEDU Bridge, you’re never alone.
        </Text>
      </View>

      {/* ---------------- Timeline Steps ---------------- */}
      <View style={[styles.timeline, { borderLeftColor: theme.timeline }]}>
        {steps.map((s, index) => (
          <View
            key={s.key}
            onLayout={(e) => setOffset(index, e.nativeEvent.layout.y)}
            style={[styles.step, { backgroundColor: theme.softBg, borderColor: theme.stroke }]}
          >
            <View style={[styles.dotWrap, { backgroundColor: theme.pageBg, borderColor: theme.timeline }]}>
              <View style={[styles.dot, { backgroundColor: theme.link }]} />
            </View>

            <View style={styles.stepTextWrap}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>
                {s.title}
              </Text>
              <Text style={[styles.stepDesc, { color: theme.subText }]}>
                {s.desc}
              </Text>

              <View style={styles.stepNavRow}>
                <Pressable
                  onPress={goPrev}
                  disabled={index === 0}
                  style={[
                    styles.pill,
                    { borderColor: theme.stroke, backgroundColor: theme.cardBg },
                    index === 0 && { opacity: 0.45 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Previous step"
                >
                  <Ionicons name="chevron-back" size={16} color={theme.text} />
                  <Text style={{ color: theme.text }}>Previous</Text>
                </Pressable>

                <Pressable
                  onPress={goNext}
                  disabled={index === steps.length - 1}
                  style={[
                    styles.pill,
                    { borderColor: theme.stroke, backgroundColor: theme.cardBg },
                    index === steps.length - 1 && { opacity: 0.45 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Next step"
                >
                  <Text style={{ color: theme.text }}>Next</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.text} />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Back to top */}
      <TouchableOpacity
        style={[
          styles.topBtn,
          { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
        ]}
        onPress={scrollToTop}
        accessibilityRole="button"
        accessibilityLabel="Back to top"
      >
        <Ionicons name="arrow-up" size={18} color={theme.link} />
        <Text style={[styles.topText, { color: theme.link }]}>Back to Top</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========================= Styles ========================= */
const styles = StyleSheet.create({
  container: {
    paddingBottom: 28,
  },

  /* HERO */
  hero: {
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  backText: { fontSize: 15, fontWeight: '800' },
  switchWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  switchLabel: { fontWeight: '700', marginRight: 6 },

  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.95,
    marginTop: 4,
  },

  imageWrapper: {
    alignSelf: 'center',
    width: '88%',
    maxWidth: 1100,
    aspectRatio: 1.7,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },

  /* Overview */
  contentBox: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    ...Platform.select({
      web: { position: 'sticky', top: 0, zIndex: 5 },
    }),
  },
  contentTitle: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  tocGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  contentLink: { fontSize: 14, fontWeight: '700' },

  /* Intro */
  introWrapper: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  intro: { fontSize: 16, lineHeight: 24, textAlign: 'left' },

  /* Timeline */
  timeline: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingLeft: 14,
    borderLeftWidth: 3,
  },
  step: {
    position: 'relative',
    marginBottom: 18,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  dotWrap: {
    position: 'absolute',
    left: -22,
    top: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stepTextWrap: { paddingLeft: 2 },
  stepTitle: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  stepDesc: { fontSize: 15, lineHeight: 22 },

  /* Step nav */
  stepNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  /* Back to top */
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 34,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  topText: { marginLeft: 6, fontSize: 14, fontWeight: '800' },
});
