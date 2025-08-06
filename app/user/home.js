import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const images = [
  require('../../assets/images/image 05.jpg'),
  require('../../assets/images/image 02.jpg'),
  require('../../assets/images/image 04.jpg'),
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isLargeScreen = screenWidth > 768;

  return (
    <View style={styles.container}>

      {/* 🔷 Header (sans retour) */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <View style={styles.circle} />
          <Text style={styles.logoText}>KOEDU</Text>
        </View>
      </View>

      {/* 🏫 Hero Section */}
      <View style={styles.heroContainer}>
        <View
          style={[
            styles.hero,
            {
              flexDirection: isLargeScreen ? 'row' : 'column',
              alignSelf: isLargeScreen ? 'center' : 'flex-start',
            },
          ]}
        >
          <Image
            source={images[currentIndex]}
            style={[
              styles.heroImage,
              {
                width: isLargeScreen ? '50%' : '100%',
                height: isLargeScreen ? 500 : 300,
                marginBottom: isLargeScreen ? 0 : 16,
              },
            ]}
            resizeMode="cover"
          />

          <View style={styles.heroText}>
            <Text style={styles.title}>KOEDU BRIDGE</Text>
            <Text style={styles.subtitle}>Une passerelle vers les universités coréennes</Text>
            <Text style={styles.desc}>
              KOEDU BRIDGE est une plateforme numérique qui connecte les étudiants étrangers avec
              les universités coréennes. Elle facilite l’admission, le processus de visa, et
              l’installation des étudiants internationaux, notamment ceux venant d’Afrique.
            </Text>

            <TouchableOpacity
              style={styles.readMore}
              onPress={() => router.push({ pathname: '/user/gallery', params: { from: 'home' } })}
            >
              <Ionicons name="school-outline" size={16} color="#1e3a8a" style={{ marginRight: 6 }} />
              <Text style={styles.readMoreText}>EN SAVOIR PLUS</Text>
            </TouchableOpacity>

            <View style={styles.dots}>
              {images.map((_, idx) => (
                <View
                  key={idx}
                  style={idx === currentIndex ? styles.dotActive : styles.dot}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: '#1e3a8a' }]}
              onPress={() => router.push('/user/universityMap')}
            >
              <Ionicons name="location-outline" size={20} color="white" />
              <Text style={styles.navBtnText}>VOIR LA CARTE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6effa',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    marginRight: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  heroContainer: {
    width: '100%',
    alignItems: 'flex-start',
    minHeight: 400,
    paddingVertical: 30,
  },
  hero: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    width: '100%',
    maxWidth: 1200,
  },
  heroImage: {
    borderRadius: 12,
    marginRight: 10,
  },
  heroText: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#0ea5e9',
    fontWeight: '600',
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 14,
  },
  readMore: {
    backgroundColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e3a8a',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navBtnText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  marqueeContainer: {
  backgroundColor: '#1e3a8a',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginBottom: 16,
},
marqueeText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#fff',
  whiteSpace: 'nowrap',
},

});
