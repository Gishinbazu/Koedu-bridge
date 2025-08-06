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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../../components/Footer';
import { auth, db, storage } from '../../services/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData({ uid: user.uid, email: user.email, ...docSnap.data() });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'Autorisez l’accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `profilePhotos/${userData.uid}.jpg`);

      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      await updateDoc(doc(db, 'users', userData.uid), { photoURL: downloadURL });
      setUserData((prev) => ({ ...prev, photoURL: downloadURL }));
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!userData) return null;

  const {
    displayName,
    lastName,
    email,
    status,
    photoURL,
    phone,
    birthDate,
    address1,
    address2,
    city,
    county,
    postalCode,
    country,
  } = userData;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bonjour Étudiant 👋</Text>
          <Text style={styles.headerSubtitle}>
            Voici votre tableau de bord KOEDU Bridge. Suivez votre dossier et vos prochaines étapes.
          </Text>

          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/user/EditProfile')}>
            <Text style={styles.editBtnText}>✏️ Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image
            source={
              photoURL
                ? { uri: photoURL }
                : require('../../assets/images/default-profile.png')
            }
            style={styles.avatar}
          />

          <TouchableOpacity onPress={pickImage} style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>📷 Changer la photo</Text>
          </TouchableOpacity>

          <Text style={styles.name}>{displayName} {lastName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={[styles.badge, getStatusStyle(status)]}>
            <Text style={styles.badgeText}>
              {status === 'accepted' ? '✅ Accepté' : status === 'rejected' ? '❌ Rejeté' : '🕒 En attente'}
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📌 Informations complémentaires</Text>
          <Text style={styles.infoText}>📛 Nom complet : {displayName || ''} {lastName || ''}</Text>
          <Text style={styles.infoText}>📧 Email : {email}</Text>
          <Text style={styles.infoText}>📱 Téléphone : {phone || 'Non renseigné'}</Text>
          <Text style={styles.infoText}>🎂 Date de naissance : {birthDate || 'Non renseignée'}</Text>
          <Text style={styles.infoText}>🏠 Adresse :</Text>
          <Text style={styles.infoText}>
            {address1 || ''} {address2 || ''}
            {'\n'}{postalCode || ''} {city || ''}, {county || ''}
            {'\n'}{country || ''}
          </Text>
        </View>

        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ScrollView>
    </View>
  );
}

const getStatusStyle = (status) => {
  if (status === 'accepted') return { backgroundColor: '#10b981' };
  if (status === 'rejected') return { backgroundColor: '#ef4444' };
  return { backgroundColor: '#f59e0b' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  editBtn: {
    marginTop: 15,
    backgroundColor: '#06b6d4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#4f46e5',
  },
  changePhotoBtn: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  email: {
    color: '#6b7280',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoBox: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
  },
  footerWrapper: {
    marginTop: 40,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
