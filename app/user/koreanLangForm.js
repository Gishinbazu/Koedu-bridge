import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Footer from '../../components/Footer';
import { db } from '../../services/firebase';
import { useAuthGuard } from '../../utils/AuthGuard';

export default function KoreanLangForm() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuthGuard();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    nationality: '',
    passportNumber: '',
    phone: '',
    email: '',
    education: '',
    visaType: '',
    purpose: '',
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [checkingSubmission, setCheckingSubmission] = useState(true);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const fieldLabels = {
    fullName: 'Nom complet',
    nationality: 'Nationalité',
    passportNumber: 'Numéro de passeport',
    phone: 'Téléphone',
    email: 'Email',
    education: 'Dernier diplôme',
    visaType: 'Type de visa',
    purpose: "Motif d'apprentissage",
  };

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().hasSubmitted) {
        setHasSubmitted(true);
      }
      setCheckingSubmission(false);
    };
    fetchSubmissionStatus();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    for (let key in form) {
      if (!form[key]) {
        Alert.alert('Champs requis', `Veuillez remplir le champ : ${fieldLabels[key]}`);
        return;
      }
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'applications', user.uid), {
        ...form,
        uid: user.uid,
        submittedAt: new Date(),
        status: 'pending',
      });

      await updateDoc(doc(db, 'users', user.uid), {
        hasSubmitted: true,
      });

      Alert.alert('✅ Soumission réussie', 'Votre formulaire a été transmis.');
      router.replace('/status');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checkingSubmission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!user || role !== 'user') {
    return (
      <View style={styles.loadingContainer}>
        <Text>⛔ Accès réservé aux utilisateurs authentifiés.</Text>
      </View>
    );
  }

  if (hasSubmitted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.submittedText}>
          ✅ Vous avez déjà soumis votre formulaire. Vous pouvez le modifier ci-dessous :
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/user/editApplication')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>✏️ Modifier ma candidature</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* ✅ Header local avec retour */}
      <View style={styles.localHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/user/dashboard')}>
          <Feather name="chevron-left" size={22} color="#003366" />
          <Text style={styles.backLabel}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Formulaire d'inscription</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(form).map((key) => (
          <TextInput
            key={key}
            placeholder={fieldLabels[key]}
            style={[styles.input, key === 'purpose' && styles.multiline]}
            value={form[key]}
            onChangeText={(text) => handleChange(key, text)}
            multiline={key === 'purpose'}
            numberOfLines={key === 'purpose' ? 4 : 1}
          />
        ))}

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#999' }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Envoi en cours...' : '📨 Soumettre'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  localHeader: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backLabel: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003366',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submittedText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#facc15',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
