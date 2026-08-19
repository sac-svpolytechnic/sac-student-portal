'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  Compass, Plus, Archive, ArchiveRestore, Sparkles,
  CheckCircle2, AlertCircle, X, Loader2
} from 'lucide-react';
import type { Club } from '@/lib/types';
import { SEED_CLUBS } from '@/lib/seed';

export default function SuperAdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Computer Engineering, IT');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadClubs() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/clubs');
        const data = await res.json();
        if (!isCancelled) {
          setClubs(data.clubs || SEED_CLUBS);
        }
      } catch (err) {
        console.error('Error loading clubs:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadClubs();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      const branch_tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      const res = await fetch('/api/admin/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, branch_tags }),
      });

      const data = await res.json();

      if (data.club) {
        setClubs((prev) => [data.club, ...prev]);
        setShowModal(false);
        setName('');
        setDescription('');
        setToast({ text: `Club "${name}" registered successfully!`, type: 'success' });
      }
    } catch {
      setToast({ text: 'Failed to register club.', type: 'error' });
    } finally {
      setCreating(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleToggleStatus = async (clubId: string, currentStatus: 'ACTIVE' | 'ARCHIVED') => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';

    try {
      const res = await fetch('/api/admin/clubs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: clubId, status: nextStatus }),
      });

      if (res.ok) {
        setClubs((prev) =>
          prev.map((c) => (c.id === clubId ? { ...c, status: nextStatus } : c))
        );
        setToast({
          text: `Club marked as ${nextStatus.toLowerCase()}.`,
          type: 'success',
        });
      }
    } catch {
      setToast({ text: 'Failed to update club status.', type: 'error' });
    } finally {
      setTimeout(() => setToast(null), 3500);
    }
  };

  const filteredClubs = clubs.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Compass size={22} style={{ color: 'var(--color-accent)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Global Clubs Management
              </h1>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Charter new student organizations, manage status, and oversee club leads.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', gap: '0.375rem' }}
          >
            <Plus size={16} />
            Register New Club
          </button>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-glass)',
                background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`,
                color: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{toast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {(['ALL', 'ACTIVE', 'ARCHIVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: filter === s ? 'var(--color-accent)' : 'var(--color-border)',
                background: filter === s ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                color: filter === s ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: filter === s ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Clubs Table / List */}
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredClubs.map((club) => (
              <GlassCard key={club.id} padding="md">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        background: 'var(--color-accent-muted)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-accent)',
                        flexShrink: 0,
                      }}
                    >
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                          {club.name}
                        </h3>
                        <span
                          className={`badge ${club.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}
                          style={{ fontSize: '0.625rem' }}
                        >
                          {club.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                        {club.description}
                      </p>

                      {/* Branch Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                        {club.branch_tags?.map((t) => (
                          <span
                            key={t}
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-pill)',
                              background: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.625rem',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggleStatus(club.id, club.status)}
                      className="btn btn-ghost"
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        gap: '0.375rem',
                        color: club.status === 'ACTIVE' ? 'var(--color-warning)' : 'var(--color-success)',
                      }}
                    >
                      {club.status === 'ACTIVE' ? <Archive size={14} /> : <ArchiveRestore size={14} />}
                      {club.status === 'ACTIVE' ? 'Archive' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Modal for Creating New Club */}
        <AnimatePresence>
          {showModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                padding: '1rem',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass"
                style={{
                  width: '100%',
                  maxWidth: '30rem',
                  padding: '1.5rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Register New Club</h3>
                  <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateClub} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="label" htmlFor="club-name">Club Name</label>
                    <input
                      id="club-name"
                      type="text"
                      className="input"
                      placeholder="e.g. AI & Machine Learning Guild"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="club-desc">Description</label>
                    <textarea
                      id="club-desc"
                      className="input"
                      rows={3}
                      placeholder="Mission statement, activities, and goals..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: 'none' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="club-tags">Eligible Branch Tags (comma separated)</label>
                    <input
                      id="club-tags"
                      type="text"
                      className="input"
                      placeholder="Computer Engineering, IT, All Branches"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                      Cancel
                    </button>
                    <button type="submit" disabled={creating} className="btn btn-primary">
                      {creating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Register Club'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
