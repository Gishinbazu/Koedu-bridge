import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdmissionsBanner() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('/info/admissions-guide')}>
      <ImageBackground
        source={require('../assets/images/koedu.png')} // 📌 Change l'image si besoin
        style={styles.banner}
        imageStyle={styles.image}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Starting the admissions process?</Text>
          <Text style={styles.subtitle}>
            Check our step-by-step guide – what to do, when, and how.
          </Text>
          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  image: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(200, 0, 100, 0.7)', // 🎨 Rose/magenta transparent
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  arrow: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
});
