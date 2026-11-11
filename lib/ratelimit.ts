const buckets = new Map<string, number[]>();
// Simple in-memory limiter (per server instance). Move to Vercel KV/Upstash if traffic grows.
export function tooMany(key: string, max: number, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > max;
}
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
