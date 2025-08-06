import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function LegalScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📜 Conditions Générales d’Utilisation (CGU)</Text>
      <Text style={styles.text}>
        En utilisant la plateforme KOEDU Bridge, vous acceptez les présentes Conditions Générales
        d’Utilisation. Vous vous engagez à fournir des informations exactes lors de votre
        inscription, à respecter les droits d’autrui, et à ne pas utiliser la plateforme à des fins
        frauduleuses ou malveillantes.
      </Text>
      <Text style={styles.text}>
        L’accès à certaines fonctionnalités peut nécessiter une vérification de votre identité. Les
        administrateurs se réservent le droit de suspendre un compte en cas de violation des
        conditions.
      </Text>

      <Text style={styles.title}>🔐 Politique de confidentialité</Text>
      <Text style={styles.text}>
        Vos données personnelles sont collectées uniquement dans le but de traiter votre
        candidature, vous assister dans les démarches administratives, et améliorer nos services.
      </Text>
      <Text style={styles.text}>
        Nous nous engageons à ne pas vendre ni divulguer vos données sans votre consentement, sauf
        obligation légale ou accord explicite.
      </Text>
      <Text style={styles.text}>
        Vous pouvez demander la suppression de votre compte et de vos données à tout moment via
        l’écran de modification de profil.
      </Text>

      <Text style={styles.text}>
        En utilisant cette application, vous consentez à cette politique de confidentialité. Pour
        toute question, contactez-nous à contact@koedubridge.com.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 24,
    color: '#1e90ff',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: '#444',
  },
});
