import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Footer from '../components/Footer';

export default function About() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/1024x768/?education,korea' }}
      style={styles.page}
      blurRadius={5}
    >
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/user/dashboard')}>
          <Ionicons name="arrow-back" size={20} color="#020202" />
          <Text style={styles.headerLink}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/user/dashboard')}>
            <Text style={styles.headerLink}>Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/services')}>
            <Text style={styles.headerLink}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/contact')}>
            <Text style={styles.headerLink}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Main Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlayBox}>
          <Text style={styles.mainTitle}>À PROPOS</Text>

          <Text style={styles.paragraph}>
            <Text style={styles.highlight}>KOEDU BRIDGE</Text> est une plateforme numérique qui connecte
            les étudiants étrangers, notamment africains, avec les universités coréennes. Elle facilite
            l’admission, le processus de visa, l’installation et l’intégration pour garantir une expérience
            réussie en Corée du Sud.
          </Text>

          <Text style={styles.sectionTitle}>🎯 Objectifs</Text>
          <Text style={styles.paragraph}>
            • Plateforme centralisée d’accompagnement{'\n'}
            • Simplification des procédures administratives{'\n'}
            • Réduction des arnaques liées aux études en Corée{'\n'}
            • Intégration rapide et efficace dès l’arrivée
          </Text>

          <Text style={styles.sectionTitle}>🎓 Public ciblé</Text>
          <Text style={styles.paragraph}>
            • Étudiants (lycéens / diplômés){'\n'}
            • Parents et tuteurs{'\n'}
            • Agences locales partenaires{'\n'}
            • Universités coréennes
          </Text>

          <Text style={styles.sectionTitle}>💡 Nos solutions</Text>
          <Text style={styles.paragraph}>
            • Formulaires intelligents et suivi digitalisé{'\n'}
            • Tableau de bord utilisateur et admin{'\n'}
            • Système multilingue (🇫🇷 🇰🇷 🇬🇧){'\n'}
            • Réseau d’ambassadeurs KOEDU dans chaque pays cible
          </Text>

          <Text style={styles.sectionTitle}>🤝 Rejoignez-nous</Text>
          <Text style={styles.paragraph}>
            KOEDU BRIDGE recherche des universités partenaires, agences éducatives et sponsors souhaitant
            contribuer à une mobilité internationale plus humaine et efficace.
          </Text>
        </View>
      </ScrollView>

      {/* ✅ Footer */}
      <Footer />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  headerLink: {
    color: '#020202',
    fontSize: 16,
    marginLeft: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBox: {
    backgroundColor: '#0f172acc',
    borderRadius: 12,
    padding: 24,
    maxWidth: 800,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#60a5fa',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#d1d5db',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#93c5fd',
  },
});
