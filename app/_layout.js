// app/_layout.js
import { Stack } from 'expo-router';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.select({ ios: 'fade', android: 'fade' }),
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, backgroundColor: 'transparent' },
});
