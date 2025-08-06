import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { auth, db } from '../../services/firebase';


export default function StatusScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        setUserData(userSnap.exists() ? userSnap.data() : null);

        const appRef = doc(db, 'applications', user.uid);
        const appSnap = await getDoc(appRef);
        setApplicationData(appSnap.exists() ? appSnap.data() : null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case 'accepted':
        return '✅ Votre candidature a été acceptée.';
      case 'rejected':
        return '❌ Votre candidature a été rejetée.';
      case 'pending':
      default:
        return '🕒 Votre candidature est en cours de traitement.';
    }
  };

  const getProgressIndex = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'accepted': return 2;
      case 'rejected': return 2;
      default: return 0;
    }
  };

  const renderProgress = (status) => {
    const index = getProgressIndex(status);
    const steps = ['Formulaire envoyé', 'En cours', 'Décision finale'];

    return (
      <View style={styles.progressWrapper}>
        {steps.map((step, i) => (
          <View key={i} style={styles.progressItem}>
            <View
              style={[
                styles.progressCircle,
                i <= index ? styles.circleDone : styles.circlePending,
              ]}
            />
            <Text style={styles.progressLabel}>{step}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleDownloadPDF = async () => {
    const html = `
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Korea_university_emblem.png" alt="KOEDU Logo" style="width: 120px; height: auto;" />
            <h1 style="margin-top: 10px; color: #003366;">KOEDU Bridge</h1>
          </div>

          <h2>📊 Statut de votre candidature</h2>
          <p><strong>Status :</strong> ${renderStatus(userData.status)}</p>

          <h3 style="margin-top: 30px;">📋 Détails soumis :</h3>
          <ul>
            ${Object.entries(applicationData)
              .filter(([key]) => !['uid', 'submittedAt', 'updatedAt', 'status'].includes(key))
              .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
              .join('')}
          </ul>

          <p style="margin-top: 40px; font-size: 12px;">Généré depuis KOEDU Bridge – ${new Date().toLocaleDateString()}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        fileName: `koedu_candidature_${(userData?.displayName || 'utilisateur').replace(/\s+/g, '_')}`
      });

      if (Platform.OS === 'web') {
        window.open(uri);
      } else {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Erreur PDF:', error);
      Alert.alert('Erreur', "Impossible de générer le PDF.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!userData || !applicationData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>❗ Aucune donnée de candidature trouvée.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Header local avec bouton retour */}
      <View style={styles.localHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/user/dashboard')}>
            <Feather name="chevron-left" size={22} color="#003366" />
            <Text style={styles.backLabel}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Suivi de votre candidature</Text>
        </View>


      <Text style={styles.statusText}>{renderStatus(userData.status)}</Text>

      {renderProgress(userData.status)}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Détails soumis :</Text>
        {Object.entries(applicationData).map(([key, value]) => {
          if (['uid', 'submittedAt', 'updatedAt', 'status'].includes(key)) return null;
          return (
            <Text key={key} style={styles.detailLine}>
              <Text style={{ fontWeight: '600' }}>{key} :</Text> {value}
            </Text>
          );
        })}

        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownloadPDF}
        >
          <Text style={styles.downloadBtnText}>📤 Télécharger en PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  localHeader: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#003366',
    marginRight: 6,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginBottom: 6,
  },
  circleDone: {
    backgroundColor: '#10b981',
  },
  circlePending: {
    backgroundColor: '#d1d5db',
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailLine: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
  },
  downloadBtn: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
