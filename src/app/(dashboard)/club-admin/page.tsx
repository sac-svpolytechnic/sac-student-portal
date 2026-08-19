'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { Users, Clock, UserCheck, Activity } from 'lucide-react';

export default function ClubAdminPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Club Management
          </h1>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginTop: '0.25rem',
          }}>
            Admin console for your club
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          {[
            { icon: <Users size={18} />, label: 'Members', value: '—', color: 'var(--color-accent)' },
            { icon: <Clock size={18} />, label: 'Pending', value: '—', color: 'var(--color-warning)' },
            { icon: <Activity size={18} />, label: 'Sessions', value: '—', color: 'var(--color-success)' },
          ].map((stat) => (
            <GlassCard key={stat.label} padding="sm">
              <div style={{ color: stat.color, marginBottom: '0.375rem' }}>
                {stat.icon}
              </div>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Sections */}
        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Pending Requests
        </h2>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <UserCheck size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No pending requests</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Join requests from members will appear here
            </p>
          </div>
        </GlassCard>

        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
        }}>
          Active Sessions
        </h2>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <Clock size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No active sessions</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Create a session to start taking attendance
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
