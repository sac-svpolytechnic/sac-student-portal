'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import ScannerOverlay from './ScannerOverlay';
import { CameraOff, RefreshCw, KeyRound } from 'lucide-react';

interface QRScannerProps {
  onScan: (token: string) => void;
  isProcessing?: boolean;
}

export default function QRScanner({
  onScan,
  isProcessing = false,
}: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('scanning');
  const [statusText, setStatusText] = useState('Align QR inside HUD reticle');

  // Trigger Haptic Feedback
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(120);
      } catch {
        // Haptics not supported or permitted
      }
    }
  }, []);

  const handleSuccessfulScan = useCallback(
    (token: string) => {
      triggerHaptic();
      setStatus('success');
      setStatusText('QR Captured! Validating Geofence...');
      onScan(token);
    },
    [onScan, triggerHaptic]
  );

  // Initialize Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setStatus('scanning');
    setStatusText('Align QR inside HUD reticle');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access not supported on this browser or connection. Use manual token entry.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      console.warn('Camera access error:', msg);
      setCameraError('Camera permission denied or device busy. Please grant camera access or paste token.');
      setCameraActive(false);
    }
  }, []);

  // Stop camera when unmounting
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!isCancelled) {
          setCameraError('Camera access not supported on this browser. Use manual token entry.');
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (!isCancelled && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Unable to access camera';
          console.warn('Camera stream warning:', msg);
          setCameraError('Camera access not permitted. Use manual token entry.');
        }
      }
    }

    initCamera();

    const videoEl = videoRef.current;

    return () => {
      isCancelled = true;
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Camera Viewport Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          maxWidth: '22rem',
          margin: '0 auto',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          background: '#0a0b10',
          border: '2px solid var(--color-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: cameraActive ? 'block' : 'none',
          }}
          muted
        />

        {/* Fallback Viewport if camera unavailable */}
        {!cameraActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(180deg, #12131a, #0a0b10)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <CameraOff size={36} style={{ color: 'var(--color-accent)', marginBottom: '0.75rem', opacity: 0.8 }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Camera Standby / Emulation Mode
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {cameraError || 'Allow camera permission or test with simulated session token.'}
            </p>

            <button
              onClick={startCamera}
              className="btn btn-ghost"
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                padding: '0.375rem 0.75rem',
                gap: '0.375rem',
              }}
            >
              <RefreshCw size={13} />
              Retry Camera
            </button>
          </div>
        )}

        {/* HUD Scanner Reticle & Laser Sweep */}
        <ScannerOverlay status={status} statusText={statusText} />
      </div>

      {/* Manual Token Paste / Demo Simulator */}
      <div
        className="glass"
        style={{
          padding: '1rem',
          borderRadius: 'var(--radius-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <KeyRound size={15} style={{ color: 'var(--color-accent)' }} />
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
            Simulate or Paste Session Token
          </h4>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          On devices without cameras, paste the live JWT token or click &quot;Submit&quot;.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input"
            placeholder="Paste raw JWT token..."
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
          />
          <button
            onClick={() => {
              if (manualToken.trim()) {
                handleSuccessfulScan(manualToken.trim());
              }
            }}
            disabled={!manualToken.trim() || isProcessing}
            className="btn btn-primary"
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
