import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../../services/firebase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez entrer votre adresse email.',
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setEmailSent(true);

      Toast.show({
        type: 'success',
        text1: 'Lien envoyé 📬',
        text2: 'Vérifiez votre adresse email.',
      });
    } catch (error) {
      setLoading(false);
      let message = error.message;
      if (error.code === 'auth/user-not-found') {
        message = "Aucun utilisateur n'est associé à cet email.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Adresse email invalide.";
      }

      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: message,
      });
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/sunrise.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scroll}>
              <View style={[styles.card, isMobile && { padding: 20 }]}>
                <Text style={styles.title}>Mot de passe oublié ?</Text>
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

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.6 }]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Envoi en cours...' : emailSent ? 'Renvoyer le lien' : 'Envoyer le lien'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.link}>← Retour à la connexion</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 3,
  },
  keyboardView: {
    flex: 2,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#f3c76b',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#003366',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
