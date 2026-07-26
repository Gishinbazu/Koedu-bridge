// app/info/contact.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

export default function ContactScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [agree, setAgree] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const canSend = useMemo(() => {
    return agree && !!name.trim() && !!email.trim() && !!subject.trim() && !!message.trim();
  }, [agree, name, email, subject, message]);

  const handleSend = () => {
    if (!agree) return Alert.alert('Privacy policy', 'Please accept the privacy policy.');
    if (!name || !email || !subject || !message) return Alert.alert('Missing info', 'Please fill all fields.');
    Alert.alert('Message sent!', 'We will contact you soon.');
  };

  const handleSubscribe = () => {
    if (!newsletterOptIn) return Alert.alert('Newsletter', 'Please enable newsletter opt-in.');
    if (!newsletterEmail.trim()) return Alert.alert('Newsletter', 'Please enter your email.');
    Alert.alert('Subscribed!', 'Thanks — you will receive updates soon.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Contact' }} />

      {/* space under fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO (Bachelor style) */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.85, transform: [{ translateY: 1 }] },
            ]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={18} color="#e5edff" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.badge}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0b1120" />
            <Text style={styles.badgeText}>Contact</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Contact KOEDU Bridge</Text>
        <Text style={styles.heroSubtitle}>
          Tell us your goals and timeline — we’ll reply with clear next steps (program shortlist,
          documents, deadlines, and visa prep).
        </Text>

        <View style={styles.chipsRow}>
          <Chip icon="time-outline" label="Fast reply" />
          <Chip icon="document-text-outline" label="Docs guidance" />
          <Chip icon="school-outline" label="Program matching" />
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.sectionsWrap}>
        {/* Notes / info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Before you send</Text>

          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.bulletText}>Include your target intake (March/September/KLI term).</Text>
          </View>

          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.bulletText}>Tell us your desired major and preferred language (Korean/English).</Text>
          </View>

          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.bulletText}>If you already have documents, mention what you have (passport, transcripts, etc.).</Text>
          </View>

          <Text style={styles.note}>
            You can also check the FAQ in the info section for quick answers.
          </Text>

          <View style={styles.inlineCtas}>
            <Pressable
              onPress={() => router.push('/info/faq')}
              style={({ pressed }) => [styles.pillGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Open FAQ"
            >
              <Ionicons name="help-circle-outline" size={16} color="#e5edff" />
              <Text style={styles.pillText}>Open FAQ</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/programs')}
              style={({ pressed }) => [styles.pill, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Browse programs"
            >
              <Ionicons name="search-outline" size={16} color="#0b1120" />
              <Text style={styles.pillTextDark}>Browse programs</Text>
            </Pressable>
          </View>
        </View>

        {/* Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Send a message</Text>

          <View style={styles.row}>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor="rgba(203,213,245,0.55)"
              value={name}
              onChangeText={setName}
              style={styles.inputHalf}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Your Email"
              placeholderTextColor="rgba(203,213,245,0.55)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputHalf}
            />
          </View>

          <TextInput
            placeholder="Subject"
            placeholderTextColor="rgba(203,213,245,0.55)"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
          />

          <TextInput
            placeholder="Your Message"
            placeholderTextColor="rgba(203,213,245,0.55)"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={7}
            style={[styles.input, styles.textArea]}
          />

          <View style={styles.switchRow}>
            <Switch value={agree} onValueChange={setAgree} />
            <Text style={styles.switchText}>
              I’ve read and accept the <Text style={styles.link}>privacy policy</Text>.
            </Text>
          </View>

          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              (!canSend || pressed) && { opacity: !canSend ? 0.5 : 0.92 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send-outline" size={16} color="#0b1120" />
            <Text style={styles.btnPrimaryText}>Send Message</Text>
          </Pressable>
        </View>

        {/* Newsletter */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Join our newsletter</Text>
          <Text style={styles.paragraph}>
            Subscribe to receive updates about deadlines, new programs, and helpful guides.
          </Text>

          <View style={styles.switchRow}>
            <Switch value={newsletterOptIn} onValueChange={setNewsletterOptIn} />
            <Text style={styles.switchText}>I want to receive KOEDU Bridge updates by email.</Text>
          </View>

          <View style={styles.row}>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="rgba(203,213,245,0.55)"
              value={newsletterEmail}
              onChangeText={setNewsletterEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.inputHalf, { flex: 1 }]}
            />

            <Pressable
              onPress={handleSubscribe}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Subscribe"
            >
              <Ionicons name="mail-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>Subscribe</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Email: <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===== small bits ===== */
function Chip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#e5edff" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

/* ===== Styles (Bachelor vibe) ===== */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: '#020617',
  },

  heroCard: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.28,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 18 },
      },
      android: { elevation: 10 },
    }),
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  backText: { color: '#e5edff', fontSize: 13, fontWeight: '600' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f97316',
  },
  badgeText: { color: '#0b1120', fontSize: 13, fontWeight: '800' },

  heroTitle: { marginTop: 4, fontSize: 24, fontWeight: '800', color: '#e5edff' },
  heroSubtitle: { marginTop: 8, color: '#cbd5f5', fontSize: 14, lineHeight: 21 },

  chipsRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(30,64,175,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  chipText: { color: '#e5edff', fontWeight: '700', fontSize: 12 },

  sectionsWrap: { width: '100%', maxWidth: 900, marginTop: 18, gap: 12 },

  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#e5edff', marginBottom: 10 },

  paragraph: { color: '#cbd5f5', fontSize: 14, lineHeight: 22 },

  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginTop: 10 },

  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#e5edff',
  },
  inputHalf: {
    flex: 1,
    minWidth: 240,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#e5edff',
  },
  textArea: { height: 140, textAlignVertical: 'top' },

  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  switchText: { flex: 1, color: '#cbd5f5', lineHeight: 20 },

  note: { marginTop: 10, color: 'rgba(203,213,245,0.85)', fontStyle: 'italic', lineHeight: 20 },

  link: { color: '#38bdf8', textDecorationLine: 'underline' },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  bulletText: { flex: 1, color: '#cbd5f5', fontSize: 14, lineHeight: 22 },

  inlineCtas: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#f97316',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  pillGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
  },
  pillTextDark: { color: '#0b1120', fontWeight: '900' },
  pillText: { color: '#e5edff', fontWeight: '900' },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#f97316', borderColor: '#f97316' },
  btnPrimaryText: { color: '#0b1120', fontWeight: '900' },

  btnGhost: { backgroundColor: 'rgba(15,23,42,0.55)', borderColor: 'rgba(148,163,184,0.45)' },
  btnGhostText: { color: '#e5edff', fontWeight: '900' },

  footerNote: {
    marginTop: 2,
    color: 'rgba(203,213,245,0.85)',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
});
