import React, { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext(null);
const key = 'bekacinema_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved;
      try { saved = localStorage.getItem(key); } catch {}
      setTheme(saved === 'dark' || saved === 'light' ? saved : media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', sync);
    const storage = event => { if (event.key === key || event.key === null) sync(); };
    window.addEventListener('storage', storage);
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', storage); };
  }, []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(key, next); } catch {}
    setTheme(next);
  };
  return <Context.Provider value={{ theme, toggle }}>{children}</Context.Provider>;
}

export const useTheme = () => useContext(Context);
