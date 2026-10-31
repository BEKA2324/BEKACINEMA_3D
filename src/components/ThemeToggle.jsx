import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const label = dark ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish';
  return <button type="button" onClick={toggle} aria-label={label} title={label} aria-pressed={dark} className="theme-toggle shrink-0 w-9 h-9 grid place-items-center rounded-full border border-slate-200 bg-white/70 text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-amber-300 hover:ring-4 hover:ring-indigo-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500">
    {dark ? <Sun size={18} /> : <Moon size={18} />}
  </button>;
}
