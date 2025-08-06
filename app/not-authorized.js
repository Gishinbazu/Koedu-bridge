import { StyleSheet, Text, View } from 'react-native';

export default function NotAuthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⛔ Accès refusé</Text>
      <Text>Vous n'avez pas les permissions pour accéder à cette page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#cc0000',
  },
});
