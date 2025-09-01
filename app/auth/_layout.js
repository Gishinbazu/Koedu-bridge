// app/_layout.js
import { Stack } from 'expo-router';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Footer from '../../components/Footer'; // ✅ importe ton footer

const FOOTER_HEIGHT = 64; // ajuste la hauteur à celle de ton <Footer />

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.select({ ios: 'fade', android: 'fade' }),
            // 👉 padding bas global pour que les écrans scrollables
            //    ne passent pas sous le footer
            contentStyle: { backgroundColor: 'transparent', paddingBottom: FOOTER_HEIGHT },
          }}
        />
        {/* Footer fixé en bas */}
        <View style={[styles.footerWrap, { height: FOOTER_HEIGHT }]}>
          <Footer />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, backgroundColor: 'transparent' },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,           // stick en bas (mobile + web)
    backgroundColor: 'transparent',
  },
});
