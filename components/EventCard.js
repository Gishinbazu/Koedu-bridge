import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventCard({ event, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(event)}>
      <View style={[styles.colorDot, { backgroundColor: event.color || '#2563eb' }]} />
      <View style={styles.info}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>📅 {event.date}</Text>
        {event.type && <Text style={styles.type}>📌 {event.type}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  type: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 2,
  },
});
