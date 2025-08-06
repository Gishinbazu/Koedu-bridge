import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function ConsentScreen() {
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, []);

  const handleAccept = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { consent: true }, { merge: true });

      Alert.alert('Merci', 'Consentement enregistré avec succès.');
      router.replace('/user/koreanLangForm');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible d’enregistrer le consentement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Consentement & Conditions d’utilisation</Text>

        <Text style={styles.text}>
          En accédant à KOEDU Bridge, vous acceptez de fournir des informations exactes pour l’admission.
          Vos données seront utilisées uniquement pour le traitement de votre demande.
          Vous consentez également à ce que vos fichiers soient analysés pour vérification administrative.
          Veuillez lire attentivement toutes les clauses avant de continuer.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isAccepted ? '#003366' : '#ccc' }]}
          onPress={handleAccept}
          disabled={!isAccepted || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Enregistrement...' : 'J’accepte et je continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsAccepted(!isAccepted)}>
          <Text style={styles.checkbox}>
            {isAccepted ? '☑' : '☐'} J’ai lu et j’accepte les conditions ci-dessus
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#003366',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  checkbox: {
    fontSize: 16,
    textAlign: 'center',
    color: '#003366',
    textDecorationLine: 'underline',
  },
});
