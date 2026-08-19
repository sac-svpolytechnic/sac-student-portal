'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import {
  User, Mail, Phone, BookOpen, GraduationCap,
  Hash, Shield, LogOut, Loader2
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, role, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
  };

  const fields = [
    { icon: <User size={16} />, label: 'Name', value: profile?.name || '—' },
    { icon: <Mail size={16} />, label: 'Email', value: profile?.email || '—' },
    { icon: <Hash size={16} />, label: 'Roll No', value: profile?.roll_no || '—' },
    { icon: <Phone size={16} />, label: 'Contact', value: profile?.contact_number || '—' },
    { icon: <BookOpen size={16} />, label: 'Branch', value: profile?.branch || '—' },
    { icon: <GraduationCap size={16} />, label: 'Semester', value: profile?.semester ? `Semester ${profile.semester}` : '—' },
  ];

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.75rem',
              boxShadow: 'var(--glow-accent)',
            }}
          >
            {profile?.name?.charAt(0)?.toUpperCase() || 'S'}
          </motion.div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            {profile?.name || 'Student'}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
            <span className="badge">
              <Shield size={10} />
              {role}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <GlassCard>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <h2 style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-text)',
            }}>
              Personal Information
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {fields.map((field) => (
              <div key={field.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{ color: 'var(--color-accent)', flexShrink: 0 }}>
                  {field.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    {field.label}
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginTop: '0.125rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Theme Selection */}
        <div style={{ marginTop: '1.25rem' }}>
          <h2 style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}>
            Appearance
          </h2>
          <GlassCard>
            <ThemeSwitcher variant="inline" />
          </GlassCard>
        </div>

        {/* Sign Out */}
        <motion.button
          className="btn btn-ghost"
          onClick={handleSignOut}
          disabled={loggingOut}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.75rem',
            color: 'var(--color-error)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loggingOut ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <LogOut size={18} />
              Sign Out
            </>
          )}
        </motion.button>
      </div>
    </AnimatedPage>
  );
}
