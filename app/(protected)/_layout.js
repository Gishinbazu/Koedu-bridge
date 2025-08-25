import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function ProtectedLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
