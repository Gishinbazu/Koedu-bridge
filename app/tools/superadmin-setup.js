import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import OnlySuperAdmin from '../../components/OnlySuperAdmin';
import { auth, db } from '../../services/firebase';

export default function SuperadminSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateSuperAdmin = async () => {
    if (!email || !password) {
      Alert.alert('❗Erreur', 'Email et mot de passe requis');
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        role: 'superadmin',
        createdAt: new Date(),
      });

      Alert.alert('✅ Succès', 'Compte Superadmin créé !');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('❌ Erreur de création:', err);
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert('Erreur', 'Cet email est déjà utilisé.');
      } else if (err.code === 'auth/invalid-email') {
        Alert.alert('Erreur', 'Email invalide.');
      } else if (err.code === 'auth/weak-password') {
        Alert.alert('Erreur', 'Mot de passe trop faible (minimum 6 caractères).');
      } else {
        Alert.alert('Erreur', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnlySuperAdmin>
      <View style={styles.container}>
        <Text style={styles.title}>🛡️ Créer un compte Superadmin</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Mot de passe sécurisé"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleCreateSuperAdmin}
          style={[styles.button, loading && { backgroundColor: '#aaa' }]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Création...' : 'CRÉER LE COMPTE SUPERADMIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </OnlySuperAdmin>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#003366',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
