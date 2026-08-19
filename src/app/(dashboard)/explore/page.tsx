'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Users, ArrowRight, Sparkles } from 'lucide-react';

// Placeholder club data — Phase 2 will fetch from Supabase
const SAMPLE_CLUBS = [
  { id: '1', name: 'CodeCraft Club', desc: 'Competitive programming & hackathons', members: 42, tags: ['Computer Engineering', 'IT'], color: '#8b5cf6' },
  { id: '2', name: 'Robotics Society', desc: 'Build, innovate, automate', members: 28, tags: ['Electronics', 'Mechanical'], color: '#10b981' },
  { id: '3', name: 'Design Lab', desc: 'UI/UX, graphic design, branding', members: 35, tags: ['All Branches'], color: '#f59e0b' },
  { id: '4', name: 'Literary Circle', desc: 'Debates, poetry, creative writing', members: 22, tags: ['All Branches'], color: '#ef4444' },
  { id: '5', name: 'Sports Committee', desc: 'Inter-college tournaments & fitness', members: 56, tags: ['All Branches'], color: '#3b82f6' },
  { id: '6', name: 'Eco Warriors', desc: 'Sustainability & green campus', members: 18, tags: ['Civil', 'Chemical'], color: '#06b6d4' },
];

const ALL_TAGS = ['All', 'Computer Engineering', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'All Branches'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = SAMPLE_CLUBS.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.desc.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === 'All' || club.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Explore Clubs
          </h1>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginTop: '0.25rem',
          }}>
            Discover and join student clubs
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            className="input"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Tag Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.25rem',
          scrollbarWidth: 'none',
        }}>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: activeTag === tag ? 'var(--color-accent)' : 'var(--color-border)',
                background: activeTag === tag ? 'var(--color-accent-muted)' : 'transparent',
                color: activeTag === tag ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)',
                transition: 'all 150ms ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Club Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))',
          gap: '0.75rem',
        }}>
          {filtered.map((club, i) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ perspective: '800px' }}
            >
              <GlassCard hover>
                {/* 3D Tilt effect wrapper */}
                <div
                  style={{
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)';
                  }}
                >
                  {/* Club icon */}
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    background: `${club.color}20`,
                    border: `1px solid ${club.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}>
                    <Sparkles size={18} style={{ color: club.color }} />
                  </div>

                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '0.25rem',
                  }}>
                    {club.name}
                  </h3>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}>
                    {club.desc}
                  </p>

                  {/* Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.375rem',
                    marginBottom: '0.75rem',
                  }}>
                    {club.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: 'var(--radius-pill)',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                    }}>
                      <Users size={14} />
                      <span>{club.members} members</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        gap: '0.25rem',
                      }}
                    >
                      Join
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <GlassCard>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--color-text-muted)',
            }}>
              <Search size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>No clubs found</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Try a different search or filter
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </AnimatedPage>
  );
}
