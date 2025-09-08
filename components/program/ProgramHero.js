import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import ProgramMetaRow from './ProgramMetaRow';

/**
 * Bandeau haut de page programme, avec cover optionnelle.
 * Props:
 * - title, university, level, semester
 * - coverImage (URL) optionnel
 * - onApply (fn) optionnel
 */
export default function ProgramHero({
  title = 'Program title',
  university = 'University',
  level = '—',
  semester,
  coverImage,
  onApply,
}) {
  const content = (
    <View style={s.inner}>
      <Text style={s.title} numberOfLines={2}>{title}</Text>
      <ProgramMetaRow university={university} level={level} semester={semester} style={{ marginTop: 6 }} />
      {onApply && (
        <Pressable onPress={onApply} style={({ pressed }) => [s.cta, pressed && { opacity: 0.95 }]}>
          <Text style={s.ctaText}>Apply now</Text>
        </Pressable>
      )}
    </View>
  );

  if (coverImage) {
    return (
      <ImageBackground
        source={{ uri: coverImage }}
        style={s.bg}
        resizeMode="cover"
        imageStyle={{ opacity: 0.95 }}
      >
        <View style={s.overlay} />
        {content}
      </ImageBackground>
    );
  }

  return <View style={[s.bg, { backgroundColor: '#0b1e3a' }]}>{content}</View>;
}

const s = StyleSheet.create({
  bg: {
    width: '100%',
    minHeight: 180,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  inner: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignSelf: 'center',
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7cc53',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  ctaText: { color: '#002244', fontWeight: '800', fontSize: 15 },
});
