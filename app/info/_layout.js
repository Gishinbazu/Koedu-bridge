// ✅ app/info/_layout.js (to inject TopNavbar + Sidebar on all /info/* pages)
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TopNavbar from '../../components/TopNavbar';
import Sidebar from '../../components/sidebar';

export default function InfoLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top navigation */}
      <TopNavbar onMenuPress={() => setSidebarVisible(true)} />

      {/* All /info/* pages */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* Sidebar menu */}
      {sidebarVisible && <Sidebar onClose={() => setSidebarVisible(false)} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
});
