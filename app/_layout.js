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
import { ThemeProvider, useAppTheme } from '../theme/AppTheme';

// Outer: provides theme to the whole app
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}

// Inner: consumes theme (so StatusBar + backgrounds follow palette)
function RootLayoutInner() {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.top }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />

      {/* ✅ Global scroll (mobile + desktop) */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main screen area */}
        <View style={[styles.screenArea, { backgroundColor: 'transparent' }]}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: Platform.select({ ios: 'fade', android: 'fade' }),
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </View>

        {/* ✅ Footer integrated in scroll */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20, // spacing so footer doesn't stick to edge on mobile
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },
  screenArea: {
    flex: 1,
    minHeight: '100%', // push footer to bottom if content is short
  },
});
