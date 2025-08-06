import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import Footer from '../../components/Footer';
import { auth, db, storage } from '../../services/firebase';

export default function EditProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    county: '',
    zipCode: '',
    country: '',
    phone: '',
    birthDate: '',
    photoURL: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState('');
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setForm((prev) => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      }));
    }
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setForm((prev) => ({ ...prev, image: result.uri }));
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL: downloadURL });
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setForm((prev) => ({ ...prev, photoURL: downloadURL }));
    }
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, form);
      ToastAndroid.show('Profil mis à jour !', ToastAndroid.SHORT);
      router.replace('/user/ProfileScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordToDelete);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      ToastAndroid.show('Compte supprimé', ToastAndroid.SHORT);
      router.replace('/goodbye');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Mot de passe incorrect ou autre erreur.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Modifier mon profil</Text>

      {form.photoURL ? (
        <Image source={{ uri: form.photoURL }} style={styles.avatar} />
      ) : null}

      <TouchableOpacity onPress={pickImage} style={styles.changePhotoButton}>
        <Text>Changer la photo</Text>
      </TouchableOpacity>

      {['displayName', 'lastName', 'address1', 'address2', 'city', 'county', 'zipCode', 'country', 'phone', 'birthDate'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          value={form[field]}
          onChangeText={(text) => setForm((prev) => ({ ...prev, [field]: text }))}
        />
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
        <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
      </TouchableOpacity>

      <Modal visible={showDeleteModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Mot de passe (pour suppression)</Text>
            <TextInput
              secureTextEntry
              style={styles.input}
              placeholder="Mot de passe"
              value={passwordToDelete}
              onChangeText={setPasswordToDelete}
            />
            <TouchableOpacity
              onPress={() => {
                if (confirmDeleteChecked) handleDeleteAccount();
              }}
              style={[styles.confirmDeleteBtn, !confirmDeleteChecked && { opacity: 0.5 }]}
              disabled={!confirmDeleteChecked}
            >
              <Text style={styles.confirmDeleteText}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
              <Text style={{ color: 'gray' }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 12 },
  saveButton: { backgroundColor: '#10b981', padding: 15, borderRadius: 5, marginBottom: 10 },
  saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 5 },
  deleteButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  changePhotoButton: { alignSelf: 'center', marginBottom: 10, backgroundColor: '#e5e7eb', padding: 8, borderRadius: 5 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  confirmDeleteBtn: { backgroundColor: '#dc2626', padding: 10, borderRadius: 5, marginTop: 10 },
  confirmDeleteText: { color: 'white', textAlign: 'center' },
});
