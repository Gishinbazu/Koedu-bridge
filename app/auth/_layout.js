import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function AuthLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // tu peux ajuster si besoin
  },
  container: {
    flex: 1,
    backgroundColor: '#000', // ou transparent selon ton background d'image
  },
});
