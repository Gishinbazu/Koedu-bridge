import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const sections = [
  {
    title: "Apply to master's",
    description:
      "Find detailed, step-by-step instructions on how to complete and submit an application for master's studies in Korea.",
    route: "/info/masters",
  },
  {
    title: "Apply to bachelor's",
    description:
      "If you're interested in bachelor’s studies, find out how to apply through KOEDU Bridge.",
    route: "/info/bachelors",
  },
  {
    title: "Dates and deadlines",
    description:
      "A successful application means meeting deadlines. Check important dates for your submission.",
    route: "/info/deadlines",
  },
];

export default function AcademicInfoSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {sections.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => router.push(item.route)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
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
    backgroundColor: '#f0f8ff',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#e7f2fc',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: 250,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  title: {
    color: '#003366',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  desc: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
});
