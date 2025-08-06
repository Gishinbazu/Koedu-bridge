import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ApplicationSteps() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumb}>Startpage {'>'} Find out more... {'>'} What happens between the application deadline and admissions results?</Text>
      </View>

      <Text style={styles.title}>
        What happens between{'\n'}<Text style={styles.titleHighlight}>application deadline and admissions results?</Text>
      </Text>

      <Text style={styles.subtitle}>
        There are several steps and decisions that are made during the processing of your admissions application.
        Find out more about them – and what you can do after each one.
      </Text>

      <Image
        source={require('../../assets/images/students-talking.jpg')} // 📌 Mets l'image correspondante ici
        style={styles.heroImage}
      />

      {/* Tu peux continuer ici avec les étapes détaillées */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  breadcrumbs: {
    marginBottom: 10,
  },
  breadcrumb: {
    color: '#666',
    fontSize: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    lineHeight: 32,
  },
  titleHighlight: {
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 30,
  },
});
