import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Footer from '../../components/Footer';
import { auth, db, storage } from '../../services/firebase';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setLastName(data.lastName || '');
          setAddress1(data.address1 || '');
          setAddress2(data.address2 || '');
          setCity(data.city || '');
          setCounty(data.county || '');
          setPostalCode(data.postalCode || '');
          setCountry(data.country || '');
          setPhone(data.phone || '');
          setBirthDate(data.birthDate || '');
          setPhotoURL(data.photoURL || '');
        }
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      const response = await fetch(selected.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);

      await updateProfile(user, { photoURL: downloadURL });
      await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });

      Platform.OS === 'android'
        ? ToastAndroid.show('Photo mise à jour', ToastAndroid.SHORT)
        : Alert.alert('Succès', 'Photo de profil mise à jour');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setBirthDate(formatted);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return Alert.alert('Erreur', 'Veuillez entrer votre prénom');
    try {
      setLoading(true);
      await updateProfile(user, { displayName: name, photoURL });
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name,
        lastName,
        address1,
        address2,
        city,
        county,
        postalCode,
        country,
        phone,
        birthDate,
        photoURL,
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/user/profile');
      }, 2000);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) return Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      Platform.OS === 'android'
        ? ToastAndroid.show('Compte supprimé avec succès', ToastAndroid.SHORT)
        : Alert.alert('Compte supprimé');
      router.replace('/goodbye');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Suppression échouée : ' + error.message);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#f3f4f6' }} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Modifier mon profil</Text>
      <View style={styles.formWrapper}>
        <View style={styles.photoSection}>
          <Image
            source={{ uri: photoURL || 'https://via.placeholder.com/120' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changeBtn} onPress={pickImage}>
            <Text style={styles.changeBtnText}>Changer la photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputsSection}>
          <TextInput style={styles.input} placeholder="Prénom" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Nom de famille" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Adresse ligne 1" value={address1} onChangeText={setAddress1} />
          <TextInput style={styles.input} placeholder="Adresse ligne 2" value={address2} onChangeText={setAddress2} />
          <TextInput style={styles.input} placeholder="Ville" value={city} onChangeText={setCity} />
          <TextInput style={styles.input} placeholder="Région / Département" value={county} onChangeText={setCounty} />
          <TextInput style={styles.input} placeholder="Code postal" value={postalCode} onChangeText={setPostalCode} />
          <TextInput style={styles.input} placeholder="Pays" value={country} onChangeText={setCountry} />
          <TextInput style={styles.input} placeholder="Téléphone" value={phone} onChangeText={setPhone} />

          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (YYYY-MM-DD)"
              value={birthDate}
              onChangeText={setBirthDate}
            />
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.input, { justifyContent: 'center', height: 48 }]}
              >
                <Text style={{ color: birthDate ? '#000' : '#9ca3af' }}>
                  {birthDate || 'Date de naissance (YYYY-MM-DD)'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate ? new Date(birthDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.saveBtnText}>{loading ? 'Mise à jour...' : 'Enregistrer'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteModal(true)}>
            <Text style={styles.saveBtnText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={showSuccessModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>✅ Succès</Text>
          <Text>Votre profil a été mis à jour !</Text>
        </View>
      </Modal>

      <Modal isVisible={showDeleteModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>⚠️ Confirmation</Text>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            Pour supprimer votre compte, veuillez entrer votre mot de passe.
          </Text>
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setConfirmDeleteChecked(!confirmDeleteChecked)}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#999',
                marginRight: 10,
                backgroundColor: confirmDeleteChecked ? '#10b981' : 'transparent',
              }}
            />
            <Text style={{ flex: 1 }}>Je comprends que cette action est irréversible.</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#e5e7eb' }]}
              onPress={() => {
                setPassword('');
                setConfirmDeleteChecked(false);
                setShowDeleteModal(false);
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: confirmDeleteChecked ? '#ef4444' : '#fca5a5' },
              ]}
              onPress={handleDeleteAccount}
              disabled={!confirmDeleteChecked}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, flexGrow: 1, backgroundColor: '#f3f4f6' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formWrapper: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3, gap: 20, flexWrap: 'wrap',
  },
  photoSection: { flex: 1, alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  changeBtn: { backgroundColor: '#e5e7eb', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  changeBtnText: { fontSize: 14, color: '#1f2937' },
  inputsSection: { flex: 2, gap: 16 },
  input: {
    backgroundColor: '#fff', borderColor: '#d1d5db', borderWidth: 1,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16,
  },
  saveBtn: { backgroundColor: '#10b981', padding: 12, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
});
