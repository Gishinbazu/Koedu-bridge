import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

/**
 * Composant Breadcrumb remplacé par une bannière défilante horizontale
 */
export default function Breadcrumb({
  text = '📢 Bienvenue sur KOEDU Bridge – La plateforme pour simplifier votre admission, visa et arrivée en Corée du Sud 🇰🇷',
  direction = 'left', // 'left' ou 'right'
  speed = 60, // Plus la valeur est petite, plus le texte défile rapidement
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textWidth === 0 || containerWidth === 0) return;

    const animate = () => {
      animatedValue.setValue(direction === 'left' ? containerWidth : -textWidth);
      Animated.timing(animatedValue, {
        toValue: direction === 'left' ? -textWidth : containerWidth,
        duration: ((textWidth + containerWidth) * speed),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animate());
    };

    animate();
  }, [textWidth, containerWidth, direction]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    backgroundColor: '#dff0ff',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    whiteSpace: 'nowrap',
  },
});
