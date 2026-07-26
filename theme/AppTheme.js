// theme/AppTheme.js — simple app-wide theming (light/dark + tokens)

import { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const LIGHT = {
  top: '#f7f9ff',
  mid: '#eef3fb',
  bottom: '#eaf0f9',
  overlay: 'rgba(15,23,42,0.55)',
  blurTint: 'light',
  surface: '#f9fafb',
  surfaceAlt: 'rgba(255,255,255,0.96)',
  stroke: 'rgba(15,23,42,0.08)',
  text: '#0f172a',
  subText: '#64748b',
  primary: '#2563eb',
};

const DARK = {
  top: '#020617',
  mid: '#020617',
  bottom: '#020617',
  overlay: 'rgba(15,23,42,0.8)',
  blurTint: 'dark',
  surface: '#020617',
  surfaceAlt: 'rgba(15,23,42,0.96)',
  stroke: 'rgba(148,163,184,0.28)',
  text: '#e5e7eb',
  subText: '#9ca3af',
  primary: '#38bdf8',
};

export function ThemeProvider({ children, defaultDark = false }) {
  const [isDarkMode, setIsDarkMode] = useState(defaultDark);

  const value = useMemo(() => {
    const tokens = isDarkMode ? DARK : LIGHT;
    return {
      isDarkMode,
      toggleTheme: () => setIsDarkMode((v) => !v),
      theme: tokens,
    };
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
