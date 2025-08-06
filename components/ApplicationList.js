import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusIndicator from './StatusIndicator';

export default function ApplicationList({ applications }) {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/admin/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.fullName}</Text>
        <StatusIndicator status={item.status} />
      </View>
      <Text style={styles.detail}>Nationalité : {item.nationality}</Text>
      <Text style={styles.detail}>Email : {item.email}</Text>
      <Text style={styles.detail}>Soumis le : {item.submissionDate}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={applications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0f172a',
  },
  detail: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 2,
  },
});
