import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';

export default function EditStatsScreen() {
  const [stats, setStats] = useState({
    partner_universities: '',
    applications_submitted: '',
    accepted_students: '',
    countries_represented: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, 'koedu_stats', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStats(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (key, value) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        partner_universities: parseInt(stats.partner_universities),
        applications_submitted: parseInt(stats.applications_submitted),
        accepted_students: parseInt(stats.accepted_students),
        countries_represented: parseInt(stats.countries_represented),
      };
      await setDoc(doc(db, 'koedu_stats', 'main'), dataToSave);
      Alert.alert('Success', 'Statistics updated successfully.');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save statistics.');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed-outline" size={40} color="#ccc" />
        <Text style={styles.denied}>You do not have access to this page.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#333' }}>Loading stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎓 Edit KOEDU Statistics</Text>

      {Object.entries(stats).map(([key, value]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{formatKey(key)}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(value)}
            onChangeText={(val) => handleChange(key, val)}
          />
        </View>
      ))}

      <Pressable onPress={handleSave} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Ionicons name="save-outline" size={20} color="#003366" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Save changes</Text>
      </Pressable>
    </ScrollView>
  );
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f7fb',
    maxWidth: 600,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: Platform.OS === 'web' ? 12 : 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f7cc53',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003366',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  denied: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
