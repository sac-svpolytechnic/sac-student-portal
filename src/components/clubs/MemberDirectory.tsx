'use client';

import React, { useState } from 'react';
import { Search, Shield, User, Award, CheckCircle2 } from 'lucide-react';
import type { ClubMember } from '@/lib/types';

interface MemberDirectoryProps {
  members: ClubMember[];
  isLead?: boolean;
}

export default function MemberDirectory({
  members,
}: MemberDirectoryProps) {
  const [query, setQuery] = useState('');

  const filtered = members.filter((m) => {
    const name = m.profiles?.name?.toLowerCase() || '';
    const roll = m.profiles?.roll_no?.toLowerCase() || '';
    const branch = m.profiles?.branch?.toLowerCase() || '';
    const q = query.toLowerCase();
    return name.includes(q) || roll.includes(q) || branch.includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Search within Directory */}
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          className="input"
          placeholder="Filter members by name, roll no, or branch..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem', fontSize: '0.8125rem', padding: '0.625rem 2.5rem' }}
        />
      </div>

      {/* Members Roster Table / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {filtered.map((member) => {
          const profile = member.profiles;
          const isClubLead = member.role === 'LEAD' || member.role === 'CO_LEAD';

          return (
            <div
              key={member.id}
              className="glass"
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '50%',
                    background: isClubLead ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                    border: `1px solid ${isClubLead ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isClubLead ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : <User size={15} />}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                    <h5
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {profile?.name || 'SAC Student'}
                    </h5>
                    {isClubLead && (
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.5625rem',
                          padding: '0.1rem 0.35rem',
                          background: 'var(--color-accent-muted)',
                        }}
                      >
                        <Shield size={10} />
                        {member.role}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.125rem',
                    }}
                  >
                    {profile?.roll_no ? `${profile.roll_no} • ` : ''}
                    {profile?.branch || 'Student'} {profile?.semester ? `(Sem ${profile.semester})` : ''}
                  </p>
                </div>
              </div>

              {/* Status / Attendance Metric */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--color-success)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      92%
                    </span>
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Attendance
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            className="glass"
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              borderRadius: 'var(--radius-glass)',
            }}
          >
            <Award size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>No members found</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {query ? 'No matching results for your search query.' : 'No accepted members in this club directory yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
