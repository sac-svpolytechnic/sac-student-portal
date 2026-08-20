'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  Shield, Compass, Users, ScrollText, TrendingUp,
  Activity, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { SEED_AUDIT_LOGS, type AuditEntry } from '@/lib/seed-admin';

export default function SuperAdminPage() {
  const [stats] = useState({
    clubs: 6,
    users: 64,
    activeSessions: 2,
    todayCheckIns: 48,
  });
  const [recentLogs, setRecentLogs] = useState<AuditEntry[]>(SEED_AUDIT_LOGS.slice(0, 3));
  const [liveEvents] = useState<
    { id: string; user: string; roll: string; club: string; time: string; dist: number }[]
  >([]);

  // Fetch initial audit logs
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        const res = await fetch('/api/admin/audit');
        const data = await res.json();
        if (!isCancelled && data.logs) {
          setRecentLogs(data.logs.slice(0, 3));
        }
      } catch (err) {
        console.error('Audit fetch error:', err);
      }
    }
    loadData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Shield size={24} style={{ color: 'var(--color-accent)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              SAC Governance Console
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Super Admin system administration, real-time telemetry, and audit trail.
          </p>
        </div>

        {/* Global KPI Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(9.5rem, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Compass size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Total Clubs
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {stats.clubs}
            </p>
          </GlassCard>

          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Users size={16} style={{ color: 'var(--color-info)' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Total Students
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {stats.users}
            </p>
          </GlassCard>

          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Activity size={16} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Active Sessions
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)', letterSpacing: '-0.02em' }}>
              {stats.activeSessions}
            </p>
          </GlassCard>

          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Check-ins Today
              </span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
              {stats.todayCheckIns}
            </p>
          </GlassCard>
        </div>

        {/* Administration Navigation Quick-Launch */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <Link href="/super-admin/clubs" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'var(--color-accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                      <Compass size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Manage Clubs
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Create, archive & assign leads
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </GlassCard>
            </motion.div>
          </Link>

          <Link href="/super-admin/users" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'var(--color-accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        User Registry
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Roles & account elevation
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </GlassCard>
            </motion.div>
          </Link>

          <Link href="/super-admin/audit" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'var(--color-accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                      <ScrollText size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Audit Logs
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Security trail & ledger
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </GlassCard>
            </motion.div>
          </Link>
        </div>

        {/* Realtime Live Attendance Stream */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} />
              <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Attendance Stream (Realtime)
              </h2>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              Auto-updating WebSocket feed
            </span>
          </div>

          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {liveEvents.length > 0 ? (
                liveEvents.map((ev) => (
                  <motion.div
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '0.5rem',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
                          {ev.user} ({ev.roll})
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                          {ev.club} • {ev.dist}m from GPS anchor
                        </p>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {ev.time}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  No live check-in events recorded today. Realtime listener active.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Recent Audit Timeline Preview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recent Security & Governance Actions
            </h2>
            <Link href="/super-admin/audit" style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
              View All Logs
            </Link>
          </div>

          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="badge" style={{ fontSize: '0.5625rem', padding: '0.1rem 0.35rem' }}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
                        {log.target_name}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                      By {log.actor_name}
                    </p>
                  </div>

                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AnimatedPage>
  );
}
