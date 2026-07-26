import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  useWindowDimensions,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Props:
 *  - items?: [{ question: string, answer: string }]
 *  - title?: string
 *  - theme?: { surface, surfaceAlt, stroke, text, subText, brand, chipBg }
 *  - dense?: boolean (reduces paddings)
 */
export default function FAQSection({
  items,
  title = '❓ Frequently Asked Questions',
  theme,
  dense = false,
}) {
  const { width } = useWindowDimensions();
  const isSmall = width <= 520;

  const palette = useMemo(
    () => ({
      surface:   theme?.surface   ?? '#ffffff',
      surfaceAlt:theme?.surfaceAlt?? 'rgba(255,255,255,0.9)',
      stroke:    theme?.stroke    ?? '#e5e7eb',
      text:      theme?.text      ?? '#0b2a4a',
      subText:   theme?.subText   ?? '#48566a',
      brand:     theme?.brand     ?? '#0b3b79',
      chipBg:    theme?.chipBg    ?? '#f7fafc',
    }),
    [theme]
  );

  const data = items ?? [
    {
      question: 'What if I’m on the waiting list?',
      answer:
        'If you’re placed on a waiting list, you may be offered admission if someone else declines their offer.',
    },
    {
      question: 'How do I pay tuition fees?',
      answer:
        'You’ll receive instructions on how and when to pay after you’re admitted. Payments are usually made by bank transfer.',
    },
    {
      question: 'What does ‘Unqualified’ mean?',
      answer:
        'It means that you didn’t meet the basic requirements for the program, such as GPA, documents, or deadlines.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const onToggle = (idx) => {
    LayoutAnimation.configureNext({
      duration: 220,
      create:  { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update:  { type: LayoutAnimation.Types.easeInEaseOut },
      delete:  { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.chipBg, borderTopColor: palette.stroke },
        isSmall && styles.containerMobile,
        dense && { paddingVertical: 12 },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[
          styles.header,
          { color: palette.text },
          isSmall && styles.headerMobile,
          dense && { marginBottom: 10 },
        ]}
      >
        {title}
      </Text>

      <View style={[styles.list, { gap: isSmall ? 8 : 12 }]}>
        {data.map((item, idx) => (
          <FAQItem
            key={idx}
            index={idx}
            isOpen={openIndex === idx}
            question={item.question}
            answer={item.answer}
            onToggle={() => onToggle(idx)}
            palette={palette}
            compact={dense || isSmall}
          />
        ))}
      </View>
    </View>
  );
}

function FAQItem({ index, isOpen, question, answer, onToggle, palette, compact }) {
  // Animated chevron rotation
  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotateZ = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.stroke,
          shadowOpacity: Platform.OS === 'android' ? 0.06 : 0.08,
        },
      ]}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`FAQ item ${index + 1}: ${question}`}
        accessibilityState={{ expanded: !!isOpen }}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={({ pressed }) => [
          styles.row,
          { paddingVertical: compact ? 12 : 14, paddingHorizontal: compact ? 12 : 16 },
          pressed && Platform.OS !== 'android' ? { opacity: 0.7 } : null,
        ]}
      >
        <View style={styles.qWrap}>
          <Text style={[styles.qText, { color: palette.text }]}>{question}</Text>
          <Text style={[styles.sub, { color: palette.subText }]}>Tap to {isOpen ? 'collapse' : 'expand'}</Text>
        </View>

        <Animated.View style={[styles.chevron, { transform: [{ rotateZ }] }]}>
          {/* simple chevron without icon libs */}
          <Text style={[styles.chevronGlyph, { color: palette.brand }]}>›</Text>
        </Animated.View>
      </Pressable>

      {isOpen && (
        <View style={{ paddingHorizontal: compact ? 12 : 16, paddingBottom: compact ? 12 : 14 }}>
          <Text style={[styles.answer, { color: palette.subText }]}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  containerMobile: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 14,
  },
  headerMobile: {
    fontSize: 20,
    marginBottom: 12,
  },
  list: {
    width: '100%',
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qWrap: {
    flex: 1,
    paddingRight: 12,
  },
  qText: {
    fontSize: 16,
    fontWeight: '800',
  },
  sub: {
    marginTop: 2,
    fontSize: 12,
    opacity: 0.75,
  },
  chevron: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  chevronGlyph: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '900',
  },
  answer: {
    fontSize: 14.5,
    lineHeight: 21,
  },
});
