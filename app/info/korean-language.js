import { Image, ScrollView, StyleSheet, Text } from 'react-native';

export default function KoreanLanguageRequirement() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://source.unsplash.com/featured/?korean,classroom' }}
        style={styles.image}
      />
      <Text style={styles.title}>Korean language requirements</Text>
      <Text style={styles.description}>
        All courses taught in Korean have a Korean language requirement.
        You can meet the requirement by submitting a valid TOPIK score (usually level 3 or above),
        completing a Korean language program at a university, or by passing an internal language evaluation.
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
