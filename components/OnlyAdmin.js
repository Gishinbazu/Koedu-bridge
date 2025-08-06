// components/OnlyAdmin.js
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuthGuard } from '../utils/AuthGuard';

export default function OnlyAdmin({ children }) {
  const { role, loading } = useAuthGuard();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  if (role !== 'admin' && role !== 'superadmin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: 'red', textAlign: 'center' }}>
          ❌ Accès refusé. Cette section est réservée aux administrateurs.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
