import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../../services/firebase';
import RightBarMenu from './RightBarMenu';

export default function ManagerLayout() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {/* Bouton ☰ / ❌ + Menu flottant */}
      <RightBarMenu />

      {/* Navigation Stack sans header */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
