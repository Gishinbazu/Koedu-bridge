import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const featuredPrograms = [
  {
    id: '1',
    image: require('../assets/images/image 01.jpg'),
    instructor: 'Prof. Kim Jiyoung',
    title: 'Introduction to Korean Language and Culture',
  },
  {
    id: '2',
    image: require('../assets/images/image 02.jpg'),
    instructor: 'Dr. Lee Minho',
    title: 'AI & Smart Systems in Korean Industry',
  },
  {
    id: '3',
    image: require('../assets/images/image 03.jpg'),
    instructor: 'Prof. Park Sohyun',
    title: 'Studying Business in Korea: A Global Approach',
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const IMAGE_HEIGHT = CARD_WIDTH * 0.5; // image réduite
const CARD_HEIGHT = IMAGE_HEIGHT + 100;

export default function FeaturedCourses() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>📚 Explore Our Featured Programs</Text>

      <Carousel
        data={featuredPrograms}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        autoPlay
        loop
        scrollAnimationDuration={1200}
        style={{ alignSelf: 'center' }}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.instructor}>{item.instructor}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 50,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 26,
    color: '#003366',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 14,
  },
  instructor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
});
