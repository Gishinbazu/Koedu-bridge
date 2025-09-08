// app/info/deadlines.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DeadlinesInfo() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Stack.Screen options={{ title: 'Dates & Deadlines' }} />

      {/* Header with return icon */}
      <Header
        title="Dates & Deadlines"
        subtitle="A practical calendar for Korean university intakes"
        onBack={() => router.back()}
      />

      {/* Lead */}
      <Card>
        <Text style={s.lead}>
          Planning ahead is key to a successful application. Below is a general calendar for the
          main intakes in Korea. Exact dates vary by university and program, and some schools run
          multiple rounds.
        </Text>
      </Card>

      {/* Spring */}
      <Card>
        <Text style={s.h3}>📘 Spring Intake (March entry)</Text>
        <TimelineItem when="Sep – Oct (previous year)" what="Application period" />
        <TimelineItem when="Nov – Dec" what="Results" />
        <TimelineItem when="Dec – Jan" what="Visa application (D-2)" />
        <TimelineItem when="February" what="Orientation & housing check-in" />
        <TimelineItem when="~ March 2" what="Semester starts (typical)" />
      </Card>

      {/* Fall */}
      <Card>
        <Text style={s.h3}>📙 Fall Intake (September entry)</Text>
        <TimelineItem when="April – May" what="Application period" />
        <TimelineItem when="June – July" what="Results" />
        <TimelineItem when="July – August" what="Visa application (D-2)" />
        <TimelineItem when="Late August" what="Orientation & housing check-in" />
        <TimelineItem when="Early September" what="Semester starts" />
      </Card>

      {/* Variations by universities */}
      <Card>
        <Text style={s.h3}>🏫 University variations</Text>
        <Bullet text="Some universities have 2–3 application rounds per intake (early/regular/late)." />
        <Bullet text="Graduate schools and art/design majors may set earlier internal deadlines." />
        <Bullet text="Language institutes (KLI) often run rolling intakes every 10–12 weeks." />
        <Bullet text="Scholarship deadlines can be earlier than the program application window." />
      </Card>

      {/* KOEDU support */}
      <Card>
        <Text style={s.h3}>🤝 How KOEDU Bridge helps</Text>
        <Bullet text="Personalized shortlist and timeline based on your profile and target intake." />
        <Bullet text="Document checklist with translation/apostille guidance by country." />
        <Bullet text="Application tracking: status, comments, and extra requests in one place." />
        <Bullet text="Visa, housing, insurance, and pre-arrival brief to land smoothly in Korea." />
      </Card>

      {/* Tips */}
      <Card>
        <Text style={s.h3}>📌 Tips</Text>
        <Bullet text="Submit documents early — translations and apostilles can take time." />
        <Bullet text="Book language tests (TOPIK/IELTS/TOEFL) well in advance." />
        <Bullet text="Use a single email for all applications and check it frequently." />
        <Bullet text="Keep scans in PDF with clear naming: LASTNAME_Firstname_Document.pdf." />
      </Card>

      {/* Contact / CTA */}
      <CTA
        title="Want tailored deadlines?"
        subtitle="We’ll build your personal timeline and shortlist."
        primary={{ label: 'Find a program', href: '/programs' }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />

      {/* Footer note */}
      <View style={{ marginTop: 8 }}>
        <Text style={s.note}>
          Questions about deadlines? Email us at <Text style={s.link}>koedu.bridge.help@gmail.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===== Reusable bits ===== */
function Header({ title, subtitle, onBack }) {
  return (
    <View style={s.header}>
      <Pressable
        onPress={onBack}
        style={s.backBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={18} color="#0b3b79" />
        <Text style={s.backText}>Back</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={s.h1}>{title}</Text>
        {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function Card({ children }) {
  return <View style={s.card}>{children}</View>;
}

function TimelineItem({ when, what }) {
  return (
    <View style={s.timelineRow}>
      <View style={s.dot} />
      <View style={{ flex: 1 }}>
        <Text style={s.when}>{when}</Text>
        <Text style={s.what}>{what}</Text>
      </View>
    </View>
  );
}

function Bullet({ text }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bullet}>•</Text>
      <Text style={s.body}>{text}</Text>
    </View>
  );
}

function CTA({ title, subtitle, primary, secondary }) {
  const router = useRouter();
  const go = (href) => href?.startsWith('/') && router.push(href);
  return (
    <View style={s.cta}>
      <Text style={s.h2}>{title}</Text>
      {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {!!primary && (
          <Pressable
            onPress={() => go(primary.href)}
            style={[s.btn, s.btnPrimary]}
            accessibilityRole="button"
            accessibilityLabel={primary.label}
          >
            <Text style={s.btnPrimaryText}>{primary.label}</Text>
          </Pressable>
        )}
        {!!secondary && (
          <Pressable
            onPress={() => go(secondary.href)}
            style={[s.btn, s.btnGhost]}
            accessibilityRole="button"
            accessibilityLabel={secondary.label}
          >
            <Text style={s.btnGhostText}>{secondary.label}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const C = {
  border: '#e5e7eb',
  bgCard: '#ffffff',
  ink: '#0f172a',
  body: '#334155',
  brand: '#0b3b79',
  ghostBorder: '#cbd5e1',
};

const s = StyleSheet.create({
  page: {
    padding: 16,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 40,
  },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
      android: { elevation: 1 },
    }),
  },
  backText: { color: C.brand, fontWeight: '700' },

  h1: { fontSize: 26, fontWeight: '800', color: C.ink },
  h2: { fontSize: 20, fontWeight: '800', color: C.ink },
  h3: { fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 6 },
  sub: { color: '#64748b', marginTop: 2 },
  lead: { color: C.body, lineHeight: 22 },

  card: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: C.bgCard,
    marginBottom: 10,
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
    backgroundColor: C.brand,
  },
  when: { fontWeight: '800', color: C.ink },
  what: { color: C.body },

  /* bullets */
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { color: C.brand, fontWeight: '800' },
  body: { color: C.body, lineHeight: 20 },

  /* CTA */
  cta: { borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16, backgroundColor: C.bgCard, marginTop: 4 },
  btn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnPrimary: { backgroundColor: C.brand, borderColor: C.brand },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: { backgroundColor: '#fff', borderColor: C.ghostBorder },
  btnGhostText: { color: C.brand, fontWeight: '800' },

  note: { color: '#64748b', fontStyle: 'italic', marginTop: 6 },
  link: { color: '#0ea5e9', textDecorationLine: 'underline' },
});
