import { StyleSheet, Text, View } from 'react-native';

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur la page d’accueil Admin 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
});
