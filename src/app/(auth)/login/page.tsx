'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, KeyRound, Hash, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [loginMode, setLoginMode] = useState<'email' | 'rollno'>('rollno');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn({
      email: loginMode === 'email' ? email : undefined,
      rollNo: loginMode === 'rollno' ? rollNo : undefined,
      password,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/home');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Logo / Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          <LogIn size={28} color="#ffffff" />
        </motion.div>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
        }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          marginTop: '0.25rem',
        }}>
          Sign in to SAC Student Portal
        </p>
      </div>

      {/* Login Mode Toggle */}
      <div
        style={{
          display: 'flex',
          padding: '0.25rem',
          borderRadius: 'var(--radius-glass)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        {(['rollno', 'email'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setLoginMode(mode)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'calc(var(--radius-glass) - 0.25rem)',
              border: 'none',
              background: loginMode === mode ? 'var(--color-accent)' : 'transparent',
              color: loginMode === mode ? '#ffffff' : 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 200ms ease',
            }}
          >
            {mode === 'rollno' ? 'Roll Number' : 'Email'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loginMode === 'rollno' ? (
            <div>
              <label className="label" htmlFor="rollno">Roll Number</label>
              <div style={{ position: 'relative' }}>
                <Hash
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
                  id="rollno"
                  type="text"
                  className="input"
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
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
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          )}

          <div>
            <label className="label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound
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
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
              marginTop: '0.5rem',
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
                <LogIn size={18} />
                Sign In
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Register link */}
      <p style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)',
      }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Create Account
        </Link>
      </p>
    </motion.div>
  );
}
