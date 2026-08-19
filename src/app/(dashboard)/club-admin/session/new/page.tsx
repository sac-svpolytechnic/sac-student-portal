'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedPage from '@/components/ui/AnimatedPage';
import GlassCard from '@/components/ui/GlassCard';
import {
  ArrowLeft, MapPin, Sparkles, Loader2, Navigation
} from 'lucide-react';
import type { Club } from '@/lib/types';
import { SEED_CLUBS } from '@/lib/seed';

function getDefaultTimes() {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 3600000);

  const formatForInput = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  return {
    start: formatForInput(now),
    end: formatForInput(twoHoursLater),
  };
}

export default function NewSessionPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubId, setClubId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(() => getDefaultTimes().start);
  const [endTime, setEndTime] = useState(() => getDefaultTimes().end);
  const [lat, setLat] = useState('28.7041');
  const [lng, setLng] = useState('77.1025');
  const [radius, setRadius] = useState(100);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch managed clubs
  useEffect(() => {
    let isCancelled = false;

    async function loadClubs() {
      try {
        const res = await fetch('/api/clubs');
        const json = await res.json();
        const available = json.clubs || SEED_CLUBS;
        if (!isCancelled) {
          setClubs(available);
          if (available.length > 0) setClubId(available[0].id);
        }
      } catch (err) {
        console.error('Error loading clubs:', err);
      }
    }
    loadClubs();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Grab device GPS Location
  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported on this device/browser.');
      return;
    }

    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      (err) => {
        setError(`Location access error: ${err.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clubId || !title || !startTime || !endTime) {
      setError('Please fill in all mandatory session fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club_id: clubId,
          title,
          description,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          geofence_radius_m: radius,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create session');
        setSubmitting(false);
      } else {
        const newSessionId = data.session?.id || 's1111111-1111-1111-1111-111111111111';
        router.push(`/club-admin/session/${newSessionId}/broadcast`);
      }
    } catch {
      setError('Network error launching session.');
      setSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="btn btn-ghost"
          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', marginBottom: '1rem', gap: '0.375rem' }}
        >
          <ArrowLeft size={16} />
          Back to Console
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Create Attendance Session
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Configure GPS anchor, geofence radius, and rotating dynamic QR broadcaster.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
            {/* Club Selection */}
            <div>
              <label className="label" htmlFor="club-select">Host Club</label>
              <select
                id="club-select"
                className="input"
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                required
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="label" htmlFor="session-title">Session Title</label>
              <input
                id="session-title"
                type="text"
                className="input"
                placeholder="e.g. Next.js 15 Deep Dive Workshop"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label" htmlFor="session-desc">Description (Optional)</label>
              <textarea
                id="session-desc"
                className="input"
                rows={2}
                placeholder="Agenda, prerequisites, or room instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            {/* Start & End Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label" htmlFor="start-time">Start Time</label>
                <input
                  id="start-time"
                  type="datetime-local"
                  className="input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="end-time">End Time</label>
                <input
                  id="end-time"
                  type="datetime-local"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* GPS Geofence Anchor */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-accent)' }} />
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    GPS Anchor & Geofencing
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locating}
                  className="btn btn-ghost"
                  style={{ padding: '0.3rem 0.625rem', fontSize: '0.6875rem', gap: '0.25rem' }}
                >
                  {locating ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={12} />}
                  Use My GPS
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label className="label" htmlFor="geo-lat">Latitude</label>
                  <input
                    id="geo-lat"
                    type="number"
                    step="any"
                    className="input"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="geo-lng">Longitude</label>
                  <input
                    id="geo-lng"
                    type="number"
                    step="any"
                    className="input"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Radius Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label className="label" htmlFor="geo-radius" style={{ margin: 0 }}>Geofence Radius</label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {radius} meters
                  </span>
                </div>
                <input
                  id="geo-radius"
                  type="range"
                  min="25"
                  max="500"
                  step="25"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>Room (25m)</span>
                  <span>Hall (100m)</span>
                  <span>Campus Zone (500m)</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid var(--color-error)',
                  color: 'var(--color-error)',
                  fontSize: '0.8125rem',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', gap: '0.5rem' }}
            >
              {submitting ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Sparkles size={18} />
                  Launch Session & Start Dynamic Broadcaster
                </>
              )}
            </motion.button>
          </GlassCard>
        </form>
      </div>
    </AnimatedPage>
  );
}
