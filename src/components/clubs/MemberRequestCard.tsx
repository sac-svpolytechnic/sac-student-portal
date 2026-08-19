'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Check, X, BookOpen, GraduationCap, Hash, Loader2 } from 'lucide-react';
import type { ClubMember } from '@/lib/types';

interface MemberRequestCardProps {
  member: ClubMember;
  onAccept: (membershipId: string) => Promise<void>;
  onReject: (membershipId: string) => Promise<void>;
  isProcessing?: boolean;
}

export default function MemberRequestCard({
  member,
  onAccept,
  onReject,
  isProcessing = false,
}: MemberRequestCardProps) {
  const profile = member.profiles;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass"
      style={{
        padding: '1rem',
        borderRadius: 'var(--radius-glass)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: 'var(--color-accent-muted)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              flexShrink: 0,
            }}
          >
            {profile?.name ? profile.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {profile?.name || 'Student Applicant'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {profile?.email || 'No email specified'}
            </p>
          </div>
        </div>

        <span className="badge badge-warning" style={{ fontSize: '0.625rem' }}>
          Pending
        </span>
      </div>

      {/* Metadata Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(6rem, 1fr))',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Hash size={13} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {profile?.roll_no || 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <BookOpen size={13} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {profile?.branch || 'General'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <GraduationCap size={13} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Sem {profile?.semester || 1}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
        <button
          onClick={() => onReject(member.id)}
          disabled={isProcessing}
          className="btn btn-ghost"
          style={{
            padding: '0.4rem 0.875rem',
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            borderColor: 'rgba(239,68,68,0.2)',
          }}
        >
          <X size={14} />
          Reject
        </button>
        <button
          onClick={() => onAccept(member.id)}
          disabled={isProcessing}
          className="btn btn-primary"
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.75rem',
            background: 'var(--color-success)',
            borderColor: 'var(--color-success)',
          }}
        >
          {isProcessing ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <Check size={14} />
              Accept Member
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
