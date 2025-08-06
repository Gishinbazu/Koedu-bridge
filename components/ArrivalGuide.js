import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const guideSteps = [
  {
    id: '1',
    icon: 'card-outline',
    title: 'Enregistrer sa carte de séjour (ARC)',
    desc: 'Dans les 90 jours suivant l’arrivée, rendez-vous à l’immigration locale avec votre passeport, photo ID, formulaire ARC et copie du contrat de logement.',
  },
  {
    id: '2',
    icon: 'business-outline',
    title: 'Ouvrir un compte bancaire coréen',
    desc: 'Choisissez une banque (KB, Shinhan, Woori…) et munissez-vous de votre passeport, ARC (ou preuve de demande), et téléphone coréen.',
  },
  {
    id: '3',
    icon: 'phone-portrait-outline',
    title: 'Obtenir une carte SIM locale',
    desc: 'Souscrivez à un forfait prépayé ou contrat mensuel chez un opérateur coréen (KT, LG U+, SKT). Un passeport suffit dans certains cas.',
  },
  {
    id: '4',
    icon: 'bus-outline',
    title: 'Se familiariser avec le transport',
    desc: 'Achetez une carte T-money (distributeurs, supérettes) et téléchargez les apps “Naver Map” ou “KakaoMetro”.',
  },
  {
    id: '5',
    icon: 'school-outline',
    title: 'Aller à l’université',
    desc: 'Participez aux journées d’accueil. Pensez à activer vos identifiants étudiants pour accéder à Moodle, bibliothèque, etc.',
  },
];

export default function ArrivalGuide() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🇰🇷 Guide d’arrivée en Corée du Sud</Text>
      {guideSteps.map((step) => (
        <View key={step.id} style={styles.step}>
          <Ionicons name={step.icon} size={22} color="#4f46e5" style={styles.icon} />
          <View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    color: '#0f172a',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  stepTitle: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
    color: '#1e293b',
  },
  stepDesc: {
    fontSize: 13,
    color: '#475569',
  },
});
