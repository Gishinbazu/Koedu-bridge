import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../components/Footer';

export default function ServicesScreen() {
  const router = useRouter();
  const animations = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: i * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const services = [
    {
      title: "1. Accompagnement pour l'admission universitaire",
      desc: "Nous aidons à choisir l'université et le programme qui correspondent à votre profil.",
    },
    {
      title: "2. Assistance pour les dossiers et la traduction",
      desc: "Nous préparons, traduisons et vérifions vos documents d’admission.",
    },
    {
      title: "3. Appui pour le visa 🌐",
      desc: "Nous vous guidons pour le dossier visa D-4/D-2 et les RDV consulaires.",
    },
    {
      title: "4. Préparation au départ",
      desc: "Conseils sur billets, bagages, assurances et arrivée à l’aéroport.",
    },
    {
      title: "5. Accueil en Corée",
      desc: "Accueil à l’aéroport, installation, et démarches administratives.",
    },
    {
      title: "6. Suivi et accompagnement sur place",
      desc: "Aide pour santé, renouvellement visa, emploi étudiant, etc.",
    },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/1600x900/?korea,student' }}
      blurRadius={6}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => router.push('/user/dashboard')}>
              <Text style={styles.navText}>Accueil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.navText}>À propos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/contact')}>
              <Text style={styles.navText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Titre */}
        <Text style={styles.title}>Nos Services</Text>
        <Text style={styles.desc}>
          KOEDU Bridge vous accompagne à chaque étape de votre projet d'études en Corée :
        </Text>

        {/* ✅ Cartes animées */}
        {services.map((service, i) => (
          <Animated.View
            key={i}
            style={[
              styles.card,
              {
                opacity: animations[i],
                transform: [{ translateY: animations[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.cardDesc}>{service.desc}</Text>
          </Animated.View>
        ))}

        {/* ✅ Footer */}
        <Footer />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nav: {
    flexDirection: 'row',
    gap: 16,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: '#f1f5f9',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
