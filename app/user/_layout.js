import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Breadcrumb from '../../components/Breadcrumb'; // ✅ Texte défilant
import FloatingSidebar from '../../components/FloatingSidebar';

export default function UserLayout() {
  return (
    <SafeAreaView style={styles.wrapper}>
      {/* 🔵 Menu latéral flottant */}
      <FloatingSidebar />

      {/* ✅ Texte défilant (remplace fil d’Ariane classique) */}
      <Breadcrumb
        text="📢 Bienvenue sur KOEDU Bridge – Plateforme pour simplifier votre admission, visa et arrivée en Corée du Sud 🇰🇷"
        direction="left"
        speed={10}
      />

      {/* ⚪ Contenu principal de chaque page */}
      <View style={styles.pageContent}>
        <Slot />
      </View>

      {/* ⚫ Footer toujours visible en bas */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f9fafb', // ou '#ffffff' selon le thème
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pageContent: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
});
