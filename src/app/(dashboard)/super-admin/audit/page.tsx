'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { ScrollText } from 'lucide-react';

export default function SuperAdminAuditPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Audit Logs
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Complete action history across all admins
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          {['All Actions', 'Club Created', 'Role Changed', 'Member Accepted', 'Session Created'].map((f) => (
            <button
              key={f}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border)',
                background: f === 'All Actions' ? 'var(--color-accent-muted)' : 'transparent',
                color: f === 'All Actions' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <ScrollText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No audit logs yet</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              All admin actions will be logged here
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
