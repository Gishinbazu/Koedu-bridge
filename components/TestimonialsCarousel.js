import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import testimonials from '../data/testimonials';
import StarRating from './StarRating';

export default function TestimonialsCarousel() {
  const width = Dimensions.get('window').width;
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Student Experiences with KOEDU Bridge</Text>
      <Carousel
        data={testimonials}
        width={width * 0.95}
        height={570}
        autoPlay
        loop
        scrollAnimationDuration={1200}
        style={styles.carousel}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.title}>"{item.title}"</Text>
            <StarRating rating={item.rating} />
            <TouchableOpacity
              onPress={() => router.push(`/blog/${item.slug}`)}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Read full story →</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  carousel: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 420,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#003366',
  },
  title: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  btn: {
    marginTop: 12,
    backgroundColor: '#003366',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
