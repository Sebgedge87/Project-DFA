import { useState, useEffect } from 'react';

export type Theme = 'arena' | 'battlefield' | 'classic';

const STORAGE_KEY = 'dfa-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'arena',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme: setThemeState };
}
