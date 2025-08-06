import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'user',
        createdAt: new Date(),
      });
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Inscription échouée', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/sunrise.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={[
                styles.container,
                { flexDirection: isMobile ? 'column' : 'row' },
              ]}
            >
              <View style={[styles.leftBox, isMobile && { padding: 20, alignItems: 'center' }]}>
                <Text style={styles.welcome}>Welcome!</Text>
                <Text style={styles.desc}>
                  Inscrivez-vous pour rejoindre KOEDU Bridge et commencer votre voyage étudiant en Corée.
                </Text>
                <TouchableOpacity style={styles.learnMoreBtn} onPress={() => setInfoVisible(true)}>
                  <Text style={styles.learnMoreText}>En savoir plus</Text>
                </TouchableOpacity>
              </View>

              <Animated.View
                style={{
                  transform: [{ translateY }],
                  opacity: fadeAnim,
                  flex: 1,
                  marginTop: isMobile ? 20 : 0,
                }}
              >
                <BlurView intensity={50} tint="light" style={styles.rightCard}>
                  <TouchableOpacity onPress={() => router.push('/')} style={styles.backBtn}>
                    <Text style={styles.backText}>← Accueil</Text>
                  </TouchableOpacity>

                  <Text style={styles.signInTitle}>Sign Up</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nom complet"
                    placeholderTextColor="#ccc"
                    value={name}
                    onChangeText={setName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#ccc"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleSignup}>
                    <Text style={styles.submitText}>S'inscrire</Text>
                  </TouchableOpacity>

                  {/* 🔐 Lien "J’ai déjà un compte" */}
                  <View style={styles.loginRedirect}>
                    <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                      <Text style={styles.loginLink}> Se connecter</Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* ✅ Modal de confirmation */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Inscription réussie !</Text>
              <Text style={styles.modalText}>Bienvenue sur KOEDU Bridge.</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                router.replace('/auth/login');
              }}>
                <Text style={styles.modalBtn}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ✅ Modal En savoir plus */}
        <Modal visible={infoVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>À propos de KOEDU Bridge</Text>
              <Text style={styles.modalText}>
                KOEDU Bridge vous accompagne dans toutes les étapes pour venir étudier en Corée :
                choix de programme, candidature, bourses, visa et arrivée.
              </Text>
              <TouchableOpacity onPress={() => setInfoVisible(false)}>
                <Text style={styles.modalBtn}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 50,
    gap: 20,
  },
  leftBox: {
    flex: 1,
    justifyContent: 'center',
    padding: 50,
  },
  welcome: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
  },
  learnMoreBtn: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#fff',
    fontWeight: '600',
  },
  rightCard: {
    flex: 1,
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  backBtn: {
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginRedirect: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLink: {
    color: '#ffb347',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#003366',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
