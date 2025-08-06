import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../services/firebase';

export default function SuperadminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          const role = snap.data()?.role;
          if (role !== 'superadmin') {
            Alert.alert('Accès refusé', 'Vous n’êtes pas Superadmin');
            router.replace('/login');
          } else {
            setUserEmail(user.email);
            setLoading(false);
          }
        } catch (err) {
          console.error('Erreur rôle:', err);
          Alert.alert('Erreur', 'Impossible de vérifier le rôle');
          router.replace('/login');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f3c76b" />
        <Text style={{ marginTop: 10 }}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Superadmin Dashboard</Text>
      <Text style={styles.email}>Connecté en tant que : {userEmail}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin')}>
        <Text style={styles.buttonText}>📋 Gérer les candidatures</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
        <Text style={[styles.buttonText, { color: '#fff' }]}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#f3c76b',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#003366',
    fontSize: 16,
  },
  logout: {
    backgroundColor: '#d9534f',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
