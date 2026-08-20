'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserPlus, Mail, KeyRound, User, Phone, BookOpen,
  GraduationCap, Hash, Eye, EyeOff, Loader2, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DIPLOMA_BRANCHES, DIPLOMA_SEMESTERS } from '@/lib/branches';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    contactNumber: '',
    branch: '',
    semester: 1,
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const result = await signUp({
      email: form.email,
      password: form.password,
      name: form.name,
      rollNo: form.rollNo,
      contactNumber: form.contactNumber,
      branch: form.branch,
      semester: form.semester,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Automatically log in the user
      await signIn({ email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => router.push('/home'), 2000);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <CheckCircle2
            size={48}
            style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }}
          />
        </motion.div>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: '0.5rem',
        }}>
          Account Created!
        </h2>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Check your email to verify your account, then sign in.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '1rem',
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--glow-accent)',
          }}
        >
          <UserPlus size={28} color="#ffffff" />
        </motion.div>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}>
          Create Account
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          marginTop: '0.25rem',
        }}>
          Join the SAC Student Portal
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Name */}
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="reg-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Roll Number */}
          <div>
            <label className="label" htmlFor="reg-rollno">Roll Number</label>
            <div style={{ position: 'relative' }}>
              <Hash size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="reg-rollno"
                type="text"
                className="input"
                placeholder="e.g., 2024CE001"
                value={form.rollNo}
                onChange={(e) => updateField('rollNo', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="label" htmlFor="contact">Contact Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="contact"
                type="tel"
                className="input"
                placeholder="+91 9876543210"
                value={form.contactNumber}
                onChange={(e) => updateField('contactNumber', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Branch & Semester Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label" htmlFor="branch">Branch</label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <select
                  id="branch"
                  className="input"
                  value={form.branch}
                  onChange={(e) => updateField('branch', e.target.value)}
                  style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                  required
                >
                  <option value="">Select Branch</option>
                  {DIPLOMA_BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="semester">Semester</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <select
                  id="semester"
                  className="input"
                  value={form.semester}
                  onChange={(e) => updateField('semester', parseInt(e.target.value))}
                  style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                  required
                >
                  {DIPLOMA_SEMESTERS.map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--color-text-muted)',
                  cursor: 'pointer', padding: '0.25rem',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label" htmlFor="confirm-password">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--color-error)',
                fontSize: '0.8125rem',
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '0.25rem',
              fontSize: '0.9375rem',
              opacity: loading ? 0.7 : 1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Login link */}
      <p style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)',
      }}>
        Already have an account?{' '}
        <Link
          href="/login"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
