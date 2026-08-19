'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'inline';
}

export default function ThemeSwitcher({ variant = 'inline' }: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = React.useState(false);

  if (variant === 'inline') {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {themes.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: 'var(--radius-glass)',
              border: theme === t.id
                ? `2px solid ${t.accent}`
                : '2px solid var(--color-border)',
              background: theme === t.id
                ? `${t.accent}15`
                : 'var(--color-surface)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'all 200ms ease',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: t.accent,
                border: '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
              }}
            />
            <span>{t.name}</span>
            {theme === t.id && (
              <Check size={14} style={{ color: t.accent }} />
            )}
          </motion.button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.5rem',
          borderRadius: 'var(--radius-glass)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette size={18} />
      </motion.button>

      {open && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
            }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="glass"
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 0.5rem)',
              zIndex: 50,
              minWidth: '12rem',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: theme === t.id ? 'var(--color-accent-muted)' : 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (theme !== t.id) {
                    e.currentTarget.style.background = 'var(--color-surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== t.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span
                  style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    borderRadius: '50%',
                    background: t.accent,
                    border: '2px solid rgba(255,255,255,0.15)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1 }}>{t.name}</span>
                {theme === t.id && <Check size={14} style={{ color: t.accent }} />}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
