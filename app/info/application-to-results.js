import { Image, ScrollView, StyleSheet, Text } from 'react-native';

export default function ApplicationToResults() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://source.unsplash.com/featured/?university,students' }}
        style={styles.image}
      />
      <Text style={styles.title}>From application to results</Text>
      <Text style={styles.description}>
        There are several steps and decisions that are made during the processing of your admissions application.
        Find out more about them – and what you can do after each one.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
