import { NextResponse } from "next/server";
import { mapboxSearch, suggestionsEnabled } from "@/lib/geocode";
import { clientIp, tooMany } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!suggestionsEnabled()) return NextResponse.json({ suggestions: [] });
  if (tooMany("sg:" + clientIp(req), 120)) return NextResponse.json({ suggestions: [] }, { status: 429 });
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 3 || q.length > 120) return NextResponse.json({ suggestions: [] });
  try {
    const suggestions = await mapboxSearch(q, true, 5);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
