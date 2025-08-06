import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { checkAdminAccess, checkAuth } from '../utils/AuthGuard';

export default function OnlyAdmin({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();

      if (!user) {
        router.replace('/login');
        return;
      }

      const isAdmin = await checkAdminAccess(user.uid);

      if (!isAdmin) {
        router.replace('/not-authorized'); // 🔒 redirection si non autorisé
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    verify();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Vérification des droits d'accès...</Text>
      </View>
    );
  }

  return <>{authorized && children}</>;
}
