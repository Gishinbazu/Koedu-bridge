// app/programs/index.js
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RedirectToInfo() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/info');
  }, []);

  return null;
}
