// components/Footer.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions
} from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * KOEDU Bridge Footer
 * - Responsive layout
 * - Internal routes use expo-router
 * - External URLs use Linking
 * - Dark-first theme
 */
export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();

  const C = useMemo(() => getColors(scheme), [scheme]);

  // Responsive columns
  const cols = width >= 1200 ? 4 : width >= 900 ? 3 : width >= 680 ? 2 : 1;
  const colBasis =
    cols === 4 ? '23%' :
    cols === 3 ? '31%' :
    cols === 2 ? '48%' :
    '100%';

  const handleSubscribe = () => {
    const trimmed = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!ok) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email address',
        text2: 'Please enter a valid email before subscribing.',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Thanks for subscribing!',
      text2: "We'll send you monthly admissions updates.",
    });
    setEmail('');
  };

  // Internal vs external navigation
  const open = (href) => {
    if (!href) return;
    if (typeof href === 'string' && href.startsWith('/')) {
      router.push(href);
    } else {
      Linking.openURL(href);
    }
  };

  return (
    <View accessibilityRole="contentinfo" style={[styles.shell, { backgroundColor: C.bg }]}>
      {/* Divider */}
      <View style={[styles.topLine, { backgroundColor: C.divider }]} />

      <View style={styles.inner}>
        {/* Brand */}
        <View style={[styles.column, { width: colBasis }]}>
          <Text style={[styles.logo, { color: C.textStrong }]}>KOEDU Bridge</Text>
          <Text style={[styles.company, { color: C.text }]}>
            Your gateway to universities in South Korea.
          </Text>
          <Text style={[styles.slogan, { color: C.muted }]}>
            Secure, fast, human platform.
          </Text>

          <View style={styles.socialRow}>
            <IconLink icon="logo-instagram" label="Instagram" onPress={() => open('https://instagram.com/koedubridge')} C={C} />
            <IconLink icon="logo-facebook" label="Facebook" onPress={() => open('https://facebook.com/koedubridge')} C={C} />
            <IconLink icon="logo-linkedin" label="LinkedIn" onPress={() => open('https://www.linkedin.com/company/koedubridge')} C={C} />
            <IconLink icon="logo-youtube" label="YouTube" onPress={() => open('https://www.youtube.com/@koedubridge')} C={C} />
          </View>
        </View>

        {/* Contact */}
        <View style={[styles.column, { width: colBasis }]}>
          <Text style={[styles.heading, { color: C.textStrong }]}>📬 Contact</Text>
          <Text style={[styles.item, { color: C.text }]}>
            📍 Asan, Chungnam, South Korea
          </Text>

          <Pressable onPress={() => open('mailto:koeduagent@gmail.com')}>
            <Text style={[styles.item, styles.link, { color: C.link }]}>
              ✉ koeduagent@gmail.com
            </Text>
          </Pressable>

          <Pressable onPress={() => open('tel:+821096033966')}>
            <Text style={[styles.item, styles.link, { color: C.link }]}>
              📞 +82 10-9603-3966
            </Text>
          </Pressable>

          <Pressable onPress={() => open('https://koedubridge.com')}>
            <Text style={[styles.item, styles.link, { color: C.link }]}>
              🌐 www.koedubridge.com
            </Text>
          </Pressable>
        </View>

        {/* Quick links */}
        <View style={[styles.column, { width: colBasis }]}>
          <Text style={[styles.heading, { color: C.textStrong }]}>🌟 Quick links</Text>
          {quickLinks.map((link) => (
            <Pressable key={link.href} onPress={() => open(link.href)}>
              <Text style={[styles.item, { color: C.text }]}>
                <Text style={{ color: C.bullet }}>• </Text>
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Newsletter */}
        <View style={[styles.column, { width: colBasis }]}>
          <Text style={[styles.heading, { color: C.textStrong }]}>📩 Newsletter</Text>
          <Text style={[styles.helper, { color: C.muted }]}>
            Admissions tips, scholarships, and deadlines — one email per month.
          </Text>

          <View style={[styles.newsletter, { borderColor: C.inputBorder, backgroundColor: C.inputBg }]}>
            <Ionicons name="mail" size={16} color={C.muted} style={{ marginLeft: 10 }} />
            <TextInput
              style={[styles.input, { color: C.textStrong }]}
              placeholder="Your email address"
              placeholderTextColor={C.placeholder}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              onSubmitEditing={handleSubscribe}
            />
            <Pressable style={[styles.button, { backgroundColor: C.ctaBg }]} onPress={handleSubscribe}>
              <Ionicons name="arrow-forward" size={18} color={C.ctaText} />
            </Pressable>
          </View>

          <Text style={[styles.note, { color: C.muted }]}>
            By subscribing, you agree to our{' '}
            <Text style={[styles.link, { color: C.link }]} onPress={() => open('/legal/privacy')}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

        {/* Legal */}
        <View style={styles.legalWrap}>
          <Text style={[styles.copy, { color: C.muted }]}>
            © {new Date().getFullYear()} KOEDU Bridge • All rights reserved
          </Text>

          <View style={styles.legalLinks}>
            <Pressable onPress={() => open('/legal/terms')}>
              <Text style={[styles.legalLink, { color: C.link }]}>Terms</Text>
            </Pressable>
            <Text style={{ color: C.muted }}>•</Text>
            <Pressable onPress={() => open('/legal/privacy')}>
              <Text style={[styles.legalLink, { color: C.link }]}>Privacy</Text>
            </Pressable>
            <Text style={{ color: C.muted }}>•</Text>
            <Pressable onPress={() => open('/legal/cookies')}>
              <Text style={[styles.legalLink, { color: C.link }]}>Cookies</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function IconLink({ icon, label, onPress, C }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        {
          backgroundColor: pressed ? C.iconBgPressed : C.iconBg,
          borderColor: C.iconBorder,
        },
      ]}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={16} color={C.icon} />
    </Pressable>
  );
}

const quickLinks = [
  { label: 'Find a program', href: '/programs' },
  { label: 'Admissions guide', href: '/info/admissions-guide' },
  { label: 'Tuition & scholarships', href: '/info/tuition-fees' },
  { label: 'Language & requirements', href: '/info/language-requirements' },
  { label: 'FAQ', href: '/info/faq' },
  { label: 'Contact us', href: '/contact' },
];

function getColors(scheme) {
  const dark = {
    bg: '#0b1220',
    divider: 'rgba(255,255,255,0.06)',
    textStrong: '#ffffff',
    text: '#d6e1ee',
    muted: '#97a6ba',
    link: '#93c5fd',
    bullet: '#4ea0ff',
    inputBg: '#0a1020',
    inputBorder: '#2a3550',
    placeholder: '#7e8ca3',
    ctaBg: '#facc15',
    ctaText: '#0b1220',
    iconBg: 'rgba(255,255,255,0.06)',
    iconBgPressed: 'rgba(255,255,255,0.12)',
    iconBorder: 'rgba(255,255,255,0.08)',
    icon: '#cbd5e1',
  };

  const light = {
    bg: '#1e293b',
    divider: 'rgba(255,255,255,0.08)',
    textStrong: '#ffffff',
    text: '#e2e8f0',
    muted: '#b6c2d2',
    link: '#93c5fd',
    bullet: '#60a5fa',
    inputBg: '#0f172a',
    inputBorder: '#334155',
    placeholder: '#a3b2c6',
    ctaBg: '#facc15',
    ctaText: '#1e293b',
    iconBg: 'rgba(255,255,255,0.06)',
    iconBgPressed: 'rgba(255,255,255,0.12)',
    iconBorder: 'rgba(255,255,255,0.08)',
    icon: '#e2e8f0',
  };

  return scheme === 'light' ? light : dark;
}

const styles = StyleSheet.create({
  shell: { width: '100%' },
  topLine: { height: 1, width: '100%' },
  inner: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  column: { marginBottom: 16 },
  logo: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  company: { fontSize: 14, marginBottom: 6 },
  slogan: { fontSize: 13, marginBottom: 12 },
  heading: { fontSize: 16, marginBottom: 8, fontWeight: '700' },
  item: { marginBottom: 6, fontSize: 14 },
  link: { textDecorationLine: 'underline' },
  helper: { fontSize: 13, marginBottom: 8 },
  socialRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  newsletter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: { flex: 1, height: 44, paddingHorizontal: 10 },
  button: {
    height: 44,
    minWidth: 46,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: { fontSize: 12, marginTop: 6 },
  legalWrap: {
    width: '100%',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  copy: { fontSize: 12 },
  legalLinks: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legalLink: { fontSize: 12, textDecorationLine: 'underline' },
});
