// app/program/[id].js – Détail d'un programme universitaire
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import TopNavbar from '../../components/TopNavbar';
import { db } from '../../services/firebase';

export default function ProgramDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const docRef = doc(db, 'programs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgram({ id: docSnap.id, ...docSnap.data() });
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du programme :', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProgram();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#003366" />;
  }

  if (!program) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Programme non trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TopNavbar />

      <View style={styles.header}>
        <Text style={styles.title}>{program.title}</Text>
        <Text style={styles.subtitle}>{program.university} – {program.level}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description :</Text>
        <Text style={styles.text}>{program.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Semestre :</Text>
        <Text style={styles.text}>{program.semester}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Durée :</Text>
        <Text style={styles.text}>{program.duration || 'Non spécifié'} </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Langue :</Text>
        <Text style={styles.text}>{program.language || 'Non indiqué'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Frais :</Text>
        <Text style={styles.text}>{program.fees || 'Non renseigné'}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  text: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
    lineHeight: 22,
  },
});
