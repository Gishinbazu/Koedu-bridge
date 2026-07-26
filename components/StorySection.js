// components/StorySection.js
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

/**
 * Optional props:
 *   - theme?: { surface, stroke, text, subText, brand, brandText }
 *     If not provided, it will auto-pick based on system color scheme.
 */
export default function StorySection({ theme: themeProp }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const scheme = useColorScheme?.() || 'light';

  // Fallback theme if none passed (keeps consistent with your app vibes)
  const theme = useMemo(() => {
    if (themeProp) return themeProp;
    return scheme === 'dark'
      ? {
          surface: '#121212',
          stroke: '#262626',
          text: '#E5E7EB',
          subText: '#CBD5E1',
          brand: '#F59E0B',
          brandText: '#0B1A2A',
          chipBg: '#1F2937',
          chipText: '#E5E7EB',
        }
      : {
          surface: '#FFFFFF',
          stroke: '#E5E7EB',
          text: '#0B2A4A',
          subText: '#475569',
          brand: '#F3C76B',
          brandText: '#0B2A4A',
          chipBg: '#F8FAFC',
          chipText: '#0B2A4A',
        };
  }, [scheme, themeProp]);

  return (
    <View style={[styles.outer]}>
      <View
        style={[
          styles.card,
          isWide ? styles.cardRow : styles.cardCol,
          {
            backgroundColor: theme.surface,
            borderColor: theme.stroke,
            // subtle elevation on Android, shadow on iOS/web
            ...Platform.select({
              android: { elevation: 2 },
              ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
              default: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 10 } },
            }),
          },
        ]}
      >
        {/* Image side */}
        <View style={[styles.mediaWrap, isWide ? styles.mediaWide : styles.mediaNarrow]}>
          <Image
            source={require('../assets/images/koedu.png')}
            style={styles.image}
            // Ensures round corners on Android too
            resizeMode="cover"
          />
        </View>

        {/* Content side */}
        <View style={[styles.content, isWide ? styles.contentWide : styles.contentNarrow]}>
          <Text style={[styles.kicker, { color: theme.subText }]}>About KOEDU Bridge</Text>

          <Text style={[styles.heading, { color: theme.text }]}>
            Our Mission at KOEDU Bridge
          </Text>

          <Text style={[styles.body, { color: theme.subText }]}>
            KOEDU Bridge was created to simplify and support the journey of international students
            who wish to study in Korea. Our goal is to provide clear access to verified university
            programs, transparent application steps, and reliable guidance from start to finish.
            Whether you're applying for a Bachelor’s, Master’s, or language program, KOEDU Bridge
            connects you with your academic future in Korea.
          </Text>

          {/* Quick highlights */}
          <View style={styles.chipsRow}>
            {['Verified programs', 'Guided admissions', 'Student-first support'].map((c) => (
              <View
                key={c}
                style={[
                  styles.chip,
                  { backgroundColor: theme.chipBg, borderColor: theme.stroke },
                ]}
              >
                <Text style={[styles.chipText, { color: theme.chipText }]}>{c}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/info/about')}
            android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: theme.brand, borderColor: theme.stroke },
              pressed && { transform: [{ translateY: 1 }] },
            ]}
          >
            <Text style={[styles.ctaText, { color: theme.brandText }]}>Learn more about us</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingHorizontal: 16,
  },

  // Card container
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardCol: {
    flexDirection: 'column',
  },

  // Media
  mediaWrap: {
    overflow: 'hidden',
  },
  mediaWide: {
    width: 380,
    maxWidth: '45%',
    aspectRatio: 4 / 3,
  },
  mediaNarrow: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Content area
  content: {
    flex: 1,
    padding: 18,
    gap: 10,
  },
  contentWide: {
    padding: 22,
  },
  contentNarrow: {
    padding: 16,
  },

  kicker: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.9,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  body: {
    fontSize: 15.5,
    lineHeight: 24,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  chipText: {
    fontWeight: '700',
    fontSize: 12.5,
  },

  ctaBtn: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    ...Platform.select({
      android: { elevation: 0 },
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      default: { boxShadow: '0 4px 10px rgba(0,0,0,0.08)' },
    }),
  },
  ctaText: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
