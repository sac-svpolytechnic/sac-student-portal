'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { Users, Search } from 'lucide-react';

export default function SuperAdminUsersPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            User Registry
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Manage users, roles, and accounts
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            className="input"
            placeholder="Search users by name, email, or roll number..."
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <GlassCard>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-muted)',
          }}>
            <Users size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No users found</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Registered users will appear here
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
