import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    TextInput,
    TouchableOpacity
} from 'react-native';
import { db, storage } from '../../../services/firebase';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'calendarEvents', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Erreur lors du chargement :', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', 'Autorisez l’accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `eventImages/${Date.now()}-${uri.split('/').pop()}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleUpdate = async () => {
    if (!event.title || !event.date) {
      Alert.alert('Champs requis', 'Le titre et la date sont obligatoires.');
      return;
    }

    setUpdating(true);
    try {
      let imageUrl = event.imageUrl;
      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      const docRef = doc(db, 'calendarEvents', id);
      await updateDoc(docRef, {
        title: event.title,
        description: event.description,
        date: event.date,
        hour: event.hour,
        type: event.type,
        color: event.color,
        link: event.link,
        imageUrl,
      });

      Alert.alert('✅ Succès', 'Événement mis à jour.');
      router.push('/admin/events');
    } catch (error) {
      console.error('Erreur :', error);
      Alert.alert('❌ Échec', 'Mise à jour échouée.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !event) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#2563eb" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>✏️ Modifier l’événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={event.title}
        onChangeText={(text) => setEvent({ ...event, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={event.description}
        onChangeText={(text) => setEvent({ ...event, description: text })}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={event.date}
        onChangeText={(text) => setEvent({ ...event, date: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Heure (HH:mm)"
        value={event.hour}
        onChangeText={(text) => setEvent({ ...event, hour: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={event.type}
        onChangeText={(text) => setEvent({ ...event, type: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Couleur"
        value={event.color}
        onChangeText={(text) => setEvent({ ...event, color: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Lien externe"
        value={event.link}
        onChangeText={(text) => setEvent({ ...event, link: text })}
      />

      {/* Image actuelle */}
      {event.imageUrl && !newImage && (
        <Image source={{ uri: event.imageUrl }} style={styles.preview} />
      )}

      {/* Nouvelle image choisie */}
      {newImage && (
        <Image source={{ uri: newImage }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageText}>📷 Choisir une nouvelle image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate} disabled={updating}>
        <Text style={styles.submitText}>{updating ? 'Envoi...' : '✅ Mettre à jour'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f1f5f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  imageText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
