'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Users, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { Club, MemberStatus } from '@/lib/types';

interface ClubCardProps {
  club: Club & { member_count?: number };
  membershipStatus?: MemberStatus | null;
  onJoinClick?: (clubId: string) => void;
  joining?: boolean;
}

const PALETTE = [
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Cobalt
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export default function ClubCard({
  club,
  membershipStatus,
  onJoinClick,
  joining = false,
}: ClubCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Spring Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  // Deterministic theme color from club name/id
  const colorIndex = (club.name.charCodeAt(0) + club.name.length) % PALETTE.length;
  const accentColor = PALETTE[colorIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000, height: '100%' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          height: '100%',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass"
      >
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            borderRadius: 'var(--radius-glass)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Glow on Hover */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '10rem',
              height: '10rem',
              borderRadius: '50%',
              background: accentColor,
              opacity: isHovered ? 0.2 : 0.08,
              filter: 'blur(45px)',
              pointerEvents: 'none',
              transition: 'opacity 300ms ease',
            }}
          />

          <div>
            {/* Top Row: Icon + Membership Status Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                transform: 'translateZ(20px)',
              }}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${accentColor}25`,
                }}
              >
                <Sparkles size={20} style={{ color: accentColor }} />
              </div>

              {membershipStatus === 'ACCEPTED' && (
                <span
                  className="badge badge-success"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <CheckCircle2 size={12} />
                  Member
                </span>
              )}
              {membershipStatus === 'PENDING' && (
                <span
                  className="badge badge-warning"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <Clock size={12} />
                  Pending
                </span>
              )}
            </div>

            {/* Club Title & Description */}
            <h3
              style={{
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: '0.375rem',
                transform: 'translateZ(25px)',
                letterSpacing: '-0.01em',
              }}
            >
              {club.name}
            </h3>

            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.45,
                marginBottom: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transform: 'translateZ(15px)',
              }}
            >
              {club.description || 'Student Activity Centre accredited organization.'}
            </p>

            {/* Branch / Category Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem',
                marginBottom: '1rem',
                transform: 'translateZ(15px)',
              }}
            >
              {club.branch_tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
              {(club.branch_tags?.length ?? 0) > 2 && (
                <span
                  style={{
                    padding: '0.2rem 0.4rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  +{(club.branch_tags?.length ?? 0) - 2}
                </span>
              )}
            </div>
          </div>

          {/* Footer Action Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              marginTop: '0.5rem',
              transform: 'translateZ(20px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}
            >
              <Users size={14} />
              <span>{club.member_count ?? 18} members</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {membershipStatus === 'ACCEPTED' ? (
                <Link
                  href={`/explore/${club.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    className="btn btn-ghost"
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-glass)',
                      gap: '0.25rem',
                    }}
                  >
                    View
                    <ArrowRight size={13} />
                  </button>
                </Link>
              ) : membershipStatus === 'PENDING' ? (
                <Link
                  href={`/explore/${club.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    className="btn btn-ghost"
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-glass)',
                    }}
                  >
                    Details
                  </button>
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onJoinClick) onJoinClick(club.id);
                  }}
                  disabled={joining}
                  className="btn btn-primary"
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.75rem',
                    gap: '0.25rem',
                  }}
                >
                  {joining ? 'Joining...' : 'Join'}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
