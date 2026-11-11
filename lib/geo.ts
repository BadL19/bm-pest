import { communities, type Community } from "./site";

export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(bLat - aLat), dLon = r(bLon - aLon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function nearest(lat: number, lon: number): { community: Community; km: number } {
  let best = communities[0], bestKm = Infinity;
  for (const c of communities) {
    const km = haversineKm(lat, lon, c.lat, c.lon);
    if (km < bestKm) { best = c; bestKm = km; }
  }
  return { community: best, km: bestKm };
}

export function inRange(lat: number, lon: number) {
  const { community, km } = nearest(lat, lon);
  return { inRange: km <= community.radiusKm, community, km };
}
