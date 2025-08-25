// app/_layout.js
import { Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Footer from '../components/Footer';
import { ensureSignedIn } from '../services/firebase';

const ENABLE_AUTO_AUTH = true; // passe à false si tu veux zéro appel Firebase au boot

export default function RootLayout() {
  const pathname = (usePathname() || '').toLowerCase();
  const [ready, setReady] = useState(!ENABLE_AUTO_AUTH);

  // (Optionnel) Masquer le footer sur certaines routes
  const HIDE_FOOTER = [
    /^\/(auth|user|admin|manager)\b/,
    /^\/(calendar|about|services|contact)\b/,
    /^\/(blog|info)\//,
  ];
  const hideFooter = HIDE_FOOTER.some(rx => rx.test(pathname));

  useEffect(() => {
    if (!ENABLE_AUTO_AUTH) return;
    let mounted = true;
    (async () => {
      try {
        await ensureSignedIn(); // init auth (anonyme si activée côté console)
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="small" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Le footer est DANS le ScrollView => il apparaît en bas quand on défile */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenu de la page */}
        <View style={styles.content}>
          <Slot />
        </View>

        {/* Footer connecté (scrolls avec le contenu) */}
        {!hideFooter && (
          <View style={styles.footerArea}>
            <Footer />
          </View>
        )}
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' }, // laisse voir les fonds/dégradés des écrans
  // Le ScrollView enveloppe contenu + footer
  scrollContent: {
    flexGrow: 1,
    // un peu d’espace en bas si tu veux respirer
    paddingBottom: 0,
  },
  // Le contenu prend la largeur dispo; chaque écran gère son maxWidth via ses wrappers
  content: {
    flexGrow: 1,
  },
  // Zone du footer (pas de flex, il vient après le contenu)
  footerArea: {
    // rien de spécial: le Footer lui-même gère maxWidth=1100 et le style
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
