// app/info/application-steps.js (or wherever you placed it)
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer'; // keep/remove depending on your layout

/* ---------- Theme tokens ---------- */
const TOKENS = {
  light: {
    pageBg: '#f7f9ff',
    heroTop: '#eef4ff',
    heroBottom: '#ffffff',
    text: '#0b2a4a',
    subText: '#475569',
    surface: '#ffffff',
    soft: '#f8fafc',
    stroke: '#e5e7eb',
    link: '#0b3b79',
    chipBg: '#eef2ff',
    chipBorder: '#c7d2fe',
    timeline: '#cfe0ff',
    accent: '#0b3b79',
  },
  dark: {
    pageBg: '#0a0f1a',
    heroTop: '#0b2a4a',
    heroBottom: '#0a1830',
    text: '#e6ecff',
    subText: '#c9d7ff',
    surface: '#0f1422',
    soft: '#10182a',
    stroke: '#1e2a3c',
    link: '#8ab4ff',
    chipBg: '#122342',
    chipBorder: '#1f3a65',
    timeline: '#214a86',
    accent: '#3b82f6',
  },
};

export default function ApplicationSteps() {
  const router = useRouter();

  // Persisted theme toggle
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('theme');
        if (saved) setIsDark(saved === 'dark');
      } catch {}
    })();
  }, []);
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try { await AsyncStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };
  const t = useMemo(() => (isDark ? TOKENS.dark : TOKENS.light), [isDark]);

  const steps = [
    { key: 'check', title: 'Application completeness check', desc: 'The admissions office verifies your form, fees, and whether all files are readable and signed.', tip: 'Double-check uploads are clear PDFs. If a file is missing, upload promptly to avoid delays.' },
    { key: 'eligibility', title: 'Eligibility screening', desc: 'Basic criteria such as degree level, GPA format, language certificates, and nationality rules are confirmed.', tip: 'Prepare official translations/apostilles if your country requires them and keep receipts handy.' },
    { key: 'dept', title: 'Department review', desc: 'Faculty review your academic fit (courses, GPA trend, portfolio/research exposure).', tip: 'Update your portfolio or research summary. If optional, submit anyway—strong context helps.' },
    { key: 'interview', title: 'Interview / additional checks', desc: 'Some majors schedule interviews, tests, or portfolio defenses.', tip: 'Test your mic/camera, prepare a 1-minute intro, and keep time zones straight.' },
    { key: 'committee', title: 'Final committee decision', desc: 'Admissions committee consolidates scores and confirms admitted/waitlisted/denied.', tip: 'If asked for extra info (funding proof, passport page), respond within 24–48 hours.' },
    { key: 'results', title: 'Official results & next steps', desc: 'Results are posted; admitted students proceed with tuition deposit, visa (D-2), and housing.', tip: 'Start visa docs early, book housing, and check orientation/arrival dates.' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: t.pageBg }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HeaderSpacer height={56} extra={8} />

      <View style={styles.centerWrap}>
        {/* TOP ROW: Return button + Theme switch */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { backgroundColor: t.surface, borderColor: t.stroke },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={18} color={t.link} />
            <Text style={[styles.backText, { color: t.link }]}>Back</Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: t.text }]}>{isDark ? 'Dark' : 'Light'} Mode</Text>
            <Switch
              value={!isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#94a3b8', true: '#c7d2fe' }}
              thumbColor="#ffffff"
              ios_backgroundColor="rgba(255,255,255,0.25)"
            />
          </View>
        </View>

        {/* Breadcrumbs */}
        <View
          style={[
            styles.breadcrumbs,
            { backgroundColor: t.chipBg, borderColor: t.chipBorder },
          ]}
        >
          <Text style={[styles.breadcrumb, { color: t.subText }]}>
            Startpage  ›  Find out more…  ›  What happens between the application deadline and admissions results?
          </Text>
        </View>

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: t.surface, borderColor: t.stroke }]}>
          <Text style={[styles.title, { color: t.text }]}>
            What happens between{'\n'}
            <Text style={[styles.titleHighlight, { color: t.link }]}>
              application deadline and admissions results?
            </Text>
          </Text>
          <Text style={[styles.subtitle, { color: t.subText }]}>
            There are several steps and decisions that are made during the processing of your admissions application.
            Find out more about them — and what you can do after each one.
          </Text>

          <View style={[styles.imageWrap, { borderColor: t.stroke }]}>
            <ImageBackground
              source={require('../../assets/images/students-talking.jpg')}
              style={styles.heroImage}
              imageStyle={{ borderRadius: 12 }}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
            </ImageBackground>
          </View>
        </View>

        {/* Timeline */}
        <View style={[styles.timeline, { borderLeftColor: t.timeline }]}>
          {steps.map((s) => (
            <View
              key={s.key}
              style={[
                styles.stepCard,
                { backgroundColor: t.soft, borderColor: t.stroke },
              ]}
            >
              <View style={[styles.dotWrap, { backgroundColor: t.pageBg, borderColor: t.timeline }]}>
                <View style={[styles.dot, { backgroundColor: t.accent }]} />
              </View>

              <Text style={[styles.stepTitle, { color: t.text }]}>{s.title}</Text>
              <Text style={[styles.stepDesc, { color: t.subText }]}>{s.desc}</Text>
              <View style={[styles.tipBox, { backgroundColor: t.surface, borderColor: t.stroke }]}>
                <Text style={[styles.tipLead, { color: t.link }]}>What you can do</Text>
                <Text style={[styles.tipText, { color: t.subText }]}>{s.tip}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={[styles.cta, { backgroundColor: t.surface, borderColor: t.stroke }]}>
          <Text style={[styles.ctaTitle, { color: t.text }]}>Want a personalized checklist?</Text>
          <Text style={[styles.ctaSub, { color: t.subText }]}>
            Get a document list and reminders based on your target intake and program.
          </Text>
          <View style={styles.ctaRow}>
            <Pressable
              onPress={() => {}}
              style={[styles.btn, styles.btnPrimary, { backgroundColor: t.accent, borderColor: t.accent }]}
            >
              <Text style={styles.btnPrimaryText}>Create my plan</Text>
            </Pressable>
            <Pressable
              onPress={() => {}}
              style={[styles.btn, styles.btnGhost, { borderColor: t.stroke }]}
            >
              <Text style={[styles.btnGhostText, { color: t.link }]}>Browse programs</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { paddingBottom: 36 },
  centerWrap: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  /* Top row with back + theme */
  topRow: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  backText: { fontWeight: '800' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { fontWeight: '700' },

  // Breadcrumbs
  breadcrumbs: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  breadcrumb: { fontSize: 12 },

  // Hero
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },
  title: { fontSize: 26, fontWeight: '900', lineHeight: 32, textAlign: 'center' },
  titleHighlight: { textDecorationLine: 'underline' },
  subtitle: { marginTop: 6, fontSize: 15.5, lineHeight: 22, textAlign: 'center', opacity: 0.98 },
  imageWrap: {
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  heroImage: { width: '100%', height: 230 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' },

  // Timeline
  timeline: { borderLeftWidth: 3, paddingLeft: 16, marginTop: 8 },
  stepCard: { position: 'relative', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 },
  dotWrap: {
    position: 'absolute',
    left: -24,
    top: 18,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  stepTitle: { fontSize: 16.5, fontWeight: '900', marginBottom: 4 },
  stepDesc: { fontSize: 14.5, lineHeight: 21, opacity: 0.98 },

  tipBox: { borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 10 },
  tipLead: { fontWeight: '800', marginBottom: 4, fontSize: 13.5 },
  tipText: { fontSize: 14, lineHeight: 20 },

  // CTA
  cta: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  ctaTitle: { fontSize: 18, fontWeight: '900', textAlign: 'center' },
  ctaSub: { marginTop: 4, textAlign: 'center' },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  btn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1 },
  btnPrimary: {},
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff' },
  btnGhostText: { fontWeight: '800' },
});
