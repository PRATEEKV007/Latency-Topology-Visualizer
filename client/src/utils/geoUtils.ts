/**
 * Convert latitude and longitude to 3D Cartesian coordinates on a sphere
 */
export function latLngToCartesian(lat: number, lng: number, radius: number = 1): [number, number, number] {
  // Convert degrees to radians
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // Convert to Cartesian coordinates
  const x = radius * Math.cos(latRad) * Math.cos(lngRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lngRad);

  return [x, y, z];
}

/**
 * Calculate the great circle distance between two lat/lng points
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate latency based on geographic distance
 */
export function estimateLatency(distance: number): number {
  // Rough estimation: ~5ms per 1000km + base latency
  const baseLatency = 10;
  const distanceLatency = (distance / 1000) * 5;
  const randomVariation = (Math.random() - 0.5) * 20;
  
  return Math.max(5, Math.round(baseLatency + distanceLatency + randomVariation));
}

/**
 * Get continent from coordinates (simplified)
 */
export function getContinent(lat: number, lng: number): string {
  if (lat >= -10 && lat <= 70 && lng >= -25 && lng <= 45) return 'Europe';
  if (lat >= -35 && lat <= 70 && lng >= 25 && lng <= 180) return 'Asia';
  if (lat >= -40 && lat <= 35 && lng >= -20 && lng <= 55) return 'Africa';
  if (lat >= 15 && lat <= 70 && lng >= -170 && lng <= -50) return 'North America';
  if (lat >= -60 && lat <= 15 && lng >= -90 && lng <= -30) return 'South America';
  if (lat >= -50 && lat <= -10 && lng >= 110 && lng <= 180) return 'Australia';
  return 'Unknown';
}
