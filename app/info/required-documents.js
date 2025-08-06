import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RequiredDocuments() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.breadcrumbs}>
        <Text style={styles.breadcrumb}>
          Startpage {'>'} Find out more... {'>'} Required documents for application
        </Text>
      </View>

      <Text style={styles.title}>
        Find out what you need{'\n'}
        <Text style={styles.titleHighlight}>to submit</Text>
      </Text>

      <Text style={styles.subtitle}>
        Find out what documents you need to complete your master's application.
      </Text>

      <Image
        source={require('../../assets/images/required-docs.jpg')} // remplace avec une image pertinente
        style={styles.heroImage}
      />

      {/* Ajoute ici la suite du contenu */}
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
