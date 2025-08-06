import { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    alert(`Merci pour votre inscription : ${email}`);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.column}>
        <Text style={styles.logo}>KOEDU Bridge</Text>
        <Text style={styles.company}>
          Votre passerelle vers les universités en Corée du Sud
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.heading}>📬 Contact</Text>
        <Text>📍 Asan, Chungnam, South Korea</Text>
        <Text onPress={() => Linking.openURL('mailto:contact@koedubridge.com')}>✉ contact@koedubridge.com</Text>
        <Text onPress={() => Linking.openURL('tel:+821012345678')}>📞 +82 10-1234-5678</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://koedubridge.com')}>
          🌐 www.koedubridge.com
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.heading}>🌟 À propos</Text>
        <Text style={styles.tweet}>KOEDU Bridge accompagne les étudiants internationaux dans leur projet d’études en Corée, du dossier à l’arrivée.</Text>
        <Text style={styles.tweet}>Plateforme sécurisée, rapide, humaine.</Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.heading}>📩 Newsletter</Text>
        <View style={styles.newsletter}>
          <TextInput
            style={styles.input}
            placeholder="Votre adresse email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
            <Text style={styles.btnText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.copy}>© 2025 KOEDU Bridge • Tous droits réservés</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1e293b',
    paddingVertical: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  column: {
    width: '45%',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 12,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  link: {
    color: '#60a5fa',
    textDecorationLine: 'underline',
  },
  tweet: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
  },
  newsletter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#facc15',
    height: 36,
    width: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    color: '#1e293b',
  },
  copy: {
    width: '100%',
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 20,
    fontSize: 12,
  },
});
