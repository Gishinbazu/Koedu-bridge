// /app/manager/edit/[id].js
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { db } from '../../../services/firebase';

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          Alert.alert('Erreur', "Utilisateur introuvable.");
          router.back();
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Erreur', 'Chargement impossible.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', id), userData);
      Alert.alert('Succès', 'Informations mises à jour.');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Mise à jour échouée.');
    }
  };

  if (loading || !userData) return <Text style={styles.loading}>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier l'utilisateur</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={userData.name || ''}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={userData.email || ''}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={userData.phone || ''}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 16,
  },
});
