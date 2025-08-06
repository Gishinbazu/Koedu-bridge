import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../components/Footer';

export default function ContactScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendEmail = () => {
    Linking.openURL('mailto:contact@koedubridge.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+821012345678');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/1024x768/?korea,student' }}
      style={styles.background}
      blurRadius={5}
    >
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#020202" />
          <Text style={styles.headerLink}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/user/dashboard')}>
            <Text style={styles.headerLink}>Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/about')}>
            <Text style={styles.headerLink}>À propos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/services')}>
            <Text style={styles.headerLink}>Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={[styles.overlayBox, { opacity: fadeAnim }]}>
          <Text style={styles.title}>📞 Contactez-nous</Text>
          <Text style={styles.desc}>
            N'hésitez pas à nous contacter pour toute question sur votre admission, votre visa ou votre
            séjour en Corée.
          </Text>

          <View style={styles.contactBox}>
            <Ionicons name="mail-outline" size={24} color="#60a5fa" />
            <Text style={styles.contactText} onPress={handleSendEmail}>
              contact@koedubridge.com
            </Text>
          </View>

          <View style={styles.contactBox}>
            <Ionicons name="call-outline" size={24} color="#60a5fa" />
            <Text style={styles.contactText} onPress={handleCall}>
              +82 10-1234-5678
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Votre message :</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Écrivez votre question ici..."
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ✅ Footer */}
      <Footer />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  overlayBox: {
    backgroundColor: '#0f172acc',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f9fafb',
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 20,
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
