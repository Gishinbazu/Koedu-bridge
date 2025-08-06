import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { db } from '../../services/firebase';
import { checkAuth } from '../../utils/AuthGuard';

export default function PromoteToSuperadmin() {
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté.');
        return;
      }
      setAuthorized(user);
    };
    verify();
  }, []);

  const handlePromote = async () => {
    if (!authorized) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', authorized.uid), {
        email: authorized.email,
        role: 'superadmin',
        createdAt: new Date(),
      });

      Alert.alert('Succès', 'Vous êtes maintenant SUPERADMIN 👑');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎖️ Promouvoir en SuperAdmin</Text>
      <Text style={styles.subtitle}>Connecté en tant que : {authorized.email}</Text>

      <Button
        title={loading ? 'Mise à jour…' : 'Devenir Superadmin'}
        onPress={handlePromote}
        disabled={loading}
        color="#003366"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10, color: '#003366' },
  subtitle: { marginBottom: 30, fontSize: 14, color: '#555' },
});
