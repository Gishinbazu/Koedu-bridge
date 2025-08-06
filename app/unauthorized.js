// app/unauthorized.js
import { Text, View } from 'react-native';

export default function UnauthorizedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, color: 'red' }}>⛔ Accès refusé</Text>
      <Text>Vous n'avez pas les autorisations nécessaires.</Text>
    </View>
  );
}
