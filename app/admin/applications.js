// app/admin/applications.js
import { useRouter } from 'expo-router';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../services/firebase';
import { checkAdminAccess } from '../../utils/AuthGuard';

export default function AdminApplicationsScreen() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      // 1) Pas de session -> login
      if (!user) {
        router.replace('/auth/login'); // ajuste le chemin si ton login est ailleurs
        return;
      }

      setLoading(true);

      // 2) Vérifier rôle admin (au choix: custom claim OU collection users)
      try {
        // a) custom claims (recommandé)
        const token = await getIdTokenResult(user, true);
        const isAdminClaim = token.claims?.admin === true;

        // b) fallback via ta fonction (doc users/{uid} avec role:'admin')
        const isAdminDoc = await checkAdminAccess(user.uid);

        if (!isAdminClaim && !isAdminDoc) {
          Alert.alert('Accès refusé', 'Seuls les administrateurs peuvent voir les candidatures.');
          router.replace('/'); // page publique
          return;
        }

        setAuthorized(true);

        // 3) Lecture Firestore (realtime + tri récent d'abord)
        if (unsubRef.current) unsubRef.current(); // nettoyer un éventuel précédent
        unsubRef.current = onSnapshot(
          query(collection(db, 'applications'), orderBy('createdAt', 'desc')),
          (snap) => {
            const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setApplications(rows);
            setLoading(false);
          },
          (err) => {
            console.error('[applications] read error:', err);
            Alert.alert('Erreur', "Impossible de charger les candidatures.");
            setLoading(false);
          }
        );
      } catch (e) {
        console.error('[admin auth check] error:', e);
        Alert.alert('Erreur', "Vérification d'accès impossible.");
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubRef.current) unsubRef.current();
    };
  }, [router]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/admin/${item.id}`)} // nécessite app/admin/[id].js
    >
      <Text style={styles.name}>{item.fullName ?? '—'}</Text>
      <Text style={styles.detail}>📧 {item.email ?? '—'}</Text>
      <Text style={styles.detail}>🎓 {item.education ?? '—'}</Text>
      <Text style={styles.status}>Statut : {item.status || 'en attente'}</Text>
    </TouchableOpacity>
  );

  if (!authorized || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Chargement des candidatures…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Candidatures reçues</Text>
      {applications.length === 0 ? (
        <Text style={styles.empty}>Aucune candidature pour le moment.</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#003366' },
  empty: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 20 },
  list: { paddingBottom: 40 },
  card: { backgroundColor: '#f2f2f2', padding: 16, borderRadius: 10, marginBottom: 14 },
  name: { fontSize: 18, fontWeight: 'bold' },
  detail: { fontSize: 15, color: '#444', marginTop: 4 },
  status: { marginTop: 10, fontWeight: '600', color: '#003366' },
});
