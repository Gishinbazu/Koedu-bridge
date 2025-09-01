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

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ✅ Scroll global, mobile et desktop */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20, // espace pour éviter que le footer colle au bord sur mobile
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },
  screenArea: {
    flex: 1,
    minHeight: '100%', // pousse le footer en bas si contenu court
    backgroundColor: 'transparent',
  },
});
