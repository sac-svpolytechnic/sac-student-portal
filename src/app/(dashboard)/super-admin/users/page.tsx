'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  Users, Search, Shield, User,
  CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import type { Profile, UserRole } from '@/lib/types';
import { SEED_USERS } from '@/lib/seed-admin';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminUsersPage() {
  const { role: loggedInRole } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadUsers() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users?role=${roleFilter}&q=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (!isCancelled) {
          setUsers(data.users || SEED_USERS);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadUsers();

    return () => {
      isCancelled = true;
    };
  }, [roleFilter, search]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingId(userId);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setToast({ text: `Role elevated to ${newRole} successfully!`, type: 'success' });
      } else {
        setToast({ text: data.error || 'Failed to update role', type: 'error' });
      }
    } catch {
      setToast({ text: 'Network error updating user role.', type: 'error' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Header Strip */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Users size={22} style={{ color: 'var(--color-accent)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Student & User Registry
            </h1>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Oversee user permissions, search academic records, and elevate administrative privileges.
          </p>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-glass)',
                background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`,
                color: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{toast.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar & Role Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Search by name, roll no, email, or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {(['ALL', 'SUPER_ADMIN', 'TEACHER', 'CLUB_ADMIN', 'MEMBER'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid',
                  borderColor: roleFilter === r ? 'var(--color-accent)' : 'var(--color-border)',
                  background: roleFilter === r ? 'var(--color-accent-muted)' : 'var(--color-surface)',
                  color: roleFilter === r ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: roleFilter === r ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* User Table List */}
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {users.map((user) => (
              <GlassCard key={user.id} padding="md">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '50%',
                        background:
                          user.role === 'SUPER_ADMIN'
                            ? 'var(--color-accent-muted)'
                            : user.role === 'TEACHER'
                            ? 'rgba(56, 189, 248, 0.15)'
                            : user.role === 'CLUB_ADMIN'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'var(--color-surface)',
                        border: `1px solid ${
                          user.role === 'SUPER_ADMIN'
                            ? 'var(--color-accent)'
                            : user.role === 'TEACHER'
                            ? 'var(--color-info)'
                            : user.role === 'CLUB_ADMIN'
                            ? 'var(--color-warning)'
                            : 'var(--color-border)'
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color:
                          user.role === 'SUPER_ADMIN'
                            ? 'var(--color-accent)'
                            : user.role === 'TEACHER'
                            ? 'var(--color-info)'
                            : user.role === 'CLUB_ADMIN'
                            ? 'var(--color-warning)'
                            : 'var(--color-text-secondary)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || <User size={18} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                          {user.name}
                        </h3>
                        <span
                          className={`badge ${
                            user.role === 'SUPER_ADMIN'
                              ? ''
                              : user.role === 'TEACHER'
                              ? 'badge-success'
                              : user.role === 'CLUB_ADMIN'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                          style={{ fontSize: '0.625rem' }}
                        >
                          <Shield size={10} />
                          {user.role}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                        {user.email}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                        Roll No: {user.roll_no} • {user.branch} (Sem {user.semester})
                      </p>
                    </div>
                  </div>

                  {/* Role Elevation Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      className="input"
                      value={user.role}
                      disabled={updatingId === user.id || loggedInRole === 'TEACHER'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        width: 'auto',
                        minWidth: '9rem',
                        cursor: loggedInRole === 'TEACHER' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <option value="MEMBER">Role: MEMBER</option>
                      <option value="CLUB_ADMIN">Role: CLUB_ADMIN</option>
                      <option value="TEACHER">Role: TEACHER</option>
                      <option value="SUPER_ADMIN">Role: SUPER_ADMIN</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            ))}

            {users.length === 0 && (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Users size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>No users match the search filter</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
