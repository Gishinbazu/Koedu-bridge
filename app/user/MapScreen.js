// app/user/map.js
import { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';

export default function MapScreen() {
  useEffect(() => {
    console.log("Platform:", Platform.OS); // pour debug
  }, []);

  if (Platform.OS === 'web') {
    return (
      <iframe
        title="Universities Map"
        src="https://www.google.com/maps/d/u/0/embed?mid=1q2w3e4r5t6y7u8i9o0p&ehbc=2E312F" // remplace par ton vrai lien My Maps
        width="100%"
        height="600"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      />
    );
  }

  // Fallback mobile
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🌐 Carte disponible uniquement sur la version web</Text>
    </View>
  );
}
