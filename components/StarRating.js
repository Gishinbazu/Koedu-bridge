import { StyleSheet, Text, View } from 'react-native';

export default function StarRating({ rating = 5 }) {
  const fullStar = '⭐';
  return (
    <View style={styles.container}>
      <Text style={styles.stars}>
        {Array(rating).fill(fullStar).join('')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  stars: {
    fontSize: 18,
    color: '#f4c430',
  },
});
