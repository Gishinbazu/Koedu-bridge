// components/AdmissionsBanner.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { memo, useMemo } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

/**
 * Props (all optional):
 *  - theme: { surface, stroke, text, subText, brand }  // falls back to system scheme if not provided
 *  - imageSource: any                                   // require(...) or { uri }
 *  - title: string
 *  - subtitle: string
 *  - href: string                                       // route to push
 */
function AdmissionsBanner({
  theme,
  imageSource = require('../assets/images/koedu.png'),
  title = 'Starting the admissions process?',
  subtitle = 'Check our step-by-step guide – what to do, when, and how.',
  href = '/info/admissions-guide',
}) {
  const router = useRouter();
  const scheme = useColorScheme?.() || 'light';
  const { width } = useWindowDimensions();
  const isSmall = width < 520;

  // Fallback palette if no theme passed
  const palette = useMemo(() => {
    if (theme) return theme;
    const base = scheme === 'dark'
      ? { text: '#F8FAFC', subText: '#CBD5E1', surface: '#0B1020', stroke: '#1E293B', brand: '#3B82F6' }
      : { text: '#0B2A4A', subText: '#475569', surface: '#FFFFFF', stroke: '#E5E7EB', brand: '#0B3B79' };
    return base;
  }, [scheme, theme]);

  // Height scales a bit with width, with clear minimums
  const height = useMemo(() => {
    const h = Math.round(width * 0.24);
    const min = isSmall ? 180 : 220;
    const max = 320;
    return Math.max(min, Math.min(max, h));
  }, [width, isSmall]);

  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel="Open admissions guide"
      style={({ hovered, pressed }) => [
        styles.cardWrap,
        { height, borderColor: palette.stroke, backgroundColor: palette.surface },
        hovered && Platform.OS === 'web' ? styles.cardHover : null,
        pressed && styles.cardPressed,
        isSmall && mobile.cardWrap,
      ]}
    >
      <ImageBackground
        source={imageSource}
        style={styles.media}
        imageStyle={styles.mediaImage}
        resizeMode="cover"
      >
        {/* Gradient for legibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.55)']}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Content */}
        <View style={[styles.inner, isSmall && mobile.inner]}>
          <View style={[styles.textCol, isSmall && mobile.textCol]}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { borderColor: 'rgba(255,255,255,0.4)' }]}>
                <Ionicons name="school-outline" size={12} color="#fff" />
                <Text style={styles.badgeText}>Admissions</Text>
              </View>
            </View>

            <Text
              style={[
                styles.title,
                isSmall ? mobile.title : null,
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                isSmall ? mobile.subtitle : null,
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>

            <View style={styles.ctaRow}>
              <View style={styles.ctaPill}>
                <Text style={styles.ctaText}>Open guide</Text>
                <View style={styles.ctaIconCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#0b1020" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export default memo(AdmissionsBanner);

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: 16,
    // soft depth
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  cardHover: {
    transform: [{ translateY: -1 }],
    boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.997 }],
  },
  media: {
    flex: 1,
  },
  mediaImage: {
    // keeps edges crisp
    transform: [{ scale: 1.03 }],
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  textCol: {
    maxWidth: 680,
  },
  badgeRow: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  ctaText: {
    color: '#0b1020',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  ctaIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD166',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mobile = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 12,
    borderRadius: 14,
  },
  inner: {
    padding: 16,
  },
  textCol: {
    maxWidth: '100%',
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
});
