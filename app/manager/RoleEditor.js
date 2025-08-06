import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../services/firebase';

export default function RoleEditor({ userId, currentRole, onUpdated }) {
  const [edit, setEdit] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleUpdate = async () => {
    if (!['user', 'admin', 'manager'].includes(role)) {
      Alert.alert('⚠️ Rôle invalide', 'Utilisez : user, admin ou manager');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role });
      Alert.alert('✅ Rôle mis à jour');
      setEdit(false);
      onUpdated && onUpdated(); // callback vers parent
    } catch (err) {
      Alert.alert('❌ Erreur', err.message);
    }
  };

  if (currentRole === 'superadmin') {
    return <Text style={[styles.role, { color: '#ff9900' }]}>👑 Superadmin</Text>;
  }

  return edit ? (
    <View style={styles.editContainer}>
      <TextInput
        value={role}
        onChangeText={setRole}
        placeholder="Rôle (user, admin, manager)"
        style={styles.input}
      />
      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Valider</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={() => setEdit(true)} style={styles.editBtn}>
      <Text style={styles.editText}>✏️ Modifier rôle</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    flex: 1,
  },
  btn: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editBtn: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007aff',
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    textAlign: 'center',
  },
  role: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
