// hooks/useColorScheme.ts
import { useColorScheme as _useColorScheme } from 'react-native';

// Renvoie 'light' ou 'dark'
export function useColorScheme() {
  return _useColorScheme() ?? 'light';
}
