import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'user';
        const isNewUser = userData.isNewUser || false;

        if (isNewUser) {
          await updateDoc(userDocRef, { isNewUser: false });
          router.replace('/onboarding');
        } else if (role === 'superadmin' || role === 'admin') {
          router.replace('/admin');
        } else if (role === 'manager') {
          router.replace('/manager');
        } else {
          router.replace('/user/dashboard');
        }
      } else {
        Alert.alert('Erreur', 'Utilisateur introuvable dans la base.');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      Alert.alert('Erreur', 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/sunrise.jpg')} style={styles.bg} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.cardContainer}>

              {/* Left panel */}
              <View style={styles.leftPanel}>
                <Text style={styles.logo}>🪄 KOEDU Bridge</Text>
                <Text style={styles.welcome}>Welcome!</Text>
                <Text style={styles.subWelcome}>To Our New Platform</Text>
                <Text style={styles.description}>
                  Explore study opportunities in Korea and access your dashboard, applications, and more.
                </Text>
                <View style={styles.socialRow}>
                  <Text style={styles.socialIcon}>🔗</Text>
                  <Text style={styles.socialIcon}>📘</Text>
                  <Text style={styles.socialIcon}>📸</Text>
                </View>
              </View>

              {/* Right panel */}
              <View style={styles.rightPanel}>
                <Text style={styles.title}>Sign In</Text>

                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Text style={styles.eye}>{secure ? '👁️' : '🙈'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsRow}>
                  <Text style={styles.checkboxText}>☑ Remember me</Text>
                  <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                  <Text style={styles.link}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  leftPanel: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcome: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subWelcome: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  socialIcon: {
    fontSize: 22,
    color: '#fff',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eye: {
    fontSize: 18,
    marginLeft: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkboxText: {
    color: '#ccc',
    fontSize: 14,
  },
  forgotText: {
    color: '#ccc',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#f42b5d',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    color: '#ccc',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
