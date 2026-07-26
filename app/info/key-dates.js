// app/info/key-dates.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderSpacer from '../../components/HeaderSpacer'; // si ta navbar est fixe
import SidebarInfoNav from '../../components/SidebarInfoNav';
import TopNavbar from '../../components/TopNavbar';
import { useAppTheme } from '../../theme/AppTheme';

const SEMESTERS = [
  { key: 'spring', label: 'Spring (March entry)' },
  { key: 'fall', label: 'Fall (September entry)' },
];

// Ranges indicatifs (à adapter par université si besoin)
const RANGES = {
  spring: [
    { n: 1, title: 'Applications open',     window: 'Oct – Nov',  icon: 'open-outline',           hint: 'Crée ton compte et prépare les scans.' },
    { n: 2, title: 'Document deadline',     window: 'Nov – Dec',  icon: 'document-outline',       hint: 'Transcripts, passeport, tests de langue.' },
    { n: 3, title: 'Interview window',      window: 'Dec',        icon: 'people-outline',         hint: 'Selon le programme.' },
    { n: 4, title: 'Admission results',     window: 'Jan',        icon: 'ribbon-outline',         hint: 'Acceptation / Liste d’attente.' },
    { n: 5, title: 'Visa (D-2) & issuance', window: 'Jan – Feb',  icon: 'document-text-outline',  hint: 'Prépare dépôt éventuel & RDV consulat.' },
    { n: 6, title: 'Orientation & arrival', window: 'Late Feb',   icon: 'airplane-outline',       hint: 'Logement, assurance, carte SIM.' },
  ],
  fall: [
    { n: 1, title: 'Applications open',     window: 'Apr – May',  icon: 'open-outline',           hint: 'Crée ton compte et prépare les scans.' },
    { n: 2, title: 'Document deadline',     window: 'May – Jun',  icon: 'document-outline',       hint: 'Transcripts, passeport, tests de langue.' },
    { n: 3, title: 'Interview window',      window: 'Jun',        icon: 'people-outline',         hint: 'Selon le programme.' },
    { n: 4, title: 'Admission results',     window: 'Jul',        icon: 'ribbon-outline',         hint: 'Acceptation / Liste d’attente.' },
    { n: 5, title: 'Visa (D-2) & issuance', window: 'Jul – Aug',  icon: 'document-text-outline',  hint: 'Prépare dépôt éventuel & RDV consulat.' },
    { n: 6, title: 'Orientation & arrival', window: 'Late Aug',   icon: 'airplane-outline',       hint: 'Logement, assurance, carte SIM.' },
  ],
};

export default function KeyDatesPage() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sem, setSem] = useState('spring');

  const items = useMemo(() => RANGES[sem] ?? [], [sem]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.top }}>
      <TopNavbar onMenuPress={() => setSidebarVisible(true)} />
      {sidebarVisible && <SidebarInfoNav onClose={() => setSidebarVisible(false)} />}

      <ScrollView contentContainerStyle={[s.container]}>
        <HeaderSpacer />

        {/* Hero */}
        <View style={[s.hero, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
          <View style={[s.heroIcon, { backgroundColor: theme.chipBg, borderColor: theme.stroke }]}>
            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: theme.text }]}>Key Dates & Timeline</Text>
            <Text style={[s.lead, { color: theme.subText }]}>
              Repères temporels pour candidater en toute sérénité. Les fenêtres varient selon l’université et le programme.
            </Text>
          </View>
        </View>

        {/* Semester switch */}
        <View style={s.semRow}>
          {SEMESTERS.map((opt) => {
            const active = sem === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSem(opt.key)}
                style={[
                  s.semChip,
                  { borderColor: theme.stroke, backgroundColor: active ? theme.primary : theme.surface },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[s.semText, { color: active ? theme.brandText : theme.text }]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Timeline */}
        <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
          <Text style={[s.blockTitle, { color: theme.text }]}>
            {sem === 'spring' ? 'Spring (March entry)' : 'Fall (September entry)'}
          </Text>

          {items.map((it, idx) => (
            <TimelineRow
              key={it.n}
              theme={theme}
              n={it.n}
              title={it.title}
              window={it.window}
              hint={it.hint}
              icon={it.icon}
              isLast={idx === items.length - 1}
            />
          ))}
        </View>

        {/* Quick cards */}
        <View style={s.grid}>
          <QuickCard
            theme={theme}
            icon="document-outline"
            title="Documents à anticiper"
            bullets={[
              'Passeport (validité 6+ mois)',
              'Relevés & diplômes',
              'Test de langue (IELTS/TOEFL/TOPIK)',
              'Recommandations si requises',
            ]}
          />
          <QuickCard
            theme={theme}
            icon="time-outline"
            title="Conseils timing"
            bullets={[
              'Commence 6–8 semaines avant la fermeture',
              'Réserve vite les créneaux de tests',
              'Prévois la légalisation / apostille',
              'Varies selon faculté',
            ]}
          />
        </View>

        {/* FAQ courte */}
        <View style={[s.block, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
          <Text style={[s.blockTitle, { color: theme.text }]}>FAQ rapide</Text>
          <FAQItem
            theme={theme}
            q="Les dates sont-elles identiques partout ?"
            a="Non. Chaque université a son propre calendrier. Utilise ces repères comme guide et vérifie la page du programme."
          />
          <FAQItem
            theme={theme}
            q="Puis-je candidater hors fenêtre ?"
            a="Généralement non. Certaines écoles ont des rolling admissions, mais la majorité fonctionnent par sessions fixes."
          />
        </View>

        {/* CTA */}
        <View style={[s.cta, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
          <Text style={[s.ctaTitle, { color: theme.text }]}>Prêt(e) à poser ta candidature ?</Text>
          <Text style={[s.ctaSub, { color: theme.subText }]}>
            Crée ton compte pour recevoir un rappel personnalisé des échéances.
          </Text>
          <View style={s.ctaRow}>
            <Pressable
              onPress={() => router.push('/auth/signup')}
              style={[s.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
            >
              <Ionicons name="notifications-outline" size={16} color={theme.brandText} />
              <Text style={[s.btnPrimaryText, { color: theme.brandText }]}>Créer un compte</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/programs')}
              style={[s.btn, s.btnGhost, { borderColor: theme.stroke }]}
            >
              <Ionicons name="search-outline" size={16} color={theme.primary} />
              <Text style={[s.btnGhostText, { color: theme.primary }]}>Voir les programmes</Text>
            </Pressable>
          </View>
        </View>

        {/* Note */}
        <View style={[s.noteBox, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
          <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
          <Text style={[s.noteText, { color: theme.text }]}>
            Ces fenêtres sont indicatives — vérifie toujours le calendrier officiel du programme avant d’envoyer.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Petits composants ---------- */
function TimelineRow({ theme, n, title, window, hint, icon, isLast }) {
  return (
    <View style={s.timeRow}>
      <View style={s.timeColLeft}>
        <View style={[s.badge, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
          <Text style={[s.badgeText, { color: theme.primary }]}>{n}</Text>
        </View>
        {!isLast && <View style={[s.connector, { backgroundColor: theme.stroke }]} />}
      </View>
      <View style={s.timeColRight}>
        <View style={s.timeHeader}>
          <View style={[s.iconWrap, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
            <Ionicons name={icon} size={14} color={theme.primary} />
          </View>
          <Text style={[s.stepTitle, { color: theme.text }]}>{title}</Text>
          <View style={[s.windowPill, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
            <Ionicons name="time-outline" size={12} color={theme.primary} />
            <Text style={[s.windowText, { color: theme.text }]}>{window}</Text>
          </View>
        </View>
        {!!hint && <Text style={[s.stepHint, { color: theme.subText }]}>{hint}</Text>}
      </View>
    </View>
  );
}

function QuickCard({ theme, icon, title, bullets = [] }) {
  return (
    <View style={[s.card, { borderColor: theme.stroke, backgroundColor: theme.surface }]}>
      <View style={s.cardHeader}>
        <View style={[s.cardIcon, { borderColor: theme.stroke, backgroundColor: theme.chipBg }]}>
          <Ionicons name={icon} size={16} color={theme.primary} />
        </View>
        <Text style={[s.cardTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {bullets.map((b, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={[s.dot, { color: theme.primary }]}>•</Text>
          <Text style={[s.bulletText, { color: theme.text }]}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

function FAQItem({ theme, q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[s.faqItem, { borderColor: theme.stroke }]}>
      <Pressable onPress={() => setOpen(v => !v)} style={s.faqHeader}>
        <Text style={[s.faqQ, { color: theme.text }]}>{q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={theme.primary} />
      </Pressable>
      {open && <Text style={[s.faqA, { color: theme.subText }]}>{a}</Text>}
    </View>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },

  // Hero
  hero: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  heroIcon: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '900' },
  lead: { marginTop: 4, lineHeight: 20, fontSize: 14, fontWeight: '600' },

  // Semester chips
  semRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  semChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  semText: { fontWeight: '800' },

  // Block
  block: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  blockTitle: { fontSize: 18, fontWeight: '900', marginBottom: 8 },

  // Timeline rows
  timeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  timeColLeft: { alignItems: 'center' },
  badge: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontWeight: '900' },
  connector: { width: 2, flex: 1, marginTop: 4, borderRadius: 1 },
  timeColRight: { flex: 1 },
  timeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 },
  iconWrap: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  stepTitle: { fontSize: 16, fontWeight: '900' },
  windowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 999,
  },
  windowText: { fontWeight: '800', fontSize: 12 },
  stepHint: { marginTop: 4 },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flexBasis: '48%',
    maxWidth: '48%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    ...Platform.select({
      default: { flexBasis: '100%', maxWidth: '100%' }, // mobile: 1 colonne
      web: {}, // 2 colonnes sur web
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitle: { fontWeight: '900', fontSize: 16 },
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'flex-start' },
  dot: { fontWeight: '900' },
  bulletText: { lineHeight: 20 },

  // FAQ
  faqItem: { borderTopWidth: 1, paddingVertical: 10 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  faqQ: { fontWeight: '900' },
  faqA: { marginTop: 6, lineHeight: 20 },

  // CTA
  cta: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  ctaTitle: { fontSize: 18, fontWeight: '900' },
  ctaSub: { marginTop: 2 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  btn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPrimaryText: { fontWeight: '900' },
  btnGhost: { backgroundColor: 'transparent' },
  btnGhostText: { fontWeight: '900' },

  // Note
  noteBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  noteText: { flex: 1, lineHeight: 20 },
});
