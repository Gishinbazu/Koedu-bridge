// app/info/admissions-guide.js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdmissionsGuide() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollRef = useRef(null);

  // ---- Content ----
  const steps = useMemo(
    () => [
      {
        key: 'inspiration',
        title: 'Step 1 — Inspiration',
        desc:
          'Start your journey by exploring what it means to study in Korea: student life, types of universities, education system, and fields of study. Use KOEDU Bridge or StudyinKorea.go.kr for more insights.',
      },
      {
        key: 'learn-uni',
        title: 'Step 2 — Learn more about the university',
        desc:
          'Check university websites or use KOEDU Bridge to find verified programs. Understand courses, requirements, tuition fees, and location.',
      },
      {
        key: 'application',
        title: 'Step 3 — The admissions application',
        desc:
          'Start your application directly on KOEDU Bridge. Submit personal info and documents, and pay application fees if required. We guide you through every step.',
      },
      {
        key: 'scholarships',
        title: 'Step 4 — Scholarships',
        desc:
          'Explore scholarships from Korean universities or government sources. We help you identify options that match your profile.',
      },
      {
        key: 'after-apply',
        title: 'Step 5 — After applying',
        desc:
          'Track your status from your KOEDU dashboard. Meanwhile, prepare translations, visa paperwork, or any additional steps.',
      },
      {
        key: 'results',
        title: 'Step 6 — Admissions results!',
        desc:
          'You’ll be notified by KOEDU when results are available. If admitted, congrats! Move on to the next administrative steps.',
      },
      {
        key: 'prepare-move',
        title: 'Step 7 — Preparing to move to Korea',
        desc:
          "Time to pack! KOEDU provides checklists, visa support, and pre-departure guidance so you're ready to begin your academic life in Korea.",
      },
    ],
    []
  );

  // ---- Layout/scroll helpers ----
  // We'll store each step's vertical offset captured via onLayout.
  const [offsets, setOffsets] = useState(Array(steps.length).fill(0));
  const setOffset = (index, y) =>
    setOffsets((prev) => {
      const next = [...prev];
      next[index] = y;
      return next;
    });

  const scrollToY = (y) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ y: Math.max(0, y - 8), animated: true });
  };

  const scrollToStep = (index) => {
    const y = offsets[index] ?? 0;
    scrollToY(y);
    // Update hash on web for shareable deep link
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#step-${index + 1}`);
    }
    setActiveIndex(index);
  };

  const scrollToTop = () => scrollToY(0);

  // Active step for Next/Previous helpers
  const [activeIndex, setActiveIndex] = useState(0);
  const goPrev = () => activeIndex > 0 && scrollToStep(activeIndex - 1);
  const goNext = () => activeIndex < steps.length - 1 && scrollToStep(activeIndex + 1);

  // Handle deep-linking: ?step=3 or #step-3
  useEffect(() => {
    // from query param
    const q = params?.step ? Number(params.step) : NaN;
    let initial = Number.isFinite(q) && q >= 1 && q <= steps.length ? q : null;

    // from hash on web
    if (!initial && Platform.OS === 'web' && typeof window !== 'undefined') {
      const m = String(window.location.hash || '').match(/step-(\d+)/i);
      const n = m ? parseInt(m[1], 10) : NaN;
      if (Number.isFinite(n) && n >= 1 && n <= steps.length) {
        initial = n;
      }
    }

    if (initial) {
      // Wait a tick so onLayout has a chance to run
      const t = setTimeout(() => scrollToStep(initial - 1), 120);
      return () => clearTimeout(t);
    }
  }, [params?.step, steps.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={22} color="#0b3b79" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Your Admissions Journey with KOEDU Bridge</Text>
      <Text style={styles.subtitle}>A step-by-step guide to help you from start to finish.</Text>

      {/* Lead */}
      <View style={styles.introWrapper}>
        <Text style={styles.intro}>
          <Text style={{ fontWeight: 'bold' }}>Studying in Korea</Text>
          {'\n'}
          Navigating your way through the process can feel overwhelming at first. This guide shows what to do, when to do it, and where to find the right information. With KOEDU Bridge, you’re never alone.
        </Text>
      </View>

      {/* Hero image */}
      <View style={styles.imageWrapper}>
        <Image source={require('../../assets/images/student-travel.webp')} style={styles.image} />
      </View>

      {/* Sticky (web) Content Overview */}
      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>📘 Content Overview</Text>
        {steps.map((s, index) => (
          <Pressable
            key={s.key}
            onPress={() => scrollToStep(index)}
            style={({ pressed }) => [styles.contentLinkWrapper, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Go to ${s.title}`}
          >
            <Text style={styles.contentLink}>• Step {index + 1} — {s.title.replace(/^Step \\d+ — /, '')}</Text>
          </Pressable>
        ))}
      </View>

      {/* Steps */}
      {steps.map((s, index) => (
        <View
          key={s.key}
          onLayout={(e) => setOffset(index, e.nativeEvent.layout.y)}
          style={styles.step}
        >
          <Text style={styles.stepTitle}>{s.title}</Text>
          <Text style={styles.stepDesc}>{s.desc}</Text>

          <View style={styles.stepNavRow}>
            <Pressable
              onPress={goPrev}
              disabled={index === 0}
              style={[styles.pill, index === 0 && styles.pillDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Previous step"
            >
              <Ionicons name="chevron-back" size={16} color="#0f172a" />
              <Text>Previous</Text>
            </Pressable>

            <Pressable
              onPress={goNext}
              disabled={index === steps.length - 1}
              style={[styles.pill, index === steps.length - 1 && styles.pillDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Next step"
            >
              <Text>Next</Text>
              <Ionicons name="chevron-forward" size={16} color="#0f172a" />
            </Pressable>
          </View>
        </View>
      ))}

      {/* Back to top */}
      <TouchableOpacity style={styles.topBtn} onPress={scrollToTop} accessibilityRole="button" accessibilityLabel="Back to top">
        <Ionicons name="arrow-up" size={18} color="#0b3b79" />
        <Text style={styles.topText}>Back to Top</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========================= Styles ========================= */
const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  // Back link
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  backText: { fontSize: 16, color: '#0b3b79', marginLeft: 6, fontWeight: '700' },

  // Headings
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0b3b79',
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 22,
    textAlign: 'center',
    alignSelf: 'center',
  },

  // Lead
  introWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
    maxWidth: 1100,
  },
  intro: { fontSize: 18, color: '#334155', lineHeight: 26, textAlign: 'left' },

  // Hero image
  imageWrapper: {
    width: '68%',
    aspectRatio: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 22,
    alignSelf: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Overview
  contentBox: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1100,
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky',
          top: 0,
          zIndex: 5,
          backdropFilter: 'saturate(1.2) blur(6px)',
          borderWidth: 1,
          borderColor: '#e2e8f0',
        }
      : null),
  },
  contentTitle: { fontSize: 20, fontWeight: '800', color: '#0b3b79', marginBottom: 8 },
  contentLinkWrapper: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  pressed: { backgroundColor: '#e6effa' },
  contentLink: { fontSize: 16, color: '#0b3b79' },

  // Step
  step: {
    marginBottom: 22,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1100,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  stepTitle: { fontSize: 22, fontWeight: '800', color: '#0b3b79', marginBottom: 6, textAlign: 'left' },
  stepDesc: { fontSize: 16, color: '#334155', lineHeight: 24, textAlign: 'left' },

  // Step nav
  stepNavRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  pillDisabled: { opacity: 0.45 },

  // Back to top
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    alignSelf: 'center',
    backgroundColor: '#eef2ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  topText: { marginLeft: 6, color: '#0b3b79', fontSize: 14, fontWeight: '700' },
});
