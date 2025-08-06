import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import FloatingSidebar from '../../components/FloatingSidebar';
import { db } from '../../services/firebase';

export default function EditCandidate() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('pending');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      const ref = doc(db, 'koreanLangForm', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setData({ id: snap.id, ...d });
        setStatus(d.status || 'pending');
        setNote(d.note || '');
      }
      setLoading(false);
    };

    if (id) fetchCandidate();
  }, [id]);

  const handleUpdate = () => {
    Alert.alert('Confirmer la mise à jour', 'Souhaitez-vous enregistrer les modifications ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          try {
            const ref = doc(db, 'koreanLangForm', id);
            await updateDoc(ref, { status, note });
            Alert.alert('✅ Modifications enregistrées');
            router.back();
          } catch (error) {
            Alert.alert('❌ Erreur', error.message);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loading}>
        <Text>Données introuvables</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FloatingSidebar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>✏️ Modifier le candidat</Text>

        <View style={styles.box}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{data.name || '-'}</Text>

          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{data.email || '-'}</Text>

          <Text style={styles.label}>Statut :</Text>
          <View style={styles.statusBtns}>
            <TouchableOpacity
              onPress={() => setStatus('accepted')}
              style={[styles.statusBtn, status === 'accepted' && styles.activeAccepted]}
            >
              <Text style={styles.btnText}>✅ Accepté</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatus('pending')}
              style={[styles.statusBtn, status === 'pending' && styles.activePending]}
            >
              <Text style={styles.btnText}>🕒 En attente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatus('rejected')}
              style={[styles.statusBtn, status === 'rejected' && styles.activeRejected]}
            >
              <Text style={styles.btnText}>❌ Rejeté</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Note interne :</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            style={styles.textInput}
            placeholder="Ajouter une observation ou justification..."
            multiline
          />

          <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn}>
            <Text style={styles.saveText}>💾 Enregistrer les modifications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20, paddingLeft: 240 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1f2937' },
  box: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  label: { fontWeight: 'bold', marginTop: 16, color: '#374151' },
  value: { fontSize: 16, color: '#111827', marginTop: 4 },
  textInput: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusBtns: { flexDirection: 'row', gap: 10, marginTop: 10 },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  btnText: { fontSize: 14 },
  activeAccepted: { backgroundColor: '#d1fae5', borderColor: '#10b981' },
  activePending: { backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
  activeRejected: { backgroundColor: '#fee2e2', borderColor: '#ef4444' },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 240,
    backgroundColor: '#f3f4f6',
  },
});
