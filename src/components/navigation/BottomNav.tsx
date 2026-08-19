'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  User,
  Settings,
  Shield,
  Users,
  ScrollText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

interface Tab {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const TABS: Tab[] = [
  // MEMBER tabs
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: <Home size={22} />,
    roles: ['MEMBER', 'CLUB_ADMIN'],
  },
  {
    id: 'explore',
    label: 'Explore',
    href: '/explore',
    icon: <Compass size={22} />,
    roles: ['MEMBER', 'CLUB_ADMIN'],
  },
  {
    id: 'club-admin',
    label: 'Manage',
    href: '/club-admin',
    icon: <Settings size={22} />,
    roles: ['CLUB_ADMIN'],
  },
  // SUPER_ADMIN tabs
  {
    id: 'super-console',
    label: 'Console',
    href: '/super-admin',
    icon: <Shield size={22} />,
    roles: ['SUPER_ADMIN'],
  },
  {
    id: 'super-clubs',
    label: 'Clubs',
    href: '/super-admin/clubs',
    icon: <Compass size={22} />,
    roles: ['SUPER_ADMIN'],
  },
  {
    id: 'super-users',
    label: 'Users',
    href: '/super-admin/users',
    icon: <Users size={22} />,
    roles: ['SUPER_ADMIN'],
  },
  {
    id: 'super-audit',
    label: 'Audit',
    href: '/super-admin/audit',
    icon: <ScrollText size={22} />,
    roles: ['SUPER_ADMIN'],
  },
  // Shared
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: <User size={22} />,
    roles: ['MEMBER', 'CLUB_ADMIN', 'SUPER_ADMIN'],
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  const visibleTabs = TABS.filter((tab) => tab.roles.includes(role));

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--nav-bg)',
        backdropFilter: `blur(var(--nav-blur))`,
        WebkitBackdropFilter: `blur(var(--nav-blur))`,
        borderTop: '1px solid var(--glass-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '32rem',
          margin: '0 auto',
          padding: '0.375rem 0.5rem',
        }}
      >
        {visibleTabs.map((tab) => {
          const isActive = pathname === tab.href ||
            (tab.href !== '/home' && pathname.startsWith(tab.href));

          return (
            <NavItem
              key={tab.id}
              tab={tab}
              isActive={isActive}
            />
          );
        })}
      </div>
    </motion.nav>
  );
}

function NavItem({ tab, isActive }: { tab: Tab; isActive: boolean }) {
  return (
    <Link
      href={tab.href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.125rem',
        padding: '0.375rem 0.75rem',
        borderRadius: 'var(--radius-glass)',
        textDecoration: 'none',
        position: 'relative',
        color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
        transition: 'color 200ms ease',
        minWidth: '3.5rem',
      }}
    >
      {/* Active indicator pill */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-accent-muted)',
            borderRadius: 'var(--radius-glass)',
            zIndex: -1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
          y: isActive ? -1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {tab.icon}
      </motion.div>

      <span
        style={{
          fontSize: '0.625rem',
          fontWeight: isActive ? 700 : 500,
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}
      >
        {tab.label}
      </span>
    </Link>
  );
}
