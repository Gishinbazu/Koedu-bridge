import { useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { width } = useWindowDimensions();

  // Responsive: 4 cols (≥1100), 2 cols (≥700), 1 col (<700)
  const colWidth =
    width >= 1100 ? '23%' :
    width >= 700  ? '45%'  :
                    '100%';

  const handleSubscribe = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      Toast.show({ type: 'error', text1: 'Adresse email invalide' });
      return;
    }
    Toast.show({ type: 'success', text1: 'Merci pour votre inscription !' });
    setEmail('');
  };

  return (
    <View accessibilityRole="contentinfo" style={styles.shell}>
      {/* fine ligne qui “connecte” le contenu au footer */}
      <View style={styles.topLine} />

      {/* conteneur centré aligné à 1100px */}
      <View style={styles.inner}>
        <View style={[styles.column, { width: colWidth }]}>
          <Text style={styles.logo}>KOEDU Bridge</Text>
          <Text style={styles.company}>
            Votre passerelle vers les universités en Corée du Sud
          </Text>
        </View>

        <View style={[styles.column, { width: colWidth }]}>
          <Text style={styles.heading}>📬 Contact</Text>
          <Text style={styles.item}>📍 Asan, Chungnam, South Korea</Text>
          <Text
            style={[styles.item, styles.link]}
            onPress={() => Linking.openURL('mailto:contact@koedubridge.com')}
          >
            ✉ contact@koedubridge.com
          </Text>
          <Text
            style={[styles.item, styles.link]}
            onPress={() => Linking.openURL('tel:+821012345678')}
          >
            📞 +82 10-1234-5678
          </Text>
          <Text
            style={[styles.item, styles.link]}
            onPress={() => Linking.openURL('https://koedubridge.com')}
          >
            🌐 www.koedubridge.com
          </Text>
        </View>

        <View style={[styles.column, { width: colWidth }]}>
          <Text style={styles.heading}>🌟 À propos</Text>
          <Text style={styles.tweet}>
            KOEDU Bridge accompagne les étudiants internationaux dans leur projet d’études en Corée, du dossier à l’arrivée.
          </Text>
          <Text style={styles.tweet}>Plateforme sécurisée, rapide, humaine.</Text>
        </View>

        <View style={[styles.column, { width: colWidth }]}>
          <Text style={styles.heading}>📩 Newsletter</Text>
          <View style={styles.newsletter}>
            <TextInput
              style={styles.input}
              placeholder="Votre adresse email"
              placeholderTextColor="#a3b2c6"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onSubmitEditing={handleSubscribe}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
              <Text style={styles.btnText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.copy}>
          © {new Date().getFullYear()} KOEDU Bridge • Tous droits réservés
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // bande plein-large
  shell: {
    width: '100%',
    backgroundColor: '#1e293b',
  },
  topLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  // conteneur aligné au site
  inner: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  column: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 6,
  },
  company: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
  },
  heading: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700',
  },
  item: {
    color: '#d7e0eb',
    marginBottom: 6,
    fontSize: 14,
  },
  link: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
  tweet: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  newsletter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#0f172a',
    color: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#facc15',
    height: 40,
    minWidth: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  btnText: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '800',
  },
  copy: {
    width: '100%',
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 12,
  },
});
