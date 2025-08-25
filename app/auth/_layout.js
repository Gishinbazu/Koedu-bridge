// app/auth/_layout.js
import { Stack } from 'expo-router';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView style={styles.safe} edges={['top','right','left','bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.select({ ios: 'fade', android: 'fade' }),
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
});
