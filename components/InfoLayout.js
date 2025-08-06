// ✅ components/InfoLayout.js
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SidebarInfoNav from './SidebarInfoNav';
import TopNavbar from './TopNavbar';

export default function InfoLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar onMenuPress={() => setSidebarVisible(true)} />

      {sidebarVisible && (
        <SidebarInfoNav onClose={() => setSidebarVisible(false)} />
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {children}
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
