'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { Compass, Plus } from 'lucide-react';

export default function SuperAdminClubsPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Global Clubs
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Create, manage, and archive clubs
            </p>
          </div>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
            <Plus size={16} />
            New Club
          </button>
        </div>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <Compass size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No clubs created yet</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Create your first club to get started
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
