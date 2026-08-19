'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import MemberRequestCard from '@/components/clubs/MemberRequestCard';
import MemberDirectory from '@/components/clubs/MemberDirectory';
import {
  Users, Clock, Activity, UserCheck, Plus,
  Shield, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import type { Club, ClubMember } from '@/lib/types';
import { SEED_CLUBS } from '@/lib/seed';

export default function ClubAdminPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'members' | 'sessions'>('requests');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load clubs & initial members
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/clubs');
        const json = await res.json();
        const available = json.clubs || SEED_CLUBS;

        if (!isCancelled) {
          setClubs(available);
          const activeId = selectedClubId || (available.length > 0 ? available[0].id : '');
          if (activeId) {
            if (!selectedClubId) setSelectedClubId(activeId);
            const memRes = await fetch(`/api/memberships?club_id=${activeId}`);
            const memJson = await memRes.json();
            if (!isCancelled && memJson.members) {
              setMembers(memJson.members);
            }
          }
        }
      } catch (err) {
        console.error('Error loading club admin data:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [selectedClubId]);

  // Handle Accept
  const handleAcceptRequest = async (membershipId: string) => {
    try {
      setProcessingId(membershipId);
      const res = await fetch('/api/memberships', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membership_id: membershipId, action: 'ACCEPT' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ text: data.error || 'Failed to accept member.', type: 'error' });
      } else {
        setMembers((prev) =>
          prev.map((m) => (m.id === membershipId ? { ...m, status: 'ACCEPTED', joined_at: new Date().toISOString() } : m))
        );
        setToast({ text: 'Member accepted successfully!', type: 'success' });
      }
    } catch {
      setToast({ text: 'Network error accepting request.', type: 'error' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setToast(null), 3500);
    }
  };

  // Handle Reject
  const handleRejectRequest = async (membershipId: string) => {
    try {
      setProcessingId(membershipId);
      const res = await fetch('/api/memberships', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membership_id: membershipId, action: 'REJECT' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ text: data.error || 'Failed to reject member.', type: 'error' });
      } else {
        setMembers((prev) =>
          prev.map((m) => (m.id === membershipId ? { ...m, status: 'REJECTED' } : m))
        );
        setToast({ text: 'Membership request rejected.', type: 'success' });
      }
    } catch {
      setToast({ text: 'Network error rejecting request.', type: 'error' });
    } finally {
      setProcessingId(null);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const pendingRequests = members.filter((m) => m.status === 'PENDING');
  const acceptedMembers = members.filter((m) => m.status === 'ACCEPTED');
  const selectedClub = clubs.find((c) => c.id === selectedClubId) || clubs[0];

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip & Club Selector */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Shield size={22} style={{ color: 'var(--color-accent)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Club Management Console
              </h1>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Manage join requests, member directories, and attendance sessions.
            </p>
          </div>

          {/* Club Dropdown Selector */}
          {clubs.length > 1 && (
            <select
              className="input"
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              style={{ width: 'auto', minWidth: '14rem', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
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

        {/* Quick KPI Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <GlassCard padding="sm">
            <div style={{ color: 'var(--color-accent)', marginBottom: '0.375rem' }}>
              <Users size={18} />
            </div>
            <p style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {acceptedMembers.length || 18}
            </p>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Members
            </p>
          </GlassCard>

          <GlassCard padding="sm">
            <div style={{ color: 'var(--color-warning)', marginBottom: '0.375rem' }}>
              <Clock size={18} />
            </div>
            <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-warning)', letterSpacing: '-0.02em' }}>
              {pendingRequests.length}
            </p>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Pending
            </p>
          </GlassCard>

          <GlassCard padding="sm">
            <div style={{ color: 'var(--color-success)', marginBottom: '0.375rem' }}>
              <Activity size={18} />
            </div>
            <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
              1
            </p>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Live Sessions
            </p>
          </GlassCard>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '1.25rem',
            gap: '0.5rem',
          }}
        >
          {[
            { id: 'requests', label: `Pending Requests (${pendingRequests.length})`, icon: <UserCheck size={16} /> },
            { id: 'members', label: `Member Roster (${acceptedMembers.length || 18})`, icon: <Users size={16} /> },
            { id: 'sessions', label: 'Sessions & QR', icon: <Activity size={16} /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'requests' | 'members' | 'sessions')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.625rem 1rem',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                  background: 'transparent',
                  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontSize: '0.8125rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 150ms ease',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
          </div>
        ) : (
          <>
            {/* 1. Pending Join Requests */}
            {activeTab === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pendingRequests.map((req) => (
                  <MemberRequestCard
                    key={req.id}
                    member={req}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    isProcessing={processingId === req.id}
                  />
                ))}

                {pendingRequests.length === 0 && (
                  <div
                    className="glass"
                    style={{
                      padding: '3rem 1.5rem',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-glass)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <UserCheck size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      No pending membership requests
                    </h3>
                    <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                      When students request to join {selectedClub?.name || 'your club'}, their applications will appear here for one-click approval.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Members Directory */}
            {activeTab === 'members' && (
              <MemberDirectory members={acceptedMembers.length > 0 ? acceptedMembers : []} isLead={true} />
            )}

            {/* 3. Sessions & QR Launcher (Bridge to Phase 3) */}
            {activeTab === 'sessions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Club Attendance Sessions</h3>
                  <Link href="/club-admin/session/new" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', gap: '0.375rem' }}>
                      <Plus size={16} />
                      Launch New Session
                    </button>
                  </Link>
                </div>

                <GlassCard>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-success">
                          <Activity size={12} />
                          Active Now
                        </span>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                          Weekly Tech Talk & Hands-on Lab
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                        Anchor: Lab 402 (Radius: 100m) • Rotating QR Active
                      </p>
                    </div>

                    <Link href={`/club-admin/session/demo-session/broadcast`} style={{ textDecoration: 'none' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.4rem 0.875rem', fontSize: '0.75rem' }}>
                        Open QR Broadcaster
                      </button>
                    </Link>
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  );
}
