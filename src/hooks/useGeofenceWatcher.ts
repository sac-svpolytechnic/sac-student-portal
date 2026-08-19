'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { isWithinGeofence } from '@/lib/geo/haversine';

interface UseGeofenceWatcherProps {
  sessionId?: string | null;
  anchorLat?: number | null;
  anchorLng?: number | null;
  radiusMeters?: number;
  active?: boolean;
  onGeofenceExit?: (distanceMeters: number) => void;
}

export function useGeofenceWatcher({
  sessionId,
  anchorLat,
  anchorLng,
  radiusMeters = 100,
  active = false,
  onGeofenceExit,
}: UseGeofenceWatcherProps) {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isInside, setIsInside] = useState<boolean>(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const exitTriggeredRef = useRef(false);

  const handleExit = useCallback(
    async (dist: number) => {
      if (exitTriggeredRef.current || !sessionId) return;
      exitTriggeredRef.current = true;

      try {
        await fetch('/api/attendance/check-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch (err) {
        console.error('Failed to auto check-out on geofence exit:', err);
      }

      if (onGeofenceExit) {
        onGeofenceExit(dist);
      }
    },
    [sessionId, onGeofenceExit]
  );

  useEffect(() => {
    if (!active || typeof window === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    if (anchorLat === null || anchorLat === undefined || anchorLng === null || anchorLng === undefined) {
      return;
    }

    exitTriggeredRef.current = false;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setCurrentCoords({ lat: userLat, lng: userLng });

        const check = isWithinGeofence(userLat, userLng, anchorLat, anchorLng, radiusMeters);
        setDistance(check.distanceMeters);
        setIsInside(check.inside);

        if (!check.inside) {
          handleExit(check.distanceMeters);
        }
      },
      (error) => {
        console.warn('Geolocation watcher warning:', error.message);
        setGeoError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [active, anchorLat, anchorLng, radiusMeters, handleExit]);

  return {
    currentCoords,
    distance,
    isInside,
    geoError,
  };
}
