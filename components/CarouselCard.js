import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const CARD_WIDTH = Dimensions.get('window').width * 0.8;

export default function CarouselCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH, backgroundColor: '#fff',
    borderRadius: 8, padding: 10, marginHorizontal: 10,
  },
  image: {
    width: '100%', height: CARD_WIDTH * 0.6, borderRadius: 6,
  },
  name: { fontWeight: 'bold', marginTop: 8, color: '#003366' },
  title: { marginTop: 4, color: '#555' },
});
