'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import MemberDirectory from '@/components/clubs/MemberDirectory';
import {
  ArrowLeft, Users, Calendar, Sparkles, CheckCircle2,
  Clock, Shield, Award, Loader2, AlertCircle
} from 'lucide-react';
import type { Club, ClubMember, MemberStatus } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { SEED_CLUBS } from '@/lib/seed';

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const clubId = params.clubId as string;

  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [userMembership, setUserMembership] = useState<MemberStatus | null>(null);
  const [userRoleInClub, setUserRoleInClub] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'roster' | 'sessions'>('about');

  useEffect(() => {
    async function loadClubDetails() {
      try {
        setLoading(true);
        // Find club in seed or database
        const seedMatch = SEED_CLUBS.find((c) => c.id === clubId);
        if (seedMatch) {
          setClub(seedMatch as unknown as Club);
        } else {
          const res = await fetch('/api/clubs');
          const json = await res.json();
          const found = json.clubs?.find((c: Club) => c.id === clubId);
          if (found) setClub(found);
        }

        // Fetch club members
        const memRes = await fetch(`/api/memberships?club_id=${clubId}`);
        const memJson = await memRes.json();
        if (memJson.members) {
          const accepted = memJson.members.filter((m: ClubMember) => m.status === 'ACCEPTED');
          setMembers(accepted);

          // Check current user status
          if (user) {
            const myMem = memJson.members.find((m: ClubMember) => m.user_id === user.id);
            if (myMem) {
              setUserMembership(myMem.status);
              setUserRoleInClub(myMem.role);
            }
          }
        }
      } catch (err) {
        console.error('Error loading club detail:', err);
      } finally {
        setLoading(false);
      }
    }

    if (clubId) loadClubDetails();
  }, [clubId, user]);

  const handleJoin = async () => {
    if (!user) {
      setToast({ text: 'Please sign in to join clubs.', type: 'error' });
      return;
    }

    try {
      setJoining(true);
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: clubId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ text: data.error || 'Failed to submit request', type: 'error' });
      } else {
        setUserMembership('PENDING');
        setToast({ text: 'Request submitted successfully!', type: 'success' });
      }
    } catch {
      setToast({ text: 'Network error.', type: 'error' });
    } finally {
      setJoining(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Club Not Found</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          The club you are looking for does not exist or has been archived.
        </p>
        <button onClick={() => router.push('/explore')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} />
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Navigation Bar */}
        <button
          onClick={() => router.back()}
          className="btn btn-ghost"
          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', marginBottom: '1rem', gap: '0.375rem' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

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

        {/* Club Hero Banner */}
        <GlassCard style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '1rem',
                  background: 'var(--color-accent-muted)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glow-accent)',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={28} style={{ color: 'var(--color-accent)' }} />
              </div>

              <div>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  {club.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-success">
                    Active Club
                  </span>
                  {userRoleInClub && (
                    <span className="badge">
                      <Shield size={11} />
                      Your Role: {userRoleInClub}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Join / Status Button */}
            <div>
              {userMembership === 'ACCEPTED' ? (
                <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={15} />
                  Active Member
                </div>
              ) : userMembership === 'PENDING' ? (
                <div className="badge badge-warning" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                  <Clock size={15} />
                  Request Under Review
                </div>
              ) : (
                <motion.button
                  onClick={handleJoin}
                  disabled={joining}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: '0.625rem 1.25rem' }}
                >
                  {joining ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Request to Join Club'}
                </motion.button>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginTop: '1rem' }}>
            {club.description}
          </p>

          {/* Branch Tag Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1rem' }}>
            {club.branch_tags?.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>

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
            { id: 'about', label: 'Overview & Leadership', icon: <Award size={16} /> },
            { id: 'roster', label: `Members (${members.length})`, icon: <Users size={16} /> },
            { id: 'sessions', label: 'Session History', icon: <Calendar size={16} /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'about' | 'roster' | 'sessions')}
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
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <GlassCard>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Governance & Club Objectives
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                The {club.name} operates under the governance of the Student Activity Centre. It organizes regular workshops, technical hackathons, guest lectures, and attendance-verified hands-on training sessions.
              </p>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Club Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Members</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>{members.length || 24}</p>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Avg Attendance</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>88.4%</p>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Sessions Held</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-info)', marginTop: '0.25rem' }}>14</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'roster' && (
          <MemberDirectory members={members} />
        )}

        {activeTab === 'sessions' && (
          <GlassCard>
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Calendar size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Session Schedule
              </h4>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Upcoming sessions and dynamic QR attendance records will appear here.
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </AnimatedPage>
  );
}
