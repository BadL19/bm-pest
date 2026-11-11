import { NextResponse } from "next/server";
import { nearest } from "@/lib/geo";
import { geocodeOne } from "@/lib/geocode";
import { clientIp, tooMany } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (tooMany("ca:" + clientIp(req), 20)) {
    return NextResponse.json({ error: "Too many checks. Please wait a few minutes or call 705-707-3016." }, { status: 429 });
  }
  let body: { address?: unknown; lat?: unknown; lon?: unknown } = {};
  try { body = await req.json(); } catch {}
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const hasCoords = typeof body.lat === "number" && typeof body.lon === "number" &&
    Math.abs(body.lat) <= 90 && Math.abs(body.lon) <= 180;
  if (!hasCoords && (address.length < 5 || address.length > 200)) {
    return NextResponse.json({ error: "Enter your street address and town." }, { status: 400 });
  }
  try {
    let lat: number, lon: number;
    if (hasCoords) { lat = body.lat as number; lon = body.lon as number; }
    else {
      const p = await geocodeOne(address);
      if (!p) return NextResponse.json({ status: "unknown" });
      lat = p.lat; lon = p.lon;
    }
    const { community, km } = nearest(lat, lon);
    if (km <= community.radiusKm) return NextResponse.json({ status: "in", community: community.name, slug: community.slug });
    return NextResponse.json({ status: "out", nearest: community.name, km: Math.round(km) });
  } catch {
    return NextResponse.json({ error: "The address check is unavailable right now. Please call 705-707-3016." }, { status: 502 });
  }
}
