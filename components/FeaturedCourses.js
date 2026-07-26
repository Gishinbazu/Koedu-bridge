import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const featuredPrograms = [
  {
    id: '1',
    image: require('../assets/images/image 01.jpg'),
    instructor: 'Prof. Kim Jiyoung',
    title: 'Introduction to Korean Language and Culture',
    tag: 'Beginner-friendly',
  },
  {
    id: '2',
    image: require('../assets/images/image 02.jpg'),
    instructor: 'Dr. Lee Minho',
    title: 'AI & Smart Systems in Korean Industry',
    tag: 'Trending',
  },
  {
    id: '3',
    image: require('../assets/images/image 03.jpg'),
    instructor: 'Prof. Park Sohyun',
    title: 'Studying Business in Korea: A Global Approach',
    tag: 'Career-ready',
  },
];

const COLORS = {
  ink: '#0b2a4a',
  sub: '#475569',
  card: '#ffffff',
  border: '#e5e7eb',
  brand: '#0b3b79',
  shadow: '#000',
};

export default function FeaturedCourses() {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState(0);

  /** ⬆️ Plus grand : plus large sur l’écran, capé à 760px */
  const CARD_WIDTH = useMemo(() => {
    const w = Math.min(760, Math.max(320, width * 0.92)); // avant: 0.82 & max 520
    return Math.round(w);
  }, [width]);

  /** ⬆️ Image plus haute (ratio 0.62 au lieu de 0.56) */
  const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 0.62);
  const CARD_HEIGHT = IMAGE_HEIGHT + 168; // un peu plus pour le contenu

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionEyebrow}>FEATURED</Text>
      <Text style={styles.sectionTitle}>Explore Our Featured Programs</Text>
      <Text style={styles.sectionSub}>Curated courses taught by experienced professors in Korea</Text>

      <Carousel
        data={featuredPrograms}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        loop
        autoPlay
        autoPlayInterval={3600}
        scrollAnimationDuration={900}
        mode="parallax"
        pagingEnabled
        onSnapToItem={(i) => setActive(i)}
        style={{ alignSelf: 'center', marginTop: 10 }}
        renderItem={({ item, index }) => (
          <Card
            item={item}
            width={CARD_WIDTH}
            imageHeight={IMAGE_HEIGHT}
            isActive={index === active}
          />
        )}
      />

      {/* ⬆️ Dots plus grands */}
      <View style={styles.dotsRow} accessibilityRole="tablist">
        {featuredPrograms.map((_, i) => (
          <View
            key={String(i)}
            style={[styles.dot, i === active && styles.dotActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === active }}
          />
        ))}
      </View>
    </View>
  );
}

function Card({ item, width, imageHeight, isActive }) {
  return (
    <View
      style={[
        styles.card,
        {
          width,
          transform: [{ scale: isActive ? 1 : 0.985 }], // léger zoom carte active
        },
      ]}
    >
      <View style={{ width: '100%', height: imageHeight }}>
        <ImageBackground source={item.image} style={styles.image} resizeMode="cover">
          {!!item.tag && (
            <View style={styles.tagChip}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.imageTitleWrap} pointerEvents="none">
            <Text numberOfLines={2} style={styles.imageTitle}>
              {item.title}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.cardContent}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.instructor} numberOfLines={1}>
            {item.instructor}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Pressable
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${item.title}`}
            style={({ pressed }) => [
              styles.ctaBtn,
              pressed && { transform: [{ translateY: 1 }] },
            ]}
          >
            <Text style={styles.ctaText}>View details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  sectionEyebrow: {
    fontSize: 13, // ⬆️
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.sub,
    fontWeight: '900',
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 28, // ⬆️
    color: COLORS.ink,
    fontWeight: '800',
    textAlign: 'center',
  },
  sectionSub: {
    marginTop: 8,
    fontSize: 15, // ⬆️
    color: COLORS.sub,
    textAlign: 'center',
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20, // ⬆️
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: COLORS.shadow, shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 4 },
      default: {},
    }),
  },

  image: { width: '100%', height: '100%' },

  tagChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 7, // ⬆️
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { color: COLORS.ink, fontWeight: '800', fontSize: 12 },

  imageTitleWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
  },
  imageTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18, // ⬆️
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  cardContent: {
    padding: 16, // ⬆️
  },
  instructor: {
    fontSize: 15, // ⬆️
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 4,
  },
  title: {
    fontSize: 14, // ⬆️
    color: COLORS.sub,
    lineHeight: 20,
  },

  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ctaBtn: {
    backgroundColor: COLORS.brand,
    paddingVertical: 12, // ⬆️
    paddingHorizontal: 16, // ⬆️
    borderRadius: 12, // ⬆️
    ...Platform.select({
      ios: { shadowColor: COLORS.shadow, shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 14 }, // ⬆️

  dotsRow: {
    flexDirection: 'row',
    gap: 8, // ⬆️
    marginTop: 14, // ⬆️
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8, // ⬆️
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cdd6e5',
  },
  dotActive: {
    width: 22, // ⬆️
    backgroundColor: COLORS.brand,
  },
});
