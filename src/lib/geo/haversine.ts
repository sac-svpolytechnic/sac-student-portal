// ============================================================
// Haversine Great-Circle Distance Calculation (in meters)
// ============================================================

/**
 * Calculates the great-circle distance between two GPS coordinates using the Haversine formula.
 * @param lat1 Latitude of point 1 (in degrees)
 * @param lon1 Longitude of point 1 (in degrees)
 * @param lat2 Latitude of point 2 (in degrees)
 * @param lon2 Longitude of point 2 (in degrees)
 * @returns Distance in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's mean radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters rounded to nearest integer
}

/**
 * Validates whether user coordinates fall within the geofence perimeter.
 */
export function isWithinGeofence(
  userLat: number,
  userLng: number,
  anchorLat: number,
  anchorLng: number,
  radiusMeters: number
): { inside: boolean; distanceMeters: number; deltaMeters: number } {
  const distanceMeters = calculateHaversineDistance(userLat, userLng, anchorLat, anchorLng);
  const inside = distanceMeters <= radiusMeters;
  const deltaMeters = Math.max(0, distanceMeters - radiusMeters);

  return {
    inside,
    distanceMeters,
    deltaMeters,
  };
}
