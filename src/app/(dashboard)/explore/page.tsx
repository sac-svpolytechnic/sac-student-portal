'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import ClubCard from '@/components/clubs/ClubCard';
import ClubFilters from '@/components/clubs/ClubFilters';
import { Compass, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Club, ClubMember, MemberStatus } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function ExplorePage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<(Club & { member_count?: number })[]>([]);
  const [memberships, setMemberships] = useState<Record<string, MemberStatus>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch clubs & user memberships
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch Clubs
        const clubRes = await fetch('/api/clubs');
        const clubJson = await clubRes.json();
        if (clubJson.clubs) {
          setClubs(clubJson.clubs);
        }

        // 2. Fetch Memberships for current user
        if (user) {
          const memRes = await fetch('/api/memberships');
          const memJson = await memRes.json();
          if (memJson.memberships) {
            const map: Record<string, MemberStatus> = {};
            memJson.memberships.forEach((m: ClubMember) => {
              map[m.club_id] = m.status;
            });
            setMemberships(map);
          }
        }
      } catch (err) {
        console.error('Error loading explore data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Handle "Request to Join"
  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      setToastMessage({ text: 'Please sign in to join clubs.', type: 'error' });
      return;
    }

    try {
      setJoiningClubId(clubId);
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: clubId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToastMessage({ text: data.error || 'Failed to submit join request.', type: 'error' });
      } else {
        setMemberships((prev) => ({ ...prev, [clubId]: 'PENDING' }));
        setToastMessage({ text: 'Join request submitted! Waiting for club lead approval.', type: 'success' });
      }
    } catch {
      setToastMessage({ text: 'Network error submitting join request.', type: 'error' });
    } finally {
      setJoiningClubId(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Live filter & search
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description?.toLowerCase() || '').includes(q) ||
        c.branch_tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [clubs, search]);

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Compass size={22} style={{ color: 'var(--color-accent)' }} />
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
              }}
            >
              Explore Hub
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Discover accredited SAC technical, cultural, and sports clubs.
          </p>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
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
                background:
                  toastMessage.type === 'success'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${
                  toastMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'
                }`,
                color:
                  toastMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <ClubFilters
          search={search}
          onSearchChange={setSearch}
        />

        {/* Loading State */}
        {loading ? (
          <div
            style={{
              padding: '3rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Loading active clubs...</p>
          </div>
        ) : (
          /* Responsive 3D Tilt Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
              gap: '1rem',
            }}
          >
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                membershipStatus={memberships[club.id] ?? null}
                onJoinClick={handleJoinClub}
                joining={joiningClubId === club.id}
              />
            ))}
          </div>
        )}

        {/* Empty Search Result */}
        {!loading && filteredClubs.length === 0 && (
          <div
            className="glass"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-glass)',
              color: 'var(--color-text-muted)',
            }}
          >
            <Sparkles size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              No clubs match your criteria
            </h3>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Try searching with different keywords.
            </p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
