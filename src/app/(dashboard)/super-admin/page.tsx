'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { Shield, Users, Compass, ScrollText, TrendingUp, Activity } from 'lucide-react';

export default function SuperAdminPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Shield size={20} style={{ color: 'var(--color-accent)' }} />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}>
              SAC Console
            </h1>
          </div>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}>
            Super Admin governance dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          {[
            { icon: <Compass size={20} />, label: 'Total Clubs', value: '—', color: 'var(--color-accent)' },
            { icon: <Users size={20} />, label: 'Total Users', value: '—', color: 'var(--color-info)' },
            { icon: <Activity size={20} />, label: 'Active Sessions', value: '—', color: 'var(--color-success)' },
            { icon: <TrendingUp size={20} />, label: 'Avg Attendance', value: '—%', color: 'var(--color-warning)' },
          ].map((stat) => (
            <GlassCard key={stat.label} padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {stat.label}
                </span>
              </div>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Recent Audit */}
        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Recent Actions
        </h2>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <ScrollText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No audit logs yet</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Admin actions will be recorded here
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
