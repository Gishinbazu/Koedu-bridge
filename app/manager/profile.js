import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function ManagerProfile() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      setData(snap.data());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#1e90ff" />;

  const infoBox = (label, value) => (
    <View style={styles.infoBox}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'Non renseigné'}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
       {/* 🔙 Bouton Retour */}
    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="#1e90ff" />
      <Text style={styles.backText}>Retour</Text>
    </TouchableOpacity>
      <Text style={styles.title}>👤 Mon Profil Manager</Text>

      {/* ✅ Avatar dynamique */}
      {data.photoURL ? (
        <Image source={{ uri: data.photoURL }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.initial}>{data.name?.charAt(0) || '👤'}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        {infoBox('Nom', data?.name)}
        {infoBox('Email', data?.email)}
        {infoBox('Rôle', data?.role)}
        {infoBox('Téléphone', data?.phone)}
        {infoBox('Nationalité', data?.nationality)}
        {infoBox('Université', data?.university)}
        {infoBox(
          'Date d’inscription',
          data?.createdAt ? format(data.createdAt.toDate(), 'd MMMM yyyy', { locale: fr }) : null
        )}
      </View>

      <TouchableOpacity onPress={() => router.push('/manager/edit-profile')}>
        <Text style={styles.editBtn}>✏️ Modifier mon profil</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>KOEDU Bridge</Text>
        <Text style={styles.footerText}>Votre passerelle vers les universités en Corée du Sud</Text>
        <Text style={styles.footerText}>📍 Asan, Chungnam, South Korea</Text>
        <Text style={styles.footerText}>✉ contact@koedubridge.com</Text>
        <Text style={styles.footerText}>📞 +82 10-1234-5678</Text>
        <Text style={styles.footerText}>🌐 www.koedubridge.com</Text>
        <Text style={styles.footerText}>© 2025 KOEDU Bridge • Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  backBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  marginBottom: 12,
},
backText: {
  fontSize: 16,
  color: '#1e90ff',
  marginLeft: 6,
  fontWeight: '500',
},

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  avatarPlaceholder: {
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginTop: 2,
  },
  editBtn: {
    marginTop: 20,
    fontSize: 16,
    color: '#1e90ff',
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 60,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1e293b',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
