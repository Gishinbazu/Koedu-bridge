import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BlogCard({ university }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/blog/${university.slug}`)}
    >
      <Image
        source={
          typeof university.images[0] === 'number'
            ? university.images[0]
            : { uri: university.images[0]?.uri || university.images[0] }
        }
        style={styles.cardImage}
        resizeMode="contain" // dézoom pour garder le cadre clean
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{university.title}</Text>
        <Text style={styles.cardDate}>{university.date}</Text>
        <Text numberOfLines={2} style={styles.cardDesc}>{university.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#444',
  },
});
