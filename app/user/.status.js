import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function StatusScreen() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setStatus('non connecté');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'applications', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStatus(docSnap.data().status || 'pending');
        } else {
          setStatus('aucune soumission');
        }
      } catch (e) {
        console.error(e);
        setStatus('erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const renderStatusText = () => {
    switch (status) {
      case 'accepted':
        return '✅ Votre candidature a été acceptée.';
      case 'rejected':
        return '❌ Votre candidature a été rejetée.';
      case 'pending':
        return '🕒 Votre candidature est en cours de traitement.';
      case 'aucune soumission':
        return '📄 Vous n\'avez pas encore soumis de formulaire.';
      case 'non connecté':
        return '🔐 Veuillez vous connecter.';
      case 'erreur':
        return '⚠️ Une erreur est survenue.';
      default:
        return '⏳ Chargement...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'accepted':
        return '#10b981'; // green
      case 'rejected':
        return '#ef4444'; // red
      case 'pending':
        return '#f59e0b'; // yellow
      case 'aucune soumission':
      case 'non connecté':
        return '#6b7280'; // gray
      case 'erreur':
        return '#dc2626'; // dark red
      default:
        return '#4b5563'; // default
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} color="#003366" size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Statut de votre candidature</Text>
      <Text style={[styles.status, { color: getStatusColor() }]}>
        {renderStatusText()}
      </Text>

      {status === 'aucune soumission' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/user/koreanLangForm')}
        >
          <Text style={styles.buttonText}>📝 Remplir le formulaire</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 220,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
