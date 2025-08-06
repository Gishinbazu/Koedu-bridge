import { useRouter } from 'expo-router';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventModal({ visible, event, onClose }) {
  const router = useRouter();

  if (!event) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>📅 {event.date}</Text>
          {event.description && <Text style={styles.description}>{event.description}</Text>}
          {event.link && (
            <TouchableOpacity onPress={() => Linking.openURL(event.link)}>
              <Text style={styles.link}>🔗 {event.link}</Text>
            </TouchableOpacity>
          )}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => router.push(`/admin/edit-event/${event.id}`)}>
              <Text style={styles.editBtn}>✏️ Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>❌ Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 6,
    fontSize: 14,
    color: '#475569',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editBtn: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  closeBtn: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
});
