import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../services/firebase';
import { sendPushNotification, sendStatusEmail } from '../../services/notifications';

export default function AdminApplicationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [privateNote, setPrivateNote] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const docRef = doc(db, 'applications', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setApplication({ id: docSnap.id, ...data });
          setPrivateNote(data.privateNote || '');
          setStatus(data.status || '');
        } else {
          Alert.alert('Erreur', 'Candidature non trouvée');
          router.back();
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger la candidature');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplication();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
      setApplication((prev) => ({ ...prev, status: newStatus }));
      setStatus(newStatus);

      if (application?.pushToken) {
        await sendPushNotification({
          to: application.pushToken,
          title: 'Mise à jour de votre candidature',
          body: `Statut : ${newStatus.toUpperCase()}`,
        });
      }

      if (application?.email) {
        await sendStatusEmail({
          to: application.email,
          name: application.nom,
          status: newStatus,
        });
      }

      Alert.alert('Succès', `Statut mis à jour : ${newStatus}`);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la mise à jour');
    }
  };

  const saveNote = async () => {
    try {
      await updateDoc(doc(db, 'applications', id), { privateNote });
      Alert.alert('Note sauvegardée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la note');
    }
  };

  if (loading || !application) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  const renderField = (label, value) => (
    <>
      <Text style={styles.label}>{label} :</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Détails de la candidature</Text>

      <View style={styles.detailBox}>
        {renderField('Nom complet', application.nom)}
        {renderField('Email', application.email)}
        {renderField('Nationalité', application.nationalite)}
        {renderField('Numéro de passeport', application.passportNumber)}
        {renderField('Adresse', application.address1 + ' ' + application.address2)}
        {renderField('Téléphone', application.phone)}
        {renderField('Date de naissance', application.birthDate)}
        {renderField('Sexe', application.gender)}
        {renderField('Éducation', application.educationLevel)}
        {renderField('Établissement', application.school)}
        {renderField('Année de fin', application.graduationYear)}
        {renderField('But des études', application.studyPurpose)}
        {renderField('Statut actuel', application.status?.toUpperCase())}
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>📝 Note privée (staff uniquement)</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={privateNote}
          onChangeText={setPrivateNote}
          placeholder="Ajouter une note visible uniquement par l\'administration"
        />
        <TouchableOpacity style={[styles.button, styles.note]} onPress={saveNote}>
          <Text style={styles.buttonText}>💾 Enregistrer la note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.accept]} onPress={() => updateStatus('accepted')}>
          <Text style={styles.buttonText}>✅ Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => updateStatus('rejected')}>
          <Text style={styles.buttonText}>❌ Rejeter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#111',
  },
  status: (status) => ({
    color:
      status === 'accepted'
        ? 'green'
        : status === 'rejected'
        ? 'red'
        : 'orange',
    fontWeight: 'bold',
    marginTop: 4,
  }),
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  accept: {
    backgroundColor: '#4CAF50',
  },
  reject: {
    backgroundColor: '#F44336',
  },
  note: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 18,
  },
});