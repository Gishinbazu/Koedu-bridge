// theme/AppTheme.js — single source of truth for colors, mode & scheme
// Usage:
// 1) Wrap your app with <ThemeProvider> (e.g., in app/_layout.js or app/index.js)
// 2) Inside components: const { theme, isDarkMode, scheme, toggleTheme, setScheme } = useAppTheme();

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/** ---------- THEME PRESETS (edit here) ---------- **/
export const SCHEMES = {
  royal: {
    light: {
      top: '#f7f9ff', mid: '#eef3fb', bottom: '#eaf0f9',
      surface: '#ffffff', surfaceAlt: 'rgba(255,255,255,0.85)',
      stroke: '#e5e7eb', text: '#0b2a4a', subText: '#475569',
      primary: '#0b3b79', brand: '#0b3b79', brandText: '#ffffff',
      chipBg: '#f8fafc', chipText: '#0b2a4a',
      overlay: 'rgba(2, 6, 23, 0.45)', // for modals/sidebars
      blurTint: 'dark', // BlurView tint fallback
    },
    dark: {
      top: '#0a0a0a', mid: '#111111', bottom: '#171717',
      surface: '#121212', surfaceAlt: 'rgba(20,20,20,0.78)',
      stroke: '#262626', text: '#e5e7eb', subText: '#cbd5e1',
      primary: '#8ab4ff', brand: '#3b82f6', brandText: '#0b1020',
      chipBg: '#1f2937', chipText: '#e2e8f0',
      overlay: 'rgba(2, 6, 23, 0.55)',
      blurTint: 'dark',
    },
  },
  emerald: {
    light: {
      top: '#f3fbf8', mid: '#e7f7f0', bottom: '#dcf2ea',
      surface: '#ffffff', surfaceAlt: 'rgba(255,255,255,0.9)',
      stroke: '#e5e7eb', text: '#064e3b', subText: '#0f766e',
      primary: '#065f46', brand: '#059669', brandText: '#ffffff',
      chipBg: '#ecfdf5', chipText: '#064e3b',
      overlay: 'rgba(3, 29, 23, 0.50)',
      blurTint: 'dark',
    },
    dark: {
      top: '#031d17', mid: '#07261f', bottom: '#0b2f27',
      surface: '#112420', surfaceAlt: 'rgba(15,40,34,0.82)',
      stroke: '#153a32', text: '#def7ee', subText: '#a7f3d0',
      primary: '#34d399', brand: '#10b981', brandText: '#04221a',
      chipBg: '#12352d', chipText: '#d1fae5',
      overlay: 'rgba(1, 17, 15, 0.55)',
      blurTint: 'dark',
    },
  },
  terracotta: {
    light: {
      top: '#fff7f3', mid: '#fdeee8', bottom: '#fde5db',
      surface: '#ffffff', surfaceAlt: 'rgba(255,255,255,0.9)',
      stroke: '#f3d5c8', text: '#3b1810', subText: '#7c2d12',
      primary: '#7c2d12', brand: '#ea580c', brandText: '#ffffff',
      chipBg: '#fff1e7', chipText: '#7c2d12',
      overlay: 'rgba(26, 14, 10, 0.50)',
      blurTint: 'dark',
    },
    dark: {
      top: '#1a0e0a', mid: '#220f0a', bottom: '#2a110a',
      surface: '#1b130f', surfaceAlt: 'rgba(27,19,15,0.82)',
      stroke: '#3b241a', text: '#ffe5d6', subText: '#fec9a3',
      primary: '#ff8a4c', brand: '#fb923c', brandText: '#2a110a',
      chipBg: '#2b1a12', chipText: '#ffd6bd',
      overlay: 'rgba(26, 14, 10, 0.58)',
      blurTint: 'dark',
    },
  },
};

export function getTheme(isDark, scheme) {
  const s = SCHEMES[scheme] || SCHEMES.royal;
  return isDark ? s.dark : s.light;
}

const ThemeCtx = createContext(null);

export function ThemeProvider({ children, defaultScheme = 'royal', defaultDark = false }) {
  const [isDarkMode, setIsDarkMode] = useState(defaultDark);
  const [scheme, setScheme] = useState(defaultScheme);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedScheme = await AsyncStorage.getItem('scheme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
        if (savedScheme && SCHEMES[savedScheme]) setScheme(savedScheme);
      } catch {}
    })();
  }, []);

  const theme = useMemo(() => getTheme(isDarkMode, scheme), [isDarkMode, scheme]);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try { await AsyncStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  const setSchemePersist = async (name) => {
    setScheme(name);
    try { await AsyncStorage.setItem('scheme', name); } catch {}
  };

  const value = useMemo(() => ({ theme, isDarkMode, scheme, toggleTheme, setScheme: setSchemePersist }), [theme, isDarkMode, scheme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useAppTheme must be used inside <ThemeProvider>');
  return ctx;
}
