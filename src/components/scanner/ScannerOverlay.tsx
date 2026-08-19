'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScannerOverlayProps {
  status?: 'idle' | 'scanning' | 'success' | 'error';
  statusText?: string;
}

export default function ScannerOverlay({
  status = 'scanning',
  statusText,
}: ScannerOverlayProps) {
  const isSuccess = status === 'success';
  const isError = status === 'error';

  const accentColor = isSuccess
    ? 'var(--color-success)'
    : isError
    ? 'var(--color-error)'
    : 'var(--color-accent)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      {/* Target Reticle Viewport */}
      <div
        style={{
          position: 'relative',
          width: '72%',
          aspectRatio: '1',
          maxWidth: '18rem',
          borderRadius: '1rem',
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 30px ${accentColor}25`,
        }}
      >
        {/* HUD 4-Corner Crosshairs */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            width: '1.75rem',
            height: '1.75rem',
            borderTop: `3px solid ${accentColor}`,
            borderLeft: `3px solid ${accentColor}`,
            borderTopLeftRadius: '0.5rem',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '1.75rem',
            height: '1.75rem',
            borderTop: `3px solid ${accentColor}`,
            borderRight: `3px solid ${accentColor}`,
            borderTopRightRadius: '0.5rem',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            left: '-2px',
            width: '1.75rem',
            height: '1.75rem',
            borderBottom: `3px solid ${accentColor}`,
            borderLeft: `3px solid ${accentColor}`,
            borderBottomLeftRadius: '0.5rem',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '1.75rem',
            height: '1.75rem',
            borderBottom: `3px solid ${accentColor}`,
            borderRight: `3px solid ${accentColor}`,
            borderBottomRightRadius: '0.5rem',
          }}
        />

        {/* Center Targeting Dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: accentColor,
            opacity: 0.6,
          }}
        />

        {/* Animated Laser Sweep Line */}
        {status === 'scanning' && (
          <motion.div
            style={{
              position: 'absolute',
              left: '4%',
              right: '4%',
              height: '2.5px',
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              boxShadow: `0 0 15px ${accentColor}`,
              borderRadius: '2px',
            }}
            animate={{
              top: ['8%', '88%', '8%'],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* HUD Status Badge */}
      {statusText && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.25rem',
            padding: '0.375rem 0.875rem',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${accentColor}60`,
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
          }}
        >
          {statusText}
        </motion.div>
      )}
    </div>
  );
}
