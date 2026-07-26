// app/info/about.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

/** Minimal tokens (aligned to the “royal” scheme used on app/index) */
const TOKENS = {
  light: {
    pageBg: '#ffffff',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    text: '#1f2937',
    subText: '#475569',
    h2: '#0b2a4a',
    bold: '#0b2a4a',
    heroGrad: ['#eef4ff', '#ffffff'],
    backText: '#0b2a4a',
    backBg: 'rgba(11,42,74,0.06)',
    backBorder: 'rgba(11,42,74,0.12)',
  },
  dark: {
    pageBg: '#0f1220',
    cardBg: '#0f1422',
    cardBorder: '#1f2a3a',
    text: '#e6ecff',
    subText: '#c9d7ff',
    h2: '#d6e3ff',
    bold: '#d6e3ff',
    heroGrad: ['#0b3b79', '#0b2a4a'],
    backText: '#E6F0FF',
    backBg: 'rgba(255,255,255,0.06)',
    backBorder: 'rgba(255,255,255,0.25)',
  },
};

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 520;

  // Persisted app-wide theme (same key as app/index)
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
    try {
      await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  // Centered max width
  const MAX_WIDTH = width >= 1200 ? 1100 : width >= 900 ? 980 : 820;

  const sizes = useMemo(
    () => ({
      pad: isSmall ? 16 : 24,
      radius: isSmall ? 14 : 18,
      title: isSmall ? 26 : 32,
      h2: isSmall ? 18 : 22,
      p: isSmall ? 15 : 16,
    }),
    [isSmall]
  );

  const theme = isDarkMode ? TOKENS.dark : TOKENS.light;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingVertical: sizes.pad * 2, backgroundColor: theme.pageBg },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Centered max-width wrapper */}
      <View
        style={[
          styles.centerWrap,
          { maxWidth: MAX_WIDTH, paddingHorizontal: sizes.pad },
        ]}
      >
        {/* Space for fixed TopNavbar */}
        <HeaderSpacer height={56} extra={8} />

        {/* HERO */}
        <View style={[styles.hero, { borderRadius: sizes.radius }]}>
          <LinearGradient
            colors={theme.heroGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: sizes.radius }]}
          />

          {/* Top row: Back + Theme switch */}
          <View style={[styles.heroTopRow, styles.heroTopRowLayout]}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [
                styles.backBtn,
                {
                  borderRadius: 999,
                  backgroundColor: theme.backBg,
                  borderColor: theme.backBorder,
                },
                pressed && { opacity: 0.9, transform: [{ translateY: 1 }] },
              ]}
              hitSlop={10}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={theme.backText}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.backBtnText, { color: theme.backText }]}>
                Back
              </Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={18}
                color={isDarkMode ? '#E6F0FF' : '#0b2a4a'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.switchLabel,
                  { color: isDarkMode ? '#E6F0FF' : '#0b2a4a' },
                ]}
              >
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Switch
                value={!isDarkMode} // ON = Light
                onValueChange={toggleTheme}
                trackColor={{ false: '#94a3b8', true: '#c7d2fe' }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(255,255,255,0.25)"
              />
            </View>
          </View>

          <View style={styles.heroBody}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.h2,
                  fontSize: sizes.title,
                  lineHeight: sizes.title + 6,
                },
              ]}
            >
              About KOEDU Bridge
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.subText, fontSize: sizes.p, opacity: 0.95 },
              ]}
            >
              A trusted pathway for international students to study in Korea —
              transparent, fast, and student-first.
            </Text>
          </View>
        </View>

        {/* CARDS */}
        <View style={styles.cardsWrap}>
          <Card sizes={sizes} title="🌍 Our Mission" theme={theme}>
            <Text style={[styles.p, { fontSize: sizes.p, color: theme.text }]}>
              KOEDU Bridge exists to simplify the journey of international
              students aspiring to study in Korea. We believe in transparent,
              student-centered services that remove barriers between global
              talent and quality Korean higher education.
            </Text>
          </Card>

          <Card sizes={sizes} title="📘 What We Offer" theme={theme}>
            <Bullet
              text="Search and compare verified university programs (Bachelor’s, Master’s, Language courses)"
              theme={theme}
            />
            <Bullet
              text="Clear details on tuition, deadlines, and entry requirements"
              theme={theme}
            />
            <Bullet
              text="Online application with progress tracking"
              theme={theme}
            />
            <Bullet
              text="Help guides, FAQs, and support in English and French"
              theme={theme}
            />
          </Card>

          <Card sizes={sizes} title="💡 Why KOEDU?" theme={theme}>
            <Text style={[styles.p, { fontSize: sizes.p, color: theme.text }]}>
              Built by students and educators who understand real challenges of
              studying abroad. Our platform connects ambition with opportunity —
              without confusion, without scams, and with professional support
              every step of the way.
            </Text>
          </Card>

          <Card sizes={sizes} title="🤝 Our Values" theme={theme}>
            <TagRow
              items={[
                'Transparency',
                'Accessibility',
                'Student Empowerment',
                'Cultural Exchange',
              ]}
              theme={theme}
            />
          </Card>

          <Card sizes={sizes} title="📫 Contact" theme={theme}>
            <Text style={[styles.p, { fontSize: sizes.p, color: theme.text }]}>
              Questions? Reach out via our contact form or email{' '}
              <Text style={[styles.bold, { color: theme.bold }]}>
                support@koedu.kr
              </Text>
              .
            </Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- Small building blocks ---------- */

function Card({ title, sizes, children, theme }) {
  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: sizes.radius,
          padding: sizes.pad,
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <Text style={[styles.h2, { fontSize: sizes.h2, color: theme.h2 }]}>
        {title}
      </Text>
      <View style={{ height: 6 }} />
      {children}
    </View>
  );
}
Card.propTypes = {
  title: PropTypes.string.isRequired,
  sizes: PropTypes.shape({
    pad: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    h2: PropTypes.number.isRequired,
    p: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.node,
  theme: PropTypes.object.isRequired,
};

function Bullet({ text, theme }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name="checkmark-circle" size={18} color="#10b981" />
      <Text style={[styles.bulletText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}
Bullet.propTypes = {
  text: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
};

function TagRow({ items }) {
  const chipBg = 'rgba(16,185,129,0.08)';
  const chipBorder = 'rgba(16,185,129,0.25)';
  const chipText = '#065f46';
  return (
    <View style={styles.tagRow}>
      {items.map((t) => (
        <View
          key={t}
          style={[
            styles.tagChip,
            { backgroundColor: chipBg, borderColor: chipBorder },
          ]}
        >
          <Text style={[styles.tagText, { color: chipText }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}
TagRow.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  centerWrap: { width: '100%', alignSelf: 'center' },

  /* Hero */
  hero: {
    overflow: 'hidden',
    paddingBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  heroTopRow: { paddingHorizontal: 12, paddingTop: 12 },
  heroTopRowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  backBtnText: { fontWeight: '700', letterSpacing: 0.2 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  switchLabel: { fontWeight: '700', marginRight: 6 },

  heroBody: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: { marginTop: 8, textAlign: 'center', maxWidth: 720 },

  /* Cards */
  cardsWrap: { gap: 14, marginTop: 16 },
  card: {
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 1 },
    }),
  },
  h2: { fontWeight: '800' },
  p: { lineHeight: 24 },
  bold: { fontWeight: '700' },

  /* Bullets */
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletText: { flex: 1, lineHeight: 22 },

  /* Tags */
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: { fontWeight: '700', fontSize: 13 },
});
