import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import Lottie from 'lottie-react';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { auth } from '../../services/firebase';

export default function LogoutScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const doLogout = async () => {
      try {
        await signOut(auth);

        // Vibration (except on web)
        if (Platform.OS !== 'web') {
          Vibration.vibrate(300);
        }

        if (isMounted) fadeIn();

        setTimeout(() => {
          if (isMounted) {
            router.replace('/');
          }
        }, 6000);
      } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
      }
    };

    doLogout();

    return () => {
      isMounted = false;
    };
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {/* 🔵 Logo KOEDU */}
        <Image
          source={require('../../assets/images/koedu.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* ✅ Animation de déconnexion */}
        <Lottie
          animationData={require('../../assets/lottie/Disconnected Button.json')}
          loop={false}
          autoplay
          style={styles.lottie}
        />

        {/* ✅ Message animé */}
        <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Déconnexion réussie 👋</Text>
          <Text style={styles.subtitle}>
            Vous avez été déconnecté de votre compte <Text style={styles.bold}>KOEDU Bridge</Text>.
            <Text style={styles.highlight}> Redirection automatique en cours...</Text>
          </Text>

          <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
            <Text style={styles.buttonText}>🏠 Retour à l'accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondary]}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.buttonText}>🔐 Se reconnecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: Platform.OS === 'web' ? 400 : '90%',
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: 10,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  messageBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#1e3a8a',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  highlight: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  secondary: {
    backgroundColor: '#0ea5e9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
