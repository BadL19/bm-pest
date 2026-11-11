export const PHONE_DISPLAY = "705-707-3016";
export const PHONE_TEL = "+17057073016";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bmpestcontrol.ca";

export type Community = { slug: string; name: string; lat: number; lon: number; radiusKm: number };

// Approximate community centres. radiusKm is how far from each centre counts as "in range".
// Adjust the radii to match where you actually want to work.
export const communities: Community[] = [
  { slug: "sault-ste-marie", name: "Sault Ste. Marie", lat: 46.5219, lon: -84.3461, radiusKm: 25 },
  { slug: "goulais-river", name: "Goulais River", lat: 46.72, lon: -84.38, radiusKm: 15 },
  { slug: "echo-bay", name: "Echo Bay", lat: 46.495, lon: -84.06, radiusKm: 15 },
  { slug: "desbarats", name: "Desbarats", lat: 46.34, lon: -83.95, radiusKm: 15 },
  { slug: "st-joseph-island", name: "St. Joseph Island", lat: 46.24, lon: -83.95, radiusKm: 20 },
  { slug: "bruce-mines", name: "Bruce Mines", lat: 46.3, lon: -83.78, radiusKm: 15 },
  { slug: "thessalon", name: "Thessalon", lat: 46.25, lon: -83.55, radiusKm: 15 },
  { slug: "blind-river", name: "Blind River", lat: 46.18, lon: -82.96, radiusKm: 15 },
];
