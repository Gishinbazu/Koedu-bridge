import { useRouter } from 'expo-router';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Alert,
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
  View,
} from 'react-native';
import { auth } from '../../services/firebase';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const router = useRouter();

  // 🔁 Vérifie si l’utilisateur est déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard');
      } else {
        setCheckingUser(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => setShowModal(true))
      .catch((error) => {
        console.error(error);
        switch (error.code) {
          case 'auth/too-many-requests':
            Alert.alert(
              'Trop de tentatives',
              'Vous avez tenté trop de fois. Veuillez patienter quelques minutes avant de réessayer.'
            );
            break;
          case 'auth/user-not-found':
            Alert.alert(
              'Email introuvable',
              'Aucun utilisateur n’est associé à cet email.'
            );
            break;
          case 'auth/invalid-email':
            Alert.alert(
              'Email invalide',
              'L’adresse email saisie n’est pas correcte.'
            );
            break;
          default:
            Alert.alert('Erreur', error.message);
            break;
        }
      });
  };

  const closeModal = () => {
    setShowModal(false);
    router.push('/login');
  };

  if (checkingUser) return null;

  return (
    <ImageBackground
      source={require('../../assets/images/sunrise.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.title}>Réinitialiser le mot de passe</Text>
              <Text style={styles.subtitle}>
                Entrez votre adresse email pour recevoir un lien de réinitialisation.
              </Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Retour à la connexion</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ✅ Modale de confirmation */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📧 Lien envoyé !</Text>
            <Text style={styles.modalText}>Un email de réinitialisation a été envoyé à :</Text>
            <Text style={styles.modalEmail}>{email}</Text>

            <TouchableOpacity style={styles.modalBtn} onPress={closeModal}>
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 3 },
  keyboardView: { flex: 2 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#f3c76b',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#003366',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginVertical: 10,
  },
  modalBtn: {
    backgroundColor: '#003366',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
  },
});