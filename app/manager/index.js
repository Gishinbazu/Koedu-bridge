import { Audio, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { auth, db } from '../../services/firebase';
import RightBarMenu from './RightBarMenu';

const screenWidth = Dimensions.get('window').width;

const features = [
  { label: '🏠 Dashboard', desc: 'Aperçu des candidatures.', bg: '#3366ff', path: '/manager/ManagerDashboard' },
  { label: '📊 Statistics', desc: 'Voir les performances.', bg: '#28a745', path: '/manager/statistics' },
  { label: '👤 Gestion des utilisateurs', desc: 'Gérer les comptes.', bg: '#ff9800', path: '/manager/manage-users' },
  { label: '📅 Calendar', desc: 'Voir les événements.', bg: '#17a2b8', path: '/manager/calendar' },
  { label: '💬 Team Chat', desc: 'Discuter avec l’équipe.', bg: '#6f42c1', path: '/manager/chat' },
  { label: '👥 Team', desc: 'Voir les membres.', bg: '#dc3545', path: '/manager/team' },
];

export default function ManagerHome() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [clickSound, setClickSound] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserData(snap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sound/click.mp3')
      );
      setClickSound(sound);
    };
    loadSound();
    return () => {
      if (clickSound) clickSound.unloadAsync();
    };
  }, []);

  const handlePress = async (path, scale) => {
    Vibration.vibrate(50);
    if (clickSound) await clickSound.replayAsync();
    scale.value = withSpring(0.95, { damping: 8, stiffness: 150 }, () => {
      scale.value = withSpring(1, { damping: 8, stiffness: 150 });
      setTimeout(() => router.push(path), 150);
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Souhaitez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/auth/login'); // Assure-toi que /auth/login existe
            } catch (error) {
              console.error('Erreur déconnexion :', error);
              Alert.alert('Erreur', 'Échec de la déconnexion. Réessaie.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔒 Barre sticky en haut */}
      <View style={styles.logoStickyBar}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/koedu.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.menuActions}>
            <TouchableOpacity onPress={() => router.push('/manager/profile')}>
              <Text style={styles.menuText}>👤 Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/manager/settings')}>
              <Text style={styles.menuText}>⚙️ Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.menuText, { color: '#dc3545' }]}>🚪 Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 📌 Menu latéral contextuel */}
      <RightBarMenu />

      <Animated.ScrollView
        entering={SlideInLeft.duration(500)}
        exiting={SlideOutLeft.duration(400)}
        contentContainerStyle={styles.mainContent}
      >
        {/* 🎥 Vidéo de fond */}
        <View style={styles.hero}>
          <Video
            source={{ uri: 'https://lily.sunmoon.ac.kr/images/main/main_20250723_pc.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted
            resizeMode="cover"
            shouldPlay
            isLooping
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            <Animated.Text entering={FadeInDown.duration(800)} style={styles.welcomeText}>
              🎓 Bienvenue sur <Text style={styles.highlight}>KOEDU Bridge</Text>
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(300).duration(1000)}
              style={styles.subText}
            >
              Votre portail tout-en-un pour les admissions, les statistiques, et la collaboration en équipe.
            </Animated.Text>
          </View>
        </View>

        {/* 🧩 Grille de fonctionnalités */}
        <View style={styles.grid}>
          {features.map((item, index) => {
            const scale = useSharedValue(1);
            const animatedStyle = useAnimatedStyle(() => ({
              transform: [{ scale: scale.value }],
            }));

            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => handlePress(item.path, scale)}
              >
                <Animated.View
                  entering={FadeInDown.delay(index * 120).duration(600)}
                  style={[styles.card, { backgroundColor: item.bg }, animatedStyle]}
                >
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoStickyBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 50,
  },
  menuActions: {
    flexDirection: 'row',
    gap: 15,
  },
  menuText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
  },
  mainContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  hero: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  highlight: {
    color: '#facc15',
  },
  subText: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  card: {
    width: screenWidth > 700 ? '30%' : '47%',
    minHeight: 180,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 16,
    color: '#f0f0f0',
    lineHeight: 22,
  },
});
