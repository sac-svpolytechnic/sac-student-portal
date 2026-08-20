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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', marginTop: '0.25rem' }}>
        {themes.map((t) => {
          const isSelected = theme === t.id;
          const bgMap: Record<string, string> = {
            midnight: 'linear-gradient(135deg, #0a0b10 0%, #14151f 100%)',
            lumina: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            emerald: 'linear-gradient(135deg, #0f1a1a 0%, #142828 100%)',
            amber: 'linear-gradient(135deg, #1a1510 0%, #292018 100%)',
          };
          const textColorMap: Record<string, string> = {
            midnight: '#f8fafc',
            lumina: '#0f172a',
            emerald: '#f1f5f9',
            amber: '#fffbeb',
          };

          return (
            <motion.button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                padding: '1rem',
                borderRadius: '1rem',
                border: isSelected
                  ? `2px solid ${t.accent}`
                  : '2px solid var(--color-border)',
                background: bgMap[t.id] || 'var(--color-surface)',
                color: textColorMap[t.id] || 'var(--color-text)',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isSelected ? `0 8px 24px rgba(0,0,0,0.15), 0 0 16px ${t.accent}20` : 'none',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Top info row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{t.name}</span>
                <div
                  style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    borderRadius: '50%',
                    background: t.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 8px ${t.accent}50`,
                  }}
                >
                  {isSelected && <Check size={8} color="#ffffff" strokeWidth={3} />}
                </div>
              </div>

              {/* Decorative Mock Dashboard Element */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0.65 }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ height: '6px', width: '40%', borderRadius: '3px', background: t.accent }} />
                  <div style={{ height: '6px', width: '20%', borderRadius: '3px', background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(128,128,128,0.25)' }} />
                </div>
                <div style={{ height: '6px', width: '70%', borderRadius: '3px', background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(128,128,128,0.15)' }} />
              </div>
            </motion.button>
          );
        })}
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
