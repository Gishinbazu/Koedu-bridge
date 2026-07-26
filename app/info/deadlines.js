// app/info/deadlines.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HeaderSpacer from '../../components/HeaderSpacer';

export default function DeadlinesInfo() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Dates & Deadlines' }} />

      {/* space under the fixed TopNavbar */}
      <HeaderSpacer height={56} extra={8} />

      {/* HERO (same style as bachelors) */}
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
            <Ionicons name="calendar-outline" size={16} color="#0b1120" />
            <Text style={styles.badgeText}>Deadlines</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Dates & Deadlines</Text>
        <Text style={styles.heroSubtitle}>
          A practical calendar for Korean university intakes (degree + language programs). Exact
          dates vary by school, but this guide helps you plan early.
        </Text>

        {/* quick chips */}
        <View style={styles.chipsRow}>
          <Chip icon="school-outline" label="Degree intakes" />
          <Chip icon="globe-outline" label="Visa timing" />
          <Chip icon="time-outline" label="KLI every 10–12w" />
        </View>
      </View>

      {/* SECTIONS (same card style as bachelors) */}
      <View style={styles.sectionsWrap}>
        {/* Lead */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Why deadlines matter</Text>
          <Text style={styles.paragraph}>
            Planning ahead is key to a successful application. Universities can have multiple rounds,
            and documents (translations, apostilles, bank certificates) often take time.
          </Text>
        </View>

        {/* Spring */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📘 Spring Intake (March entry) — Degree (D-2)</Text>

          <TimelineItem when="Sep – Oct (previous year)" what="Application period (typical)" />
          <TimelineItem when="Nov – Dec" what="Results / offers" />
          <TimelineItem when="Dec – Jan" what="Tuition payment + admission docs (CoA / letter)" />
          <TimelineItem when="Dec – Feb" what="Visa application (D-2) + embassy processing" />
          <TimelineItem when="February" what="Orientation & housing check-in" />
          <TimelineItem when="Early March" what="Semester starts" />
        </View>

        {/* Fall */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📙 Fall Intake (September entry) — Degree (D-2)</Text>

          <TimelineItem when="April – May" what="Application period (typical)" />
          <TimelineItem when="June – July" what="Results / offers" />
          <TimelineItem when="July – August" what="Tuition payment + admission docs (CoA / letter)" />
          <TimelineItem when="July – Aug" what="Visa application (D-2) + embassy processing" />
          <TimelineItem when="Late August" what="Orientation & housing check-in" />
          <TimelineItem when="Early September" what="Semester starts" />
        </View>

        {/* KLI */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🗓️ KLI rolling intakes (every 10–12 weeks)</Text>
          <Text style={styles.paragraph}>
            Language institutes often run 4 terms per year. You can join more frequently than
            degree programs, but you still need to plan payment + visa timing.
          </Text>

          <MiniTable
            columns={[
              { key: 'term', label: 'Term' },
              { key: 'reg', label: 'Registration' },
              { key: 'pay', label: 'Payment' },
              { key: 'start', label: 'Start' },
            ]}
            rows={[
              { term: 'Spring', reg: 'Dec → Jan', pay: 'Jan', start: 'Early Mar' },
              { term: 'Summer', reg: 'Mar → Apr', pay: 'May', start: 'Early Jun' },
              { term: 'Fall', reg: 'Jun → Jul', pay: 'Jul–Aug', start: 'Late Aug / Sep' },
              { term: 'Winter', reg: 'Sep → Oct', pay: 'Nov', start: 'Late Nov / Dec' },
            ]}
          />

          <Text style={styles.paragraph}>
            Tip: If you target a D-4 visa, many schools expect at least 2 consecutive terms.
          </Text>
        </View>

        {/* Variations */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏫 University variations</Text>

          <Bullet text="Some universities have 2–3 application rounds per intake (early/regular/late)." />
          <Bullet text="Graduate schools and art/design majors may set earlier internal deadlines." />
          <Bullet text="Scholarship deadlines can be earlier than program application windows." />
          <Bullet text="Requirements can differ by country (apostille/notarization rules)." />
        </View>

        {/* KOEDU help */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🤝 How KOEDU Bridge helps</Text>

          <Bullet text="Personalized shortlist + timeline based on your profile and target intake." />
          <Bullet text="Document checklist with translation/apostille guidance by country." />
          <Bullet text="Application tracking: status, comments, and extra requests in one place." />
          <Bullet text="Visa, housing, insurance, and pre-arrival brief to land smoothly in Korea." />
        </View>

        {/* Tips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📌 Tips</Text>

          <Bullet text="Submit documents early — translations and apostilles can take time." />
          <Bullet text="Book language tests (TOPIK/IELTS/TOEFL) well in advance." />
          <Bullet text="Use one email for applications and check it frequently." />
          <Bullet text="Keep scans in PDF with clear names: LASTNAME_Firstname_Document.pdf." />
        </View>

        {/* CTA (same vibe as bachelors) */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Want tailored deadlines?</Text>
          <Text style={styles.ctaSubtitle}>
            We’ll build your personal timeline and shortlist based on your intake and documents.
          </Text>

          <View style={styles.ctaBtns}>
            <Pressable
              onPress={() => router.push('/programs')}
              style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Find a program"
            >
              <Ionicons name="search-outline" size={16} color="#0b1120" />
              <Text style={styles.btnPrimaryText}>Find a program</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/contact')}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.92 }]}
              accessibilityRole="button"
              accessibilityLabel="Contact us"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#e5edff" />
              <Text style={styles.btnGhostText}>Contact us</Text>
            </Pressable>
          </View>
        </View>

        {/* footer note */}
        <Text style={styles.footerNote}>
          Questions about deadlines? Email us at{' '}
          <Text style={styles.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===== Small UI bits ===== */
function Chip({ icon, label }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color="#e5edff" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function TimelineItem({ when, what }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.dot} />
      <View style={{ flex: 1 }}>
        <Text style={styles.when}>{when}</Text>
        <Text style={styles.what}>{what}</Text>
      </View>
    </View>
  );
}

function Bullet({ text }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

/**
 * MiniTable: simple “dark” table that matches the bachelors style
 * (no border-heavy “white” table)
 */
function MiniTable({ columns, rows }) {
  return (
    <View style={styles.tableWrap}>
      <View style={[styles.tableRow, styles.tableHead]}>
        {columns.map((c) => (
          <View key={c.key} style={[styles.cell, { flex: 1 }]}>
            <Text style={styles.thText}>{c.label}</Text>
          </View>
        ))}
      </View>

      {rows.map((r, i) => (
        <View key={i} style={styles.tableRow}>
          {columns.map((c) => (
            <View key={c.key} style={[styles.cell, { flex: 1 }]}>
              <Text style={styles.tdText}>{r[c.key]}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/* ===== Styles (copied from bachelors vibe) ===== */
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
      default: {},
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
  backText: {
    color: '#e5edff',
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f97316',
  },
  badgeText: {
    color: '#0b1120',
    fontSize: 13,
    fontWeight: '800',
  },

  heroTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '800',
    color: '#e5edff',
  },
  heroSubtitle: {
    marginTop: 8,
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 21,
  },

  chipsRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipText: {
    color: '#e5edff',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionsWrap: {
    width: '100%',
    maxWidth: 900,
    marginTop: 18,
    gap: 12,
  },

  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(30,64,175,0.45)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e5edff',
    marginBottom: 8,
  },
  paragraph: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },

  /* timeline */
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  dot: {
    width: 10,
    height: 10,
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: '#f97316', // matches badge
  },
  when: { fontWeight: '800', color: '#e5edff' },
  what: { color: '#cbd5f5', lineHeight: 20 },

  /* bullets */
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  bulletText: { flex: 1, color: '#cbd5f5', fontSize: 14, lineHeight: 22 },

  /* mini table */
  tableWrap: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)',
    backgroundColor: 'rgba(15,23,42,0.35)',
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.16)' },
  tableHead: { backgroundColor: 'rgba(30,64,175,0.18)' },
  cell: { paddingVertical: 10, paddingHorizontal: 10 },
  thText: { color: '#e5edff', fontWeight: '900', fontSize: 12 },
  tdText: { color: '#cbd5f5', fontSize: 12, lineHeight: 18 },

  /* CTA */
  ctaCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(2,6,23,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  ctaTitle: { color: '#e5edff', fontWeight: '900', fontSize: 16 },
  ctaSubtitle: { color: '#cbd5f5', marginTop: 6, lineHeight: 20 },
  ctaBtns: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
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
  },
  link: { color: '#38bdf8', textDecorationLine: 'underline' },
});
