import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebase';

export default function SuperadminSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateSuperadmin = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        role: 'superadmin',
        email,
        createdAt: new Date(),
      });

      Alert.alert('✅ Superadmin créé !', `L'adresse ${email} est maintenant superadmin.`);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Configuration Superadmin</Text>
      <Text style={styles.warning}>
        Ce formulaire est à usage unique pour créer le premier compte superadmin. Supprimez ce fichier après l’avoir utilisé.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe sécurisé"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSuperadmin}>
        <Text style={styles.buttonText}>Créer Superadmin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 12,
  },
  warning: {
    backgroundColor: '#ffe4e1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    color: '#aa0000',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
