import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeHero({ scrollToIndex }) {
  return (
    <ImageBackground
      source={require('../assets/images/image 01.jpg')}
      style={[styles.hero, { height: SCREEN_HEIGHT }]}
      resizeMode="cover"
    >
      <Text style={styles.heroTitle}>Education can be started at Any Age!</Text>
      <View style={styles.form}>
        <TextInput placeholder="Course Name or ID" style={styles.input} placeholderTextColor="#666" />
        <TextInput placeholder="Category" style={styles.input} placeholderTextColor="#666" />
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Search Course</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.scrollBtn} onPress={() => scrollToIndex(1)}>
        <Text style={styles.scrollIcon}>↓</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15,
  },
  heroTitle: {
    color: '#fff', fontSize: 28, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 10,
  },
  form: {
    width: '80%', backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8, padding: 15, marginBottom: 30,
  },
  input: {
    height: 44, borderColor: '#003366', borderWidth: 1,
    borderRadius: 4, marginBottom: 12, paddingHorizontal: 10,
    backgroundColor: '#fff', color: '#003366',
  },
  submitBtn: {
    backgroundColor: '#003366', paddingVertical: 12,
    borderRadius: 4, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16 },
  scrollBtn: { marginTop: 20, padding: 14, borderRadius: 50, backgroundColor: '#fff' },
  scrollIcon: { fontSize: 24, color: '#003366' },
});
