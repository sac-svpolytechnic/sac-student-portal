'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  ScanLine, Users, Calendar, TrendingUp,
  CheckCircle2, Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { profile, role } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Greeting */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}>
            {greeting()} 👋
          </p>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginTop: '0.125rem',
          }}>
            {profile?.name || 'Student'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem' }}>
            <span className="badge">
              {role}
            </span>
            {profile?.branch && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
              }}>
                {profile.branch} · Sem {profile.semester}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {role === 'MEMBER' && (
          <Link href="/home/scan" style={{ textDecoration: 'none' }}>
            <motion.div
              className="glass"
              style={{
                padding: '1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--color-accent-muted), var(--color-surface))',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-glass)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glow-accent)',
                  flexShrink: 0,
                }}
              >
                <ScanLine size={24} color="#ffffff" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                }}>
                  Scan QR Code
                </h3>
                <p style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: '0.125rem',
                }}>
                  Mark your attendance for active sessions
                </p>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Stats Grid */}
        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Overview
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          {[
            {
              icon: <Users size={20} />,
              label: 'My Clubs',
              value: '—',
              color: 'var(--color-accent)',
            },
            {
              icon: <Calendar size={20} />,
              label: 'Sessions',
              value: '—',
              color: 'var(--color-info)',
            },
            {
              icon: <CheckCircle2 size={20} />,
              label: 'Attended',
              value: '—',
              color: 'var(--color-success)',
            },
            {
              icon: <TrendingUp size={20} />,
              label: 'Avg Rate',
              value: '—%',
              color: 'var(--color-warning)',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <GlassCard padding="md">
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
                  color: 'var(--color-text)',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
        }}>
          Recent Activity
        </h2>

        <GlassCard>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
            color: 'var(--color-text-muted)',
          }}>
            <Activity size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              No recent activity
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Your attendance logs will appear here
            </p>
          </div>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
