import { useRouter } from 'expo-router';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const cards = [
  {
    title: 'From application to results',
    description:
      'There are several steps and decisions that are made during the processing of your admissions application. Find out more about them – and what you can do after each one.',
    route: '/info/application-steps',
    image: require('../assets/images/application.png'),
  },
  {
    title: 'Find out what you need to submit',
    description:
      "Find out what documents you need to complete your master's application.",
    route: '/info/required-documents',
    image: require('../assets/images/documents.png'),
  },
  {
    title: 'Korean language requirements',
    description:
      'All courses taught in Korean have a Korean language requirement. Find out what that is – and the ways you can meet the requirement.',
    route: '/info/korean-language',
    image: require('../assets/images/korean.png'),
    badge: 'Article',
  },
];

export default function AdmissionInfoCards() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(card.route)}
          style={styles.card}
        >
          <View style={styles.imageWrapper}>
            <Image source={card.image} style={styles.image} />
            {card.badge && <Text style={styles.badge}>{card.badge}</Text>}
          </View>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.desc}>{card.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 20,
    padding: 20,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1, // ✅ carré (1:1)
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%', // ✅ carré
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#003366',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
