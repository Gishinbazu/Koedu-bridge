import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Footer from '../../components/Footer';
import { auth, db } from '../../services/firebase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function UserDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          Alert.alert('Erreur', 'Compte introuvable.');
          router.replace('/auth/login');
          return;
        }
        setUserData(docSnap.data());
        setLoading(false);
      } catch (err) {
        console.error(err);
        Alert.alert('Erreur', 'Impossible de récupérer les données.');
      }
    });
    return unsubscribe;
  }, []);

  if (loading) return <View style={styles.loading}><Text>Chargement...</Text></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4' }}
            style={styles.videoBackground}
            resizeMode="cover"
            shouldPlay
            isLooping
            isMuted
          />
          <View style={styles.overlay}>
            <Animated.View style={[styles.centerContent, { opacity: fadeAnim }]}>
              <Text style={styles.heroTitle}>Bienvenue {userData?.displayName || 'Utilisateur'} 👋</Text>
              <Text style={[
                styles.statusBadge,
                userData?.status === 'accepted' && styles.accepted,
                userData?.status === 'rejected' && styles.rejected,
                (!userData?.status || userData?.status === 'pending') && styles.pending
              ]}>
                {userData?.status === 'accepted' ? '✅ Accepté' : userData?.status === 'rejected' ? '❌ Rejeté' : '🕒 En attente'}
              </Text>
              {userData?.role && <Text style={styles.heroSubtitle}>🎓 Rôle : {userData.role}</Text>}
              <Text style={styles.heroSubtitle}>KOEDU Bridge facilite votre admission, visa et arrivée en Corée.</Text>
            </Animated.View>

            <View style={styles.overlayButtons}>
              <Animated.View style={[styles.cardAction, { backgroundColor: '#facc15cc', transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity onPress={() => router.push('/user/consent')}>
                  <Text style={styles.cardTitle}>📨 Commencer maintenant</Text>
                  <Text style={styles.cardDesc}>Soumettez votre candidature dès aujourd’hui.</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.cardAction, { backgroundColor: '#60a5facc', transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/user/gallery', params: { from: 'dashboard' } })}>
                  <Text style={styles.cardTitle}>🎓 Voir les universités</Text>
                  <Text style={styles.cardDesc}>Découvrez notre sélection d’universités coréennes.</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.cardAction, { backgroundColor: '#34d399cc', transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity onPress={() => router.push('/user/universityMap')}>
                  <Text style={styles.cardTitle}>📍 Carte des universités</Text>
                  <Text style={styles.cardDesc}>Visualisez les universités sur la carte.</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[styles.cardAction, { backgroundColor: '#c084fccc', transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity onPress={() => router.push('/user/status')}>
                  <Text style={styles.cardTitle}>📊 Voir mon statut</Text>
                  <Text style={styles.cardDesc}>Consultez l’état actuel de votre dossier.</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* ⬇️ Footer après le contenu */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  scrollContainer: {
    flexGrow: 1,
  },

  videoContainer: { position: 'relative' },
  videoBackground: {
    width: screenWidth,
    height: screenHeight - 60,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 210,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingTop: 90,
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 22,
    color: '#f3f4f6',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 12,
    color: '#fff',
    textAlign: 'center',
  },
  accepted: { backgroundColor: '#10b981' },
  rejected: { backgroundColor: '#ef4444' },
  pending: { backgroundColor: '#f59e0b' },

  overlayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    marginBottom: 40,
  },
  cardAction: {
    width: 180,
    height: 180,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
