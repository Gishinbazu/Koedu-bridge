// app/_layout.js
import { Stack } from 'expo-router';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import Footer from '../components/Footer';
import TopNavbar from '../components/TopNavbar';
import { ThemeProvider, useAppTheme } from '../theme/AppTheme';

function Frame() {
  // Si tes composants lisent les couleurs du thème, on peut les récupérer ici
  const { theme, isDarkMode } = useAppTheme();

  // Calcule proprement le padding top Android pour la status bar translucide
  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.top ?? '#000' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* ✅ Scroll global */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topInset }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Top navbar en haut du flux */}
        <View style={styles.navWrapper}>
          <TopNavbar />
        </View>

        {/* Zone principale des écrans */}
        <View style={styles.screenArea}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: Platform.select({ ios: 'fade', android: 'fade' }),
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </View>

        {/* ✅ Footer intégré au scroll */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider defaultScheme="royal" defaultDark={false}>
      <Frame />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20, // espace sous le footer
  },
  navWrapper: {
    // petite marge sous la status bar iOS est gérée par SafeAreaView
  },
  screenArea: {
    flex: 1,
    minHeight: '100%', // pousse le footer en bas si contenu court
    backgroundColor: 'transparent',
  },
});
