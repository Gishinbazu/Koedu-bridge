import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../../services/firebase';

export default function ManagerApplicationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const docRef = doc(db, 'admissions', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setForm({ ...snap.data() });
      setNote(snap.data().note || '');
    } else {
      Alert.alert('Erreur', 'Formulaire introuvable');
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'admissions', id), {
        ...form,
        note,
      });
      Alert.alert('✅ Sauvegardé', 'Les informations ont été mises à jour');
    } catch (err) {
      Alert.alert('❌ Erreur', err.message);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment marquer ce dossier comme ${newStatus.toUpperCase()} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'admissions', id), {
                status: newStatus,
              });
              Alert.alert('✅ Statut mis à jour');
              fetchData();
            } catch (err) {
              Alert.alert('❌ Erreur', err.message);
            }
          },
        },
      ]
    );
  };

  if (loading || !form) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Dossier de {form.nom || 'Candidat(e)'}</Text>

      {/* Champs modifiables */}
      <TextInput style={styles.input} value={form.nom} onChangeText={(text) => handleChange('nom', text)} placeholder="Nom" />
      <TextInput style={styles.input} value={form.email} onChangeText={(text) => handleChange('email', text)} placeholder="Email" />
      <TextInput style={styles.input} value={form.nationalite} onChangeText={(text) => handleChange('nationalite', text)} placeholder="Nationalité" />
      <TextInput style={styles.input} value={form.numero} onChangeText={(text) => handleChange('numero', text)} placeholder="Téléphone" />

      {/* Note privée */}
      <Text style={styles.label}>🗒 Note interne</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={note}
        multiline
        onChangeText={setNote}
        placeholder="Note visible uniquement par le manager/admin"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>💾 Enregistrer les modifications</Text>
      </TouchableOpacity>

      {/* Statut */}
      <Text style={styles.status}>Statut actuel : {form.status || '🟡 en attente'}</Text>
      <View style={styles.statusButtons}>
        <TouchableOpacity
          style={[styles.statusBtn, { backgroundColor: 'green' }]}
          onPress={() => handleStatusUpdate('accepted')}
          disabled={form.status === 'accepted'}
        >
          <Text style={styles.btnText}>✅ Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusBtn, { backgroundColor: 'crimson' }]}
          onPress={() => handleStatusUpdate('rejected')}
          disabled={form.status === 'rejected'}
        >
          <Text style={styles.btnText}>❌ Rejeter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statusBtn: {
    padding: 14,
    borderRadius: 10,
    width: '40%',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
