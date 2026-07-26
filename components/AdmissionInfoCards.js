// components/AdmissionInfoCards.js
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const cards = [
  {
    title: 'From application to results',
    description:
      'There are several steps and decisions that are made during the processing of your admissions application. Find out more about them – and what you can do after each one.',
    route: '/info/application-steps',
    image: require('../assets/images/application.png'),
  },
  {
    title: 'Find out what you need to submit',
    description:
      "Find out what documents you need to complete your master's application.",
    route: '/info/required-documents',
    image: require('../assets/images/documents.png'),
  },
  {
    title: 'Korean language requirements',
    description:
      'All courses taught in Korean have a Korean language requirement. Find out what that is – and the ways you can meet the requirement.',
    route: '/info/korean-language',
    image: require('../assets/images/korean.png'),
    badge: 'Article',
  },
];

export default function AdmissionInfoCards() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Breakpoints: 1 col < 520, 2 cols < 900, else 3 cols
  const cols = width < 520 ? 1 : width < 900 ? 2 : 3;
  const isSmall = width < 520;

  const cardBasis = useMemo(() => {
    // container has horizontal padding; keep a bit of gap
    if (cols === 1) return '100%';
    if (cols === 2) return 'calc(50% - 10px)';
    return 'calc(33.333% - 13px)';
  }, [cols]);

  const brand = '#0b3b79';
  const brandSoft = 'rgba(11,59,121,0.08)';
  const text = '#0b2a4a';
  const subText = '#475569';
  const stroke = '#e5e7eb';
  const surface = '#ffffff';

  return (
    <View style={[styles.container, { paddingHorizontal: isSmall ? 12 : 20 }]}>
      {cards.map((card, index) => (
        <Pressable
          key={index}
          onPress={() => router.push(card.route)}
          android_ripple={{ color: brandSoft, borderless: false }}
          style={({ hovered, pressed }) => ([
            styles.card,
            {
              backgroundColor: surface,
              borderColor: stroke,
              // responsive width
              flexBasis: cardBasis,
              maxWidth: Platform.OS === 'web' ? 'none' : undefined,
              transform: [{ translateY: pressed ? 1 : 0 }],
              ...(hovered && Platform.OS === 'web' ? { borderColor: '#dbe3ee', shadowOpacity: 0.12 } : null),
            },
          ])}
          accessibilityRole="button"
          accessibilityHint={`Open ${card.title}`}
        >
          <View style={styles.imageWrap}>
            <Image source={card.image} style={styles.image} />
            {!!card.badge && (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{card.badge}</Text>
              </View>
            )}

            {/* Decorative gradient top overlay for legibility */}
            <View style={styles.topFade} pointerEvents="none" />
          </View>

          <View style={styles.textBlock}>
            <Text style={[styles.title, { color: text }]} numberOfLines={2}>
              {card.title}
            </Text>
            <Text style={[styles.desc, { color: subText }]} numberOfLines={4}>
              {card.description}
            </Text>

            <View style={styles.ctaRow}>
              <Text style={[styles.ctaText, { color: brand }]}>Learn more</Text>
              <Text style={[styles.ctaArrow, { color: brand }]} aria-hidden>
                →
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Responsive row that wraps
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8,
  },

  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  imageWrap: {
    position: 'relative',
    width: '100%',
    // 16:9 feels more premium vs 1:1, keeps page airy on desktop
    aspectRatio: 16 / 9,
    backgroundColor: '#f3f4f6',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topFade: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  badgePill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#003366',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  textBlock: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.15,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },

  ctaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
  },
  ctaArrow: {
    fontSize: 18,
    marginTop: -1,
  },
});
