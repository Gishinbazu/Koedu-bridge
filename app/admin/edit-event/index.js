import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db, storage } from '../../../services/firebase';

export default function AddEventScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', 'Autorise l’accès aux images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
  if (!uri) return null;
  try {
    console.log('⏳ Upload début');
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `eventImages/${Date.now()}-${filename}`);
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('✅ Upload terminé');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('📷 URL image :', downloadURL);
    return downloadURL;
  } catch (err) {
    console.error('❌ Erreur upload image :', err);
    throw err;
  }
};


  const handleSubmit = async () => {
    if (!title || !date) {
      Alert.alert('Champs requis', 'Le titre et la date sont obligatoires.');
      return;
    }

    if (!image) {
      Alert.alert('Image manquante', 'Veuillez sélectionner une image.');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageToFirebase(image);

      await addDoc(collection(db, 'calendarEvents'), {
        title,
        description,
        date: date.toISOString(),
        hour,
        type,
        color,
        link,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('✅ Succès', 'L’événement a bien été ajouté.');
      router.push('/admin/events');
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error);
      Alert.alert('❌ Erreur', error.message || 'Échec lors de l’ajout de l’événement.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>➕ Ajouter un événement</Text>

      <TextInput placeholder="Titre" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />

      <View style={styles.input}>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />
      </View>

      <TextInput placeholder="Heure (ex: 14:00)" value={hour} onChangeText={setHour} style={styles.input} />
      <TextInput placeholder="Type (vacances, fête…)" value={type} onChangeText={setType} style={styles.input} />
      <TextInput placeholder="Couleur (#10b981)" value={color} onChangeText={setColor} style={styles.input} />
      <TextInput placeholder="Lien externe (optionnel)" value={link} onChangeText={setLink} style={styles.input} />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text>📷 Choisir une image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TouchableOpacity
        style={[styles.submitButton, uploading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Valider</Text>}
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
    marginBottom: 16,
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  imagePicker: {
    padding: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
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
