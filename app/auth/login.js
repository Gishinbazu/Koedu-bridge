// app/auth/login.js
import { useRouter } from 'expo-router';
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
    const emailClean = (email || '').trim().toLowerCase();
    if (!emailClean || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      // 0) Si on était connecté anonymement quelque part, on ferme la session
      if (auth.currentUser?.isAnonymous) {
        try { await signOut(auth); } catch {}
      }

      // 1) Persistance (Web uniquement)
      try { await setPersistence(auth, browserLocalPersistence); } catch {}

      // 2) Auth email + mot de passe
      const { user } = await signInWithEmailAndPassword(auth, emailClean, password);
      console.log('[auth] signed-in uid =', user.uid);

      // 3) (Optionnel) refresh des claims
      try { await user.getIdToken(true); } catch {}

      // 4) Lecture stricte du profil Firestore (NE PAS créer ici)
      const userRef = doc(db, 'users', auth.currentUser.uid);
      let snap;
      try {
        snap = await getDoc(userRef);
      } catch (e) {
        console.error('[login/getDoc]', e?.code, e?.message);
        throw e; // remonte au catch
      }

      if (!snap.exists()) {
        // Pas de doc → refuser la connexion et déconnecter l’utilisateur
        try { await signOut(auth); } catch {}
        Alert.alert(
          'Compte non configuré',
          "Aucun profil 'users/{uid}' n'existe pour cet utilisateur. Inscris-toi ou contacte un admin."
        );
        return;
      }

      // 5) Mise à jour non bloquante
      try { await updateDoc(userRef, { lastLoginAt: serverTimestamp() }); }
      catch (e) { console.warn('[login/updateDoc lastLoginAt]', e?.code, e?.message); }

      // 6) Routage selon le rôle
      const data = snap.data() || {};
      const role = data.role || 'user';
      if (role === 'superadmin' || role === 'admin') router.replace('/admin');
      else if (role === 'manager') router.replace('/manager');
      else router.replace('/user/dashboard');

    } catch (e) {
      console.error('[login] error', e?.code, e?.message);
      let msg = 'Identifiants invalides.';
      if (
        e?.code === 'auth/invalid-email' ||
        e?.code === 'auth/wrong-password' ||
        e?.code === 'auth/user-not-found' ||
        e?.code === 'auth/invalid-credential'
      ) msg = 'Email ou mot de passe incorrect.';
      else if (e?.code === 'auth/too-many-requests')
        msg = 'Trop de tentatives. Réessayez plus tard.';
      else if (e?.code === 'auth/unauthorized-domain')
        msg = "Domaine non autorisé (Firebase Auth → Settings → Authorized domains).";
      else if (e?.code === 'permission-denied')
        msg = "Permissions Firestore insuffisantes pour lire 'users/{uid}'.";

      Alert.alert('Connexion impossible', msg);
    } finally {
      setLoading(false);
    }
  };

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
            <View style={styles.cardContainer}>
              {/* Panneau gauche */}
              <View style={styles.leftPanel}>
                <Text style={styles.logo}>🪄 KOEDU Bridge</Text>
                <Text style={styles.welcome}>Bienvenue !</Text>
                <Text style={styles.subWelcome}>Connectez-vous à la plateforme</Text>
                <Text style={styles.description}>
                  Accédez à votre espace : candidatures, tableau de bord, documents…
                </Text>
                <View style={styles.socialRow}>
                  <Text style={styles.socialIcon}>🔗</Text>
                  <Text style={styles.socialIcon}>📘</Text>
                  <Text style={styles.socialIcon}>📸</Text>
                </View>
              </View>

              {/* Panneau droit */}
              <View style={styles.rightPanel}>
                <Text style={styles.title}>Se connecter</Text>

                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Mot de passe"
                    placeholderTextColor="#ccc"
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setSecure(!secure)}>
                    <Text style={styles.eye}>{secure ? '👁️' : '🙈'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsRow}>
                  <Text style={styles.checkboxText}>☑ Se souvenir de moi</Text>
                  <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                  <Text style={styles.link}>Pas de compte ? S’inscrire</Text>
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
  bg: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 32 },
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
  leftPanel: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  logo: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  welcome: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  subWelcome: { color: '#fff', fontSize: 16, marginBottom: 16 },
  description: { color: '#ddd', fontSize: 14, lineHeight: 20 },
  socialRow: { flexDirection: 'row', marginTop: 20, gap: 16 },
  socialIcon: { fontSize: 22, color: '#fff' },
  rightPanel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
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
  passwordInput: { flex: 1, fontSize: 16, color: '#000' },
  eye: { fontSize: 18, marginLeft: 10 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  checkboxText: { color: '#ccc', fontSize: 14 },
  forgotText: { color: '#ccc', fontSize: 14, textDecorationLine: 'underline' },
  button: { backgroundColor: '#f42b5d', paddingVertical: 14, borderRadius: 12, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 18, color: '#ccc', fontSize: 14, textDecorationLine: 'underline' },
});
