'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/navigation/BottomNav';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader2
          size={32}
          style={{
            color: 'var(--color-accent)',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', position: 'relative' }}>
      {/* Background mesh */}
      <div className="bg-mesh" />

      {/* Top bar with theme switcher */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'var(--nav-bg)',
          backdropFilter: `blur(var(--nav-blur))`,
          WebkitBackdropFilter: `blur(var(--nav-blur))`,
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              color: '#ffffff',
            }}
          >
            SAC
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            letterSpacing: '-0.01em',
            color: 'var(--color-text)',
          }}>
            Student Portal
          </span>
        </div>
        <ThemeSwitcher variant="dropdown" />
      </header>

      {/* Page content */}
      <main className="pb-safe" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
