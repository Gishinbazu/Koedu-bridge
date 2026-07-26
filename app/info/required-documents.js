// app/info/required-docs.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer';

/* --- Theme tokens (aligned with “royal” palette) --- */
const TOKENS = {
  light: {
    pageBg: '#f7f9ff',
    heroTop: '#eef4ff',
    heroBottom: '#ffffff',
    text: '#0b2a4a',
    subText: '#475569',
    stroke: '#e5e7eb',
    cardBg: '#ffffff',
    softBg: '#f8fafc',
    link: '#0b3b79',
    chipBg: '#eef2ff',
    chipBorder: '#c7d2fe',
    accent: '#0b3b79',
  },
  dark: {
    pageBg: '#0a0f1a',
    heroTop: '#0b2a4a',
    heroBottom: '#0a1830',
    text: '#e6ecff',
    subText: '#c9d7ff',
    stroke: '#1e2a3c',
    cardBg: '#0f1422',
    softBg: '#10182a',
    link: '#8ab4ff',
    chipBg: '#122342',
    chipBorder: '#1f3a65',
    accent: '#3b82f6',
  },
};

export default function RequiredDocuments() {
  const router = useRouter();

  // Persisted theme (same key as your other pages)
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('theme');
        if (saved) setIsDarkMode(saved === 'dark');
      } catch {}
    })();
  }, []);

  const theme = useMemo(() => (isDarkMode ? TOKENS.dark : TOKENS.light), [isDarkMode]);

  // Document groups
  const groups = [
    {
      title: 'Identity & Profile',
      items: [
        { text: 'Passport (valid for at least 6–12 months)', icon: 'id-card-outline' },
        { text: 'ID photo (passport-style, recent)', icon: 'image-outline' },
        { text: 'Curriculum Vitae (CV) / Resume', icon: 'document-text-outline', hint: 'Recommended' },
      ],
    },
    {
      title: 'Academic Records',
      items: [
        { text: 'Official transcripts (sealed or e-sent)', icon: 'school-outline' },
        { text: 'Degree certificate / proof of graduation', icon: 'ribbon-outline' },
        { text: 'Enrollment certificate (if final semester)', icon: 'document-attach-outline', hint: 'If applicable' },
      ],
    },
    {
      title: 'Language & Tests',
      items: [
        { text: 'English test score (TOEFL/IELTS/Duolingo)', icon: 'chatbubble-ellipses-outline', hint: 'If required' },
        { text: 'TOPIK score (for Korean-medium programs)', icon: 'language-outline', hint: 'If applicable' },
        { text: 'Major-specific tests/portfolio (e.g., Art/Design)', icon: 'brush-outline', hint: 'If applicable' },
      ],
    },
    {
      title: 'Financial & Support',
      items: [
        { text: 'Bank balance / Financial statement', icon: 'card-outline' },
        { text: 'Sponsor letter (parent/self/company)', icon: 'person-outline', hint: 'If applicable' },
        { text: 'Scholarship confirmation (if awarded)', icon: 'pricetag-outline', hint: 'If applicable' },
      ],
    },
    {
      title: 'Statements & Letters',
      items: [
        { text: 'Statement of Purpose / Study Plan', icon: 'create-outline' },
        { text: '2× Recommendation letters', icon: 'mail-open-outline' },
        { text: 'Research proposal (for thesis tracks)', icon: 'flask-outline', hint: 'If applicable' },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.pageBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* space for fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO */}
      <LinearGradient
        colors={[theme.heroTop, theme.heroBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.heroTopRow, { justifyContent: 'flex-start' }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { borderColor: theme.stroke, backgroundColor: theme.cardBg }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={18} color={theme.link} />
            <Text style={[styles.backText, { color: theme.link }]}>Back</Text>
          </Pressable>
        </View>

        {/* Breadcrumbs */}
        <View style={[styles.crumbs, { borderColor: theme.stroke, backgroundColor: theme.cardBg }]}>
          <Ionicons name="trail-sign-outline" size={14} color={theme.link} style={{ marginRight: 6 }} />
          <Text style={[styles.crumbText, { color: theme.subText }]}>
            Startpage {'>'} Find out more... {'>'}{' '}
            <Text style={{ color: theme.link, fontWeight: '800' }}>Required documents for application</Text>
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Find out what you need{' '}
          <Text style={{ color: theme.accent, textDecorationLine: 'underline' }}>to submit</Text>
        </Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Learn which documents you’ll need to complete your master’s application.
        </Text>

        <View
          style={[
            styles.heroImageWrap,
            { borderColor: theme.stroke, backgroundColor: theme.cardBg, shadowOpacity: Platform.OS === 'ios' ? 0.18 : 0 },
          ]}
        >
          <Image source={require('../../assets/images/required-docs.jpg')} style={styles.heroImage} />
        </View>
      </LinearGradient>

      {/* INFO BANNER */}
      <View style={[styles.banner, { backgroundColor: theme.softBg, borderColor: theme.stroke }]}>
        <Ionicons name="information-circle-outline" size={18} color={theme.accent} />
        <Text style={[styles.bannerText, { color: theme.subText }]}>
          Some documents may require <Text style={{ fontWeight: '800', color: theme.text }}>official translation</Text>,{' '}
          <Text style={{ fontWeight: '800', color: theme.text }}>notarization/apostille</Text>, or{' '}
          <Text style={{ fontWeight: '800', color: theme.text }}>consular legalization</Text>, depending on your
          country.
        </Text>
      </View>

      {/* GROUPS */}
      {groups.map((g) => (
        <View key={g.title} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.stroke }]}>
          <Text style={[styles.groupTitle, { color: theme.text }]}>{g.title}</Text>
          <View style={{ marginTop: 8 }}>
            {g.items.map((it, idx) => (
              <View key={`${g.title}-${idx}`} style={styles.docRow}>
                <View style={[styles.bulletIcon, { backgroundColor: theme.chipBg, borderColor: theme.chipBorder }]}>
                  <Ionicons name={it.icon} size={14} color={theme.link} />
                </View>
                <Text style={[styles.docText, { color: theme.subText }]}>
                  <Text style={{ color: theme.text, fontWeight: '700' }}>{it.text.split(':')[0]}</Text>
                  {it.text.includes(':') ? `:${it.text.split(':').slice(1).join(':')}` : ''}
                  {it.hint ? <Text style={[styles.hint, { color: theme.link }]}> — {it.hint}</Text> : null}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* CTA */}
      <View style={[styles.cta, { backgroundColor: theme.cardBg, borderColor: theme.stroke }]}>
        <Text style={[styles.ctaTitle, { color: theme.text }]}>Ready to apply?</Text>
        <Text style={[styles.ctaSub, { color: theme.subText }]}>
          Create an account and get a personalized checklist based on your intake and country.
        </Text>
        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => router.push('/auth/signup')}
            style={[styles.btn, { backgroundColor: theme.accent, borderColor: theme.accent }]}
          >
            <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
            <Text style={styles.btnPrimaryText}>Start application</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/info/faq')}
            style={[styles.btn, { backgroundColor: theme.cardBg, borderColor: theme.stroke }]}
          >
            <Ionicons name="help-circle-outline" size={16} color={theme.accent} />
            <Text style={[styles.btnGhostText, { color: theme.accent }]}>Read FAQs</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer note */}
      <Text style={[styles.footer, { color: theme.subText }]}>
        Need help? Email us at{' '}
        <Text style={{ color: '#0ea5e9', textDecorationLine: 'underline' }}>koedu.bridge.help@gmail.com</Text>
      </Text>
    </ScrollView>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 1100,
  },

  hero: {
    marginBottom: 12,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center' },
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

  crumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 10,
  },
  crumbText: { fontSize: 12 },

  title: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 12 },
  subtitle: { textAlign: 'center', marginTop: 4, opacity: 0.95 },

  heroImageWrap: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 1080,
    aspectRatio: 1.75,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  banner: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  bannerText: { flex: 1, lineHeight: 20 },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
      android: { elevation: 1 },
    }),
  },
  groupTitle: { fontSize: 18, fontWeight: '900' },
  docRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 8 },
  bulletIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  docText: { flex: 1, lineHeight: 22 },
  hint: { fontStyle: 'italic' },

  cta: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
      android: { elevation: 1 },
    }),
  },
  ctaTitle: { fontSize: 20, fontWeight: '900' },
  ctaSub: { marginTop: 2 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  btn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhostText: { fontWeight: '800' },

  footer: { marginTop: 16, fontStyle: 'italic', fontSize: 12, textAlign: 'center' },
});
