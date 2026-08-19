'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ThemeId } from '@/lib/types';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: { id: ThemeId; name: string; accent: string; bg: string }[];
}

const THEMES: ThemeContextType['themes'] = [
  { id: 'midnight', name: 'Midnight Cyber', accent: '#8b5cf6', bg: '#0a0b10' },
  { id: 'lumina', name: 'Clean Lumina', accent: '#2563eb', bg: '#f8fafc' },
  { id: 'emerald', name: 'Emerald Forest', accent: '#10b981', bg: '#0f1a1a' },
  { id: 'amber', name: 'Sunset Amber', accent: '#f59e0b', bg: '#1a1510' },
];

function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'midnight';
  const stored = localStorage.getItem('sac-theme') as ThemeId | null;
  if (stored && THEMES.some((t) => t.id === stored)) {
    return stored;
  }
  return 'midnight';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer reads from localStorage once on mount — no effect needed
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('sac-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
