'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${hover ? 'glass-hover' : ''} ${className}`}
      style={{
        padding: padding === 'sm' ? '0.75rem' : padding === 'lg' ? '1.75rem' : '1.25rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
