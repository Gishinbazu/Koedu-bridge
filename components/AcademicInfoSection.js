// components/AcademicInfoSection.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

const RAW_SECTIONS = [
  {
    title: "Apply to master's",
    description:
      "Find detailed, step-by-step instructions on how to complete and submit an application for master's studies in Korea.",
    route: '/info/masters',
    icon: 'school',
  },
  {
    title: "Apply to bachelor's",
    description:
      "If you're interested in bachelor’s studies, find out how to apply through KOEDU Bridge.",
    route: '/info/bachelors',
    icon: 'ribbon',
  },
  {
    title: 'Dates and deadlines',
    description:
      'A successful application means meeting deadlines. Check important dates for your submission.',
    route: '/info/deadlines',
    icon: 'calendar',
  },
  // ⭐ New: Korean Language
  {
    title: 'Korean Language (KLI)',
    description:
      '10–12 week intensive terms to reach TOPIK or prepare for life in Korea. Schedules, fees, and visa tips.',
    route: '/info/korean-language',
    icon: 'chatbubbles',
  },
];

export default function AcademicInfoSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();

  // responsive columns
  const cols = width >= 1100 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const cardBasis =
    cols === 4 ? '23%' : cols === 3 ? '31%' : cols === 2 ? '48%' : '100%';

  const C = useMemo(() => getColors(scheme), [scheme]);

  return (
    <View style={[s.wrap, { backgroundColor: C.bg }]}>
      {RAW_SECTIONS.map((item) => (
        <Pressable
          key={item.title}
          onPress={() => router.push(item.route)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={({ pressed, hovered }) => [
            s.card,
            { width: cardBasis, borderColor: C.border, backgroundColor: C.surface },
            (pressed || hovered) && { transform: [{ translateY: -2 }], shadowOpacity: 0.18 },
          ]}
        >
          <View style={[s.iconWrap, { backgroundColor: C.iconBg, borderColor: C.border }]}>
            <Ionicons name={item.icon} size={18} color={C.brand} />
          </View>
          <Text style={[s.title, { color: C.ink }]}>{item.title}</Text>
          <Text style={[s.desc, { color: C.text }]}>{item.description}</Text>

          <View style={s.ctaRow}>
            <Text style={[s.cta, { color: C.brand }]}>Learn more</Text>
            <Ionicons name="arrow-forward" size={16} color={C.brand} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function getColors(scheme) {
  const dark = {
    bg: '#eef3fb00', // transparent in most layouts
    surface: '#eef3fb', // soft card blue in light; we invert in dark below
    border: '#d8e3f3',
    ink: '#0b2a4a',
    text: '#334155',
    brand: '#0b3b79',
    iconBg: '#ffffff',
  };
  const light = dark;
  const darkMode = scheme === 'dark';
  return darkMode
    ? {
        bg: 'transparent',
        surface: '#0e1726',
        border: '#1c2941',
        ink: '#cfe2ff',
        text: '#b6c2d2',
        brand: '#8ab4ff',
        iconBg: '#111c2d',
      }
    : light;
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    minWidth: 250,
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cta: { fontWeight: '800' },
});
