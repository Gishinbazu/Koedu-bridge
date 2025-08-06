import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';
import { db, storage } from '../../services/firebase';

export default function AddEvent() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImageToFirebase = async (imageAsset) => {
    const response = await fetch(imageAsset.uri);
    const blob = await response.blob();
    const filename = `events/${Date.now()}-${imageAsset.fileName || 'event-image'}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!title || !description || !date || !hour || !type) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = '';

      if (image) {
        imageUrl = await uploadImageToFirebase(image);
      }

      await addDoc(collection(db, 'calendarEvents'), {
        title,
        description,
        date,
        hour,
        type,
        color,
        link,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('✅ Succès', 'Événement ajouté !');
      router.push('/admin/events');
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', "Impossible d'ajouter l'événement.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Ajouter un événement</Text>

      <TextInput
        placeholder="Titre"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Heure (HH:MM)"
        style={styles.input}
        value={hour}
        onChangeText={setHour}
      />
      <TextInput
        placeholder="Type (vacances, anniversaire, evenement...)"
        style={styles.input}
        value={type}
        onChangeText={setType}
      />
      <TextInput
        placeholder="Couleur (#hex)"
        style={styles.input}
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        placeholder="Lien externe (optionnel)"
        style={styles.input}
        value={link}
        onChangeText={setLink}
      />

      <Button title="📷 Choisir une image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: '100%', height: 180, marginVertical: 10, borderRadius: 8 }}
        />
      )}

      <Button
        title={uploading ? 'Envoi...' : 'Ajouter'}
        onPress={handleSubmit}
        disabled={uploading}
        color="#2563eb"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
