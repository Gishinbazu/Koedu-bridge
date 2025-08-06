import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function StorySection() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../assets/images/koedu.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Our Mission at KOEDU Bridge</Text>
        <Text style={styles.bodyText}>
          KOEDU Bridge was created to simplify and support the journey of international students
          who wish to study in Korea. Our goal is to provide clear access to verified university
          programs, transparent application steps, and reliable guidance from start to finish.
          Whether you're applying for a Bachelor’s, Master’s, or language program, KOEDU Bridge
          connects you with your academic future in Korea.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/info/about')}>
          <Text style={styles.ctaText}>Learn more about us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: screenWidth > 700 ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    gap: 20,
  },
  imageWrapper: {
    width: screenWidth > 700 ? 300 : '100%',
    aspectRatio: 1, // ✅ carré
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: '#f3c76b',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: '#003366',
    fontWeight: '600',
    fontSize: 16,
  },
});
