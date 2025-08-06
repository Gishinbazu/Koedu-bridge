import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../services/firebase';

export default function PlatformSettings() {
  const [form, setForm] = useState({
    platformName: '',
    description: '',
    logoURL: '',
    notifyEmail: true,
    notifyPush: false,
  });

  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRoleAndData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || userSnap.data().role !== 'superadmin') {
        Alert.alert('Accès refusé', 'Seuls les superadmins peuvent modifier ces paramètres.');
        router.replace('/admin/settings');
        return;
      }

      setCurrentRole('superadmin');

      const settingsRef = doc(db, 'settings', 'app');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        setForm(settingsSnap.data());
      }

      setLoading(false);
    };

    fetchRoleAndData();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'app'), form);
      Alert.alert('✅ Sauvegarde réussie', 'Les paramètres ont été enregistrés.');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde', err);
      Alert.alert('❌ Erreur', 'Impossible d’enregistrer les paramètres.');
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <Text style={{ padding: 20 }}>Chargement des paramètres...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Paramètres de la plateforme</Text>

      <Text style={styles.label}>Nom de la plateforme</Text>
      <TextInput
        style={styles.input}
        value={form.platformName}
        onChangeText={(text) => handleChange('platformName', text)}
        placeholder="KOEDU Bridge"
      />

      <Text style={styles.label}>Slogan / Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Votre passerelle vers les universités coréennes"
      />

      <Text style={styles.label}>URL du logo</Text>
      <TextInput
        style={styles.input}
        value={form.logoURL}
        onChangeText={(text) => handleChange('logoURL', text)}
        placeholder="https://..."
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>📧 Notifications Email</Text>
        <Switch
          value={form.notifyEmail}
          onValueChange={(val) => handleChange('notifyEmail', val)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>🔔 Notifications Push</Text>
        <Switch
          value={form.notifyPush}
          onValueChange={(val) => handleChange('notifyPush', val)}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Enregistrer les modifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  switchLabel: {
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: '#1a73e8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
