// app/tools/promote-to-admin.js
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getIdTokenResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db } from '../../services/firebase';

// --- Helper: vérifie si l'utilisateur courant est admin ---
// 1) via custom claim (recommandé) ; 2) fallback via users/{uid}.role === "admin"
async function isCurrentUserAdmin() {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const token = await getIdTokenResult(user, true);
    if (token.claims?.admin === true) return true;
  } catch (e) {
    // ignore, on essaie le fallback
  }

  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    const role = snap.data()?.role;
    return role === 'admin';
  } catch {
    return false;
  }
}

export default function PromoteToAdminScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [working, setWorking] = useState(false);

  const functions = useMemo(() => getFunctions(), []);

  useEffect(() => {
    let mounted = true;

    // Vérifie que l'utilisateur est connecté, puis admin
    (async () => {
      try {
        // Si pas connecté, redirige vers login
        if (!auth.currentUser) {
          Alert.alert('Connexion requise', 'Veuillez vous connecter.');
          router.replace('/auth/login'); // adapte si ton chemin est différent
          return;
        }
        const ok = await isCurrentUserAdmin();
        if (!mounted) return;
        if (!ok) {
          Alert.alert('Accès refusé', "Seuls les administrateurs peuvent accéder à cet outil.");
          router.replace('/'); // page publique
          return;
        }
        setAuthorized(true);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  const onPromote = async () => {
    const target = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(target)) {
      Alert.alert('Email invalide', "Merci d'entrer un email valide.");
      return;
    }
    setWorking(true);
    try {
      const fn = httpsCallable(functions, 'setAdminClaim'); // ⚠️ Cloud Function requise
      const res = await fn({ email: target });
      Alert.alert('Succès', `Le rôle admin a été attribué à ${target}.`);
      setEmail('');
    } catch (e) {
      console.error('[setAdminClaim] error:', e);
      Alert.alert('Erreur', e?.message ?? "Impossible de promouvoir cet utilisateur.");
    } finally {
      setWorking(false);
    }
  };

  const onRevoke = async () => {
    const target = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(target)) {
      Alert.alert('Email invalide', "Merci d'entrer un email valide.");
      return;
    }
    setWorking(true);
    try {
      const fn = httpsCallable(functions, 'revokeAdminClaim'); // ⚠️ Cloud Function requise
      const res = await fn({ email: target });
      Alert.alert('Succès', `Le rôle admin a été retiré pour ${target}.`);
      setEmail('');
    } catch (e) {
      console.error('[revokeAdminClaim] error:', e);
      Alert.alert('Erreur', e?.message ?? "Impossible de révoquer cet utilisateur.");
    } finally {
      setWorking(false);
    }
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Initialisation…</Text>
      </View>
    );
  }

  if (!authorized) {
    return (
      <View style={styles.center}>
        <Text>Vérification des droits…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Promote / Revoke Admin</Text>
      <Text style={styles.subtitle}>
        Entrez l’email du compte à promouvoir/révoquer. Cette action appelle une Cloud Function
        sécurisée côté serveur (Firebase Admin SDK).
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="email@exemple.com"
        keyboardType="email-address"
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnPromote]} onPress={onPromote} disabled={working}>
          {working ? <ActivityIndicator /> : <Text style={styles.btnTextDark}>Promote</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnRevoke]} onPress={onRevoke} disabled={working}>
          {working ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextLight}>Revoke</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.hintBox}>
        <Text style={styles.hint}>
          NB : Assure-toi d'avoir déployé les fonctions « setAdminClaim » et « revokeAdminClaim ».
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 20, maxWidth: 700, alignSelf: 'center', width: '100%' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8, color: '#0b3a79' },
  subtitle: { color: '#444', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, height: 48, marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1 },
  btnPromote: { backgroundColor: '#f7cc53' },
  btnRevoke: { backgroundColor: '#0b3a79' },
  btnTextDark: { color: '#002244', fontWeight: '700' },
  btnTextLight: { color: '#fff', fontWeight: '700' },
  hintBox: { marginTop: 16, backgroundColor: '#f6f7fb', borderRadius: 8, padding: 12 },
  hint: { color: '#333' },
});
