import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates'; // pour rechargement optionnel
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import DeleteAccountModal from './DeleteAccountModal';

export default function ManagerSettings() {
  const router = useRouter();
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    Updates.reloadAsync(); // recharge l’app pour appliquer
  };

  const handleDelete = () => {
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && { backgroundColor: '#111' }]}>
      {/* Retour */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
      </TouchableOpacity>

      <Text style={[styles.title, isDark && { color: '#fff' }]}>⚙️ Paramètres</Text>

      {/* Notifications (statique) */}
      <View style={styles.settingBox}>
        <Text style={[styles.label, isDark && { color: '#ccc' }]}>Notifications</Text>
        <Text style={[styles.value, isDark && { color: '#fff' }]}>Activées</Text>
      </View>

      {/* Thème */}
      <View style={styles.settingBox}>
        <Text style={[styles.label, isDark && { color: '#ccc' }]}>Thème</Text>
        <View style={styles.row}>
          <Text style={[styles.value, isDark && { color: '#fff' }]}>
            {isDark ? 'Sombre' : 'Clair'}
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Langue (statique pour l’instant) */}
      <View style={styles.settingBox}>
        <Text style={[styles.label, isDark && { color: '#ccc' }]}>Langue</Text>
        <Text style={[styles.value, isDark && { color: '#fff' }]}>Français</Text>
      </View>

      {/* Changer mot de passe */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#1e90ff' }]}
        onPress={() => router.push('/manager/change-password')}
      >
        <Text style={styles.btnText}>Changer le mot de passe</Text>
      </TouchableOpacity>

      {/* Supprimer compte */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: '#dc3545' }]}
        onPress={handleDelete}
      >
        <Text style={styles.btnText}>Supprimer mon compte</Text>
      </TouchableOpacity>

      {/* Modale de suppression */}
      <DeleteAccountModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backBtn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingBox: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
