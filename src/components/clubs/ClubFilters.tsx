'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface ClubFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  tags: string[];
}

export default function ClubFilters({
  search,
  onSearchChange,
  selectedTag,
  onSelectTag,
  tags,
}: ClubFiltersProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
      {/* Search Input with Clear Button */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
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
          placeholder="Search clubs by name, keywords, or branch..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            paddingLeft: '2.5rem',
            paddingRight: search ? '2.5rem' : '1rem',
          }}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Tag Filters with Active Indicator */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
        }}
      >
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <motion.button
              key={tag}
              onClick={() => onSelectTag(tag)}
              style={{
                position: 'relative',
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                background: isSelected ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'all 200ms ease',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
