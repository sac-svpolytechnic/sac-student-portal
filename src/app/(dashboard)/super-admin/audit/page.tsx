'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  ScrollText, Shield, ChevronDown, ChevronUp,
  Clock, Code, Loader2
} from 'lucide-react';
import type { AuditEntry } from '@/lib/seed-admin';
import { SEED_AUDIT_LOGS } from '@/lib/seed-admin';

const ACTION_FILTERS = [
  'ALL',
  'CREATE_CLUB',
  'ELEVATE_ROLE',
  'ACCEPT_MEMBER',
  'CREATE_SESSION',
  'ARCHIVE_CLUB',
];

export default function SuperAdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadLogs() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/audit?action=${filter}`);
        const data = await res.json();
        if (!isCancelled) {
          setLogs(data.logs || SEED_AUDIT_LOGS);
        }
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadLogs();

    return () => {
      isCancelled = true;
    };
  }, [filter]);

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ScrollText size={22} style={{ color: 'var(--color-accent)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              System Audit Logs
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Immutable chronological ledger of all administrative security and governance actions.
          </p>
        </div>

        {/* Action Type Filter Chips */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            marginBottom: '1.25rem',
          }}
        >
          {ACTION_FILTERS.map((a) => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: filter === a ? 'var(--color-accent)' : 'var(--color-border)',
                background: filter === a ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                color: filter === a ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: filter === a ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {a === 'ALL' ? 'All Actions' : a}
            </button>
          ))}
        </div>

        {/* Audit Timeline */}
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.map((entry) => {
              const isExpanded = expandedId === entry.id;

              return (
                <GlassCard key={entry.id} padding="md">
                  <div>
                    {/* Top Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.5rem',
                            background: 'var(--color-accent-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-accent)',
                            flexShrink: 0,
                            marginTop: '0.125rem',
                          }}
                        >
                          <Shield size={16} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span className="badge" style={{ fontSize: '0.625rem' }}>
                              {entry.action}
                            </span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                              {entry.target_name}
                            </span>
                          </div>

                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                            Executed by <strong>{entry.actor_name}</strong> ({entry.actor_email})
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                          <Clock size={12} />
                          <span>{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expandable JSON Metadata Inspector */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                            <Code size={13} style={{ color: 'var(--color-accent)' }} />
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                              Event Metadata Payload
                            </span>
                          </div>
                          <pre
                            style={{
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              background: '#0a0b10',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.6875rem',
                              color: '#10b981',
                              overflowX: 'auto',
                              fontFamily: 'monospace',
                            }}
                          >
                            {JSON.stringify(entry.metadata, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
