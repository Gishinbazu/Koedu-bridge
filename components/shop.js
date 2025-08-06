// components/shop.js
import { StyleSheet, Text, View } from 'react-native';

export default function Shop() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Page</Text>
      {/* Add shop product cards later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
});
