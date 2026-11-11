import { NextResponse } from "next/server";
import { calculate, estimateToText, type Input } from "@/lib/estimate";
import { clientIp, tooMany } from "@/lib/ratelimit";

export const runtime = "nodejs";
const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (tooMany("q:" + clientIp(req), 5)) return NextResponse.json({ error: "Too many requests. Please call 705-707-3016." }, { status: 429 });
  let body: { input?: Input; contact?: Record<string, unknown> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const c = body.contact || {};
  if (s(c.website, 50)) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const name = s(c.name, 100), phone = s(c.phone, 40), email = s(c.email, 120), address = s(c.address, 200);
  if (name.length < 2) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Enter a phone number with area code." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (address.length < 5) return NextResponse.json({ error: "Enter the property address." }, { status: 400 });
  if (c.consent !== true) return NextResponse.json({ error: "Please agree to be contacted so we can follow up." }, { status: 400 });
  if (!body.input || typeof body.input !== "object") return NextResponse.json({ error: "Missing estimate." }, { status: 400 });

  // Recompute on the server so the request always carries a correct estimate.
  const est = calculate(body.input);
  const text = [
    "NEW QUOTE REQUEST (estimate request, not a booking)", "",
    `Name: ${name}`, `Phone: ${phone}`, `Email: ${email}`, `Property address: ${address}`,
    `Preferred day: ${s(c.day, 20) || "no preference"}`, `Preferred time: ${s(c.window, 20) || "any"}`,
    `Notes: ${s(c.notes, 600) || "none"}`, "", "--- ESTIMATE ---", estimateToText(est),
  ].join("\n");

  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_TO_EMAIL, from = process.env.LEAD_FROM_EMAIL;
  if (!key || !to || !from) return NextResponse.json({ error: "Quote requests are not set up yet. Please call 705-707-3016." }, { status: 503 });
  try {
    const r = await fetch((process.env.RESEND_API_BASE || "https://api.resend.com") + "/emails", {
      method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Quote request: ${name} (${est.summary[1]?.[1] ?? "service"})`, text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error("mail " + r.status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not send your request. Please call 705-707-3016." }, { status: 502 });
  }
}
