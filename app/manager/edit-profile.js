import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db, storage } from '../../services/firebase';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [university, setUniversity] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [photo, setPhoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }

      setUserId(user.uid);

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || '');
          setPhoto(data.photoURL || '');
          setEmail(data.email || '');
          setRole(data.role || '');
          setPhone(data.phone || '');
          setNationality(data.nationality || '');
          setUniversity(data.university || '');
          setCreatedAt(data.createdAt?.toDate?.().toLocaleDateString() || '');
        }
      } catch (err) {
        console.error('Erreur chargement profil :', err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploading(true);
      const uri = result.assets[0].uri;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePictures/${userId}/${filename}`);

      try {
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setPhoto(downloadURL);
        Alert.alert('✅ Photo mise à jour');
      } catch (error) {
        console.error('Erreur upload image:', error);
        Alert.alert('Erreur', "Échec de l'envoi de l'image.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('⚠️ Le nom ne peut pas être vide');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        name,
        photoURL: photo,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Erreur mise à jour :', error);
      Alert.alert('Erreur', "Impossible de mettre à jour le profil.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le profil</Text>

      {uploading && <Text style={styles.uploading}>📤 Téléversement en cours...</Text>}

      <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
        {photo ? (
          <Image source={{ uri: `${photo}?time=${Date.now()}` }} style={styles.image} />
        ) : (
          <Image source={require('../../assets/images/placeholder.png')} style={styles.image} />
        )}
        <Text style={styles.changePhoto}>📷 Changer la photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom complet" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} editable={false} />

      <Text style={styles.label}>Rôle</Text>
      <TextInput style={styles.input} value={role} editable={false} />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} value={phone} editable={false} />

      <Text style={styles.label}>Nationalité</Text>
      <TextInput style={styles.input} value={nationality} editable={false} />

      <Text style={styles.label}>Université</Text>
      <TextInput style={styles.input} value={university} editable={false} />

      <Text style={styles.label}>Date d’inscription</Text>
      <TextInput style={styles.input} value={createdAt} editable={false} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Enregistrer</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>✅ Profil mis à jour avec succès</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745', marginTop: 15 }]}
              onPress={() => {
                setShowModal(false);
                router.replace('/manager/profile'); // ✅ Redirection vers la page profil
              }}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  changePhoto: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  uploading: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
