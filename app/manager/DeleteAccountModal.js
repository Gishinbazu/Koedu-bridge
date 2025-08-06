import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db, storage } from '../../services/firebase';

export default function DeleteAccountModal({ visible, onClose, userDocId, photoURL }) {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;

      // 1. Vérification du mot de passe
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Supprimer photo de profil dans Storage si elle existe
      if (photoURL) {
        const imageRef = ref(storage, photoURL);
        await deleteObject(imageRef).catch(() => {}); // ignore si déjà supprimée
      }

      // 3. Supprimer doc Firestore
      await deleteDoc(doc(db, 'users', userDocId));

      // 4. Supprimer compte auth
      await deleteUser(user);

      Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
    } catch (error) {
      console.error('Erreur suppression compte :', error);
      Alert.alert('Erreur', 'Mot de passe incorrect ou erreur de suppression.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>❌ Supprimer mon compte</Text>
          <Text style={styles.warning}>
            Cette action est <Text style={{ fontWeight: 'bold' }}>irréversible</Text>. Saisis ton mot
            de passe pour confirmer.
          </Text>

          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConfirmed(!confirmed)}
          >
            <View style={[styles.box, confirmed && styles.checked]} />
            <Text style={styles.checkboxText}>Je comprends que cette action est irréversible</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              (!password || !confirmed || loading) && { backgroundColor: '#ccc' },
            ]}
            onPress={handleDelete}
            disabled={!password || !confirmed || loading}
          >
            <Text style={styles.deleteText}>Supprimer définitivement</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d11a2a',
  },
  warning: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#1e90ff',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#d11a2a',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancel: {
    marginTop: 12,
    textAlign: 'center',
    color: '#1e90ff',
    fontSize: 15,
  },
});
