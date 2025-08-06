import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GoodbyeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4202/4202843.png' }}
        style={styles.image}
      />
      <Text style={styles.title}>Compte supprimé</Text>
      <Text style={styles.subtitle}>Merci d’avoir utilisé KOEDU Bridge.</Text>
      <Text style={styles.text}>Nous espérons vous revoir bientôt !</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>🏠 Retour à l'accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.linkText}>🔐 Se reconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 15,
  },
});
