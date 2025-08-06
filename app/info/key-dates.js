// app/info/key-dates.js
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SidebarInfoNav from '../../components/SidebarInfoNav';
import TopNavbar from '../../components/TopNavbar';

export default function KeyDatesPage() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar onMenuPress={() => setSidebarVisible(true)} />
      {sidebarVisible && (
        <SidebarInfoNav onClose={() => setSidebarVisible(false)} />
      )}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🧾 CONTENU DE LA PAGE ICI */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
});
