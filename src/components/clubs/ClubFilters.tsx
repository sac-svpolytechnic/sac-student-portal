'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface ClubFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export default function ClubFilters({
  search,
  onSearchChange,
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
          placeholder="Search clubs by name, keywords..."
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
    </div>
  );
}
