import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

const NOT_FOUND = "We couldn't find an unpaid invoice matching those details. Check them and try again, or call 705-707-3016.";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Online payments are not set up yet. Please call 705-707-3016." }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  let body: { number?: unknown; email?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const number = typeof body.number === "string" ? body.number.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[A-Za-z0-9-]{3,40}$/.test(number) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid invoice number and email address." }, { status: 400 });
  }

  try {
    const stripe = new Stripe(key);
    const found = await stripe.invoices.search({ query: `number:'${number}'`, limit: 1 });
    const inv = found.data[0];
    if (!inv || (inv.customer_email || "").toLowerCase() !== email) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    }
    if (inv.status === "paid") return NextResponse.json({ status: "paid", number });
    if (inv.status !== "open" || !inv.hosted_invoice_url) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    }
    return NextResponse.json({
      status: "open",
      number,
      amount: inv.amount_remaining,
      currency: inv.currency,
      url: inv.hosted_invoice_url,
    });
  } catch {
    return NextResponse.json({ error: "Payment lookup is unavailable right now. Please call 705-707-3016." }, { status: 502 });
  }
}
