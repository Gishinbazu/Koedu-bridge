import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#003366" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* 🧭 Titre principal */}
      <Text style={styles.title}>About KOEDU Bridge</Text>

      {/* 🌍 Mission */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌍 Our Mission</Text>
        <Text style={styles.paragraph}>
          KOEDU Bridge exists to simplify the journey of international students aspiring to study in Korea.
          We believe in transparent, student-centered services that remove the barriers between global talent
          and quality Korean higher education.
        </Text>
      </View>

      {/* 📘 Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📘 What We Offer</Text>
        <Text style={styles.paragraph}>
          - Search and compare verified university programs (Bachelor’s, Master’s, Language courses){"\n"}
          - Get clear information on tuition fees, deadlines, and entry requirements{"\n"}
          - Submit your application online and track your progress{"\n"}
          - Access help guides, FAQs, and official contact support in English and French
        </Text>
      </View>

      {/* 💡 Pourquoi KOEDU */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Why KOEDU?</Text>
        <Text style={styles.paragraph}>
          KOEDU Bridge is built by students and educators who understand the real challenges of studying abroad.
          Our platform connects ambition with opportunity – without confusion, without scams, and with
          professional support every step of the way.
        </Text>
      </View>

      {/* 🤝 Valeurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤝 Our Values</Text>
        <Text style={styles.paragraph}>
          Transparency. Accessibility. Student Empowerment. Cultural Exchange.
        </Text>
      </View>

      {/* 📫 Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📫 Contact</Text>
        <Text style={styles.paragraph}>
          Have questions? Reach out to us through our contact form or email{" "}
          <Text style={{ fontWeight: 'bold' }}>support@koedu.kr</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#003366',
    marginLeft: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
