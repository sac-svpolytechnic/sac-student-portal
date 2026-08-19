'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  ArrowLeft, RefreshCw, ShieldAlert, MapPin, Users,
  Activity, Maximize, Minimize, CheckCircle2, Loader2
} from 'lucide-react';

export default function QRBroadcastPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [sessionMeta, setSessionMeta] = useState<{
    title?: string;
    club_name?: string;
    geofence_radius_m?: number;
    lat?: number;
    lng?: number;
  } | null>(null);

  const [countdown, setCountdown] = useState(15);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch rotating QR from backend
  const fetchFreshQR = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/qr`);
      const data = await res.json();

      if (data.qrDataUrl) {
        setQrDataUrl(data.qrDataUrl);
        setToken(data.token);
        if (data.session) setSessionMeta(data.session);
        setCountdown(15);
      }
    } catch (err) {
      console.error('Error fetching rotating QR:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial fetch on mount
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/qr`);
        const data = await res.json();
        if (!isCancelled && data.qrDataUrl) {
          setQrDataUrl(data.qrDataUrl);
          setToken(data.token);
          if (data.session) setSessionMeta(data.session);
        }
      } catch (err) {
        console.error('Initial QR fetch error:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    init();

    return () => {
      isCancelled = true;
    };
  }, [sessionId]);

  // Rotation Countdown Interval (1s tick)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchFreshQR();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchFreshQR]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container" style={{ maxWidth: '48rem' }}>
        {/* Navigation & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => router.push('/club-admin')}
            className="btn btn-ghost"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', gap: '0.375rem' }}
          >
            <ArrowLeft size={16} />
            Exit Broadcaster
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={fetchFreshQR}
              className="btn btn-ghost"
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', gap: '0.375rem' }}
            >
              <RefreshCw size={14} />
              Rotate Now
            </button>
            <button
              onClick={toggleFullscreen}
              className="btn btn-ghost"
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', gap: '0.375rem' }}
            >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              {isFullscreen ? 'Window' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Main Broadcaster Card */}
        <GlassCard
          style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: 'var(--glow-accent)',
          }}
        >
          {/* Header Metadata */}
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
              <Activity size={12} />
              Live Broadcaster Active
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              {sessionMeta?.title || 'Active Attendance Session'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {sessionMeta?.club_name || 'Student Activity Centre'}
            </p>
          </div>

          {/* Dynamic QR Frame */}
          <div
            style={{
              position: 'relative',
              padding: '1.25rem',
              borderRadius: '1.5rem',
              background: '#ffffff',
              boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '16rem',
              minHeight: '16rem',
            }}
          >
            {loading || !qrDataUrl ? (
              <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#0a0b10' }} />
            ) : (
              <motion.div
                key={token}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'relative', width: '280px', height: '280px' }}
              >
                <Image
                  src={qrDataUrl}
                  alt="Dynamic Single-Use Attendance QR Code"
                  fill
                  sizes="280px"
                  style={{
                    display: 'block',
                    borderRadius: '0.5rem',
                    objectFit: 'contain',
                  }}
                  priority
                  unoptimized
                />
              </motion.div>
            )}
          </div>

          {/* Countdown & Security Meter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              {countdown}s
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Next Code Rotation in {countdown} seconds
            </span>
          </div>

          {/* Anti-Proxy Security Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--color-warning)',
              fontSize: '0.75rem',
              maxWidth: '30rem',
              textAlign: 'left',
            }}
          >
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span>
              <strong>Anti-Proxy Protection:</strong> Codes automatically self-destruct after 15–20s. Screenshots forwarded to remote proxies will fail geofence & timestamp verification.
            </span>
          </div>

          {/* Live Check-In Counter & Geofence Indicator Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
              gap: '0.75rem',
              width: '100%',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Users size={20} style={{ color: 'var(--color-success)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>16</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Live Check-ins
                </p>
              </div>
            </div>

            <div
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <MapPin size={20} style={{ color: 'var(--color-accent)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
                  {sessionMeta?.geofence_radius_m || 100}m Radius
                </p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Geofence Anchor
                </p>
              </div>
            </div>
          </div>

          {/* Copy Token Button (Useful for instant testing without camera) */}
          <button
            onClick={copyToken}
            className="btn btn-ghost"
            style={{ fontSize: '0.6875rem', padding: '0.3rem 0.625rem', color: 'var(--color-text-muted)' }}
          >
            {isCopied ? <CheckCircle2 size={12} style={{ color: 'var(--color-success)' }} /> : null}
            {isCopied ? 'Token Copied to Clipboard!' : 'Copy Live JWT (for scanner testing)'}
          </button>
        </GlassCard>
      </div>
    </AnimatedPage>
  );
}
