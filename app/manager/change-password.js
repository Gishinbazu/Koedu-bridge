import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { auth } from '../../services/firebase';

export default function ChangePassword() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Succès', 'Mot de passe mis à jour avec succès.');
      router.back();
    } catch (error) {
      console.error('Erreur changement de mot de passe:', error);
      Alert.alert('Erreur', 'Échec de la mise à jour. Vérifie ton mot de passe actuel.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔐 Changer le mot de passe</Text>

      <Text style={styles.label}>Mot de passe actuel</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>← Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancel: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
