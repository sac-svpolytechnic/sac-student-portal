'use client';

import React from 'react';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import { ScanLine, MapPin, Wifi } from 'lucide-react';

export default function ScanPage() {
  return (
    <AnimatedPage>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            QR Scanner
          </h1>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginTop: '0.25rem',
          }}>
            Scan the session QR code to mark attendance
          </p>
        </div>

        {/* Scanner placeholder — Phase 3 will add the actual html5-qrcode scanner */}
        <GlassCard>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1',
              borderRadius: '0.75rem',
              background: 'var(--color-bg-secondary)',
              border: '2px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Scanner overlay decoration */}
            <div className="scanner-line" />

            {/* Corner brackets */}
            {[
              { top: '8%', left: '8%', borderTop: '3px solid var(--color-accent)', borderLeft: '3px solid var(--color-accent)' },
              { top: '8%', right: '8%', borderTop: '3px solid var(--color-accent)', borderRight: '3px solid var(--color-accent)' },
              { bottom: '8%', left: '8%', borderBottom: '3px solid var(--color-accent)', borderLeft: '3px solid var(--color-accent)' },
              { bottom: '8%', right: '8%', borderBottom: '3px solid var(--color-accent)', borderRight: '3px solid var(--color-accent)' },
            ].map((style, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.25rem',
                  ...style,
                }}
              />
            ))}

            <ScanLine size={48} style={{ color: 'var(--color-accent)', opacity: 0.6, marginBottom: '1rem' }} />
            <p style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}>
              Camera will activate here
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
            }}>
              QR Scanner will be enabled in Phase 3
            </p>
          </div>
        </GlassCard>

        {/* Info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginTop: '1rem',
        }}>
          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Geofence
              </span>
            </div>
            <p style={{
              fontSize: '0.6875rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
            }}>
              Location verified
            </p>
          </GlassCard>
          <GlassCard padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={16} style={{ color: 'var(--color-info)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Connection
              </span>
            </div>
            <p style={{
              fontSize: '0.6875rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.25rem',
            }}>
              Ready to scan
            </p>
          </GlassCard>
        </div>
      </div>
    </AnimatedPage>
  );
}
