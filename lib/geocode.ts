export type Place = { label: string; lat: number; lon: number };

const token = () => process.env.MAPBOX_ACCESS_TOKEN;
const base = () => process.env.GEOCODER_BASE || "https://api.mapbox.com";
export const suggestionsEnabled = () => Boolean(token());

type Feature = {
  geometry: { coordinates: [number, number] };
  properties: { full_address?: string; name?: string; place_formatted?: string };
};

// Mapbox Geocoding v6. `autocomplete` is for type-ahead; the Algoma-area bbox keeps suggestions relevant.
export async function mapboxSearch(q: string, autocomplete: boolean, limit: number): Promise<Place[]> {
  const params = new URLSearchParams({
    q, country: "ca", language: "en", limit: String(limit),
    autocomplete: String(autocomplete),
    types: "address,street,place,locality,neighborhood,postcode",
    proximity: "-84.3461,46.5219",
    access_token: token()!,
  });
  if (autocomplete) params.set("bbox", "-85.5,45.9,-82.5,47.3");
  const res = await fetch(`${base()}/search/geocode/v6/forward?${params}`, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error("geocoder " + res.status);
  const data = (await res.json()) as { features?: Feature[] };
  return (data.features || []).map((f) => ({
    label: f.properties.full_address || [f.properties.name, f.properties.place_formatted].filter(Boolean).join(", "),
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
  }));
}

// Fallback when no Mapbox token is set: OpenStreetMap Nominatim, single lookups only (its policy forbids type-ahead).
async function nominatimOne(q: string): Promise<Place | null> {
  const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({ format: "jsonv2", limit: "1", countrycodes: "ca", q });
  const res = await fetch(url, { headers: { "User-Agent": "BMPestControl-AreaCheck/1.0 (bmpestcontrol.ca)", "Accept-Language": "en" }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("geocoder " + res.status);
  const d = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  return d.length ? { label: d[0].display_name, lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) } : null;
}

export async function geocodeOne(q: string): Promise<Place | null> {
  if (token()) return (await mapboxSearch(q, false, 1))[0] ?? null;
  return nominatimOne(q);
}
