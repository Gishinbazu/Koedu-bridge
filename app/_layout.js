import { Slot, usePathname } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Footer from '../components/Footer';

export default function Layout() {
  const pathname = usePathname();

  // ✅ Routes qui doivent cacher le footer
  const hiddenPrefixes = [
    '/auth/',
    '/user/',
    '/admin/',
    '/manager/',
    '/calendar',
    '/about',
    '/services',
    '/contact',
    '/blog/','/info/',
  ];

  // ✅ Fonction de vérification par wildcard
  const hideHeaderFooter = hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Slot />
        {!hideHeaderFooter && <Footer />}
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
