import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DocumentPreview from './DocumentPreview';
import StatusIndicator from './StatusIndicator';

export default function ApplicationDetail({ data, onUpdateStatus }) {
  if (!data) return <Text>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Informations du candidat</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>{data.fullName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Nationalité :</Text>
        <Text style={styles.value}>{data.nationality}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{data.email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Statut actuel :</Text>
        <StatusIndicator status={data.status} />
      </View>

      <Text style={styles.subtitle}>📎 Documents soumis</Text>

      {data.documents && data.documents.map((doc, idx) => (
        <DocumentPreview key={idx} name={doc.name} uri={doc.uri} />
      ))}

      <Text style={styles.subtitle}>✅ Action administrateur</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#22c55e' }]} onPress={() => onUpdateStatus('accepted')}>
          <Text style={styles.buttonText}>✅ Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ef4444' }]} onPress={() => onUpdateStatus('rejected')}>
          <Text style={styles.buttonText}>❌ Rejeter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    width: 120,
  },
  value: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
