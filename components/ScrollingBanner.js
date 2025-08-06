import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function ScrollingBanner({
  text = 'Bienvenue sur KOEDU Bridge – Simplifiez votre admission, visa et installation en Corée du Sud.',
  direction = 'left', // 'left' or 'right'
  speed = 60, // plus c’est petit, plus c’est rapide
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
      >
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    overflow: 'hidden',
    backgroundColor: '#dff0ff',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#003366',
    whiteSpace: 'nowrap',
  },
});
