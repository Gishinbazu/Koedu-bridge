import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EnglishRequirements() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumb}>
          Startpage {'>'} Find out more... {'>'} English language requirements
        </Text>
      </View>

      <Text style={styles.title}>
        English language{'\n'}
        <Text style={styles.titleHighlight}>requirements</Text>
      </Text>

      <Text style={styles.subtitle}>
        All courses taught in English have an English requirement.
        Find out what that is – and the ways you can meet the requirement.
      </Text>

      <Image
        source={require('../../assets/images/korean-req.jpg')} // remplace avec une image pertinente
        style={styles.heroImage}
      />

      {/* Tu peux ajouter ici le contenu expliquant les tests acceptés, TOEFL, IELTS, etc. */}
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
