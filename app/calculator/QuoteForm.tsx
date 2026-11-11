"use client";
import { useState } from "react";
import type { Input } from "@/lib/estimate";

export default function QuoteForm({ input }: { input: Input }) {
  const [c, setC] = useState({ name: "", phone: "", email: "", address: "", notes: "", day: "", window: "Any time", consent: false, website: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const up = (k: string, v: string | boolean) => setC((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input, contact: c }) });
      const d = await res.json();
      setMsg({ ok: res.ok, text: res.ok ? "Thank you. Your request is in. We will contact you to confirm details. This does not book a treatment." : d.error || "Something went wrong. Please call 705-707-3016." });
    } catch { setMsg({ ok: false, text: "Could not reach the server. Please call 705-707-3016." }); }
    finally { setBusy(false); }
  }

  if (msg?.ok) return <p className="msg" style={{ maxWidth: 640 }}>{msg.text}</p>;
  return (
    <form className="pay" onSubmit={submit} noValidate style={{ maxWidth: 640, marginTop: 32 }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: 0 }}>Request a formal quote</h2>
      <p className="small" style={{ margin: 0 }}>Your estimate details are sent with your request. This does not book a treatment; we will contact you first.</p>
      <label>Full name<input value={c.name} onChange={(e) => up("name", e.target.value)} autoComplete="name" required /></label>
      <label>Phone number<input type="tel" value={c.phone} onChange={(e) => up("phone", e.target.value)} autoComplete="tel" required /></label>
      <label>Email address<input type="email" value={c.email} onChange={(e) => up("email", e.target.value)} autoComplete="email" required /></label>
      <label>Property address<input value={c.address} onChange={(e) => up("address", e.target.value)} autoComplete="street-address" required /></label>
      <label>Preferred day (optional)<input type="date" value={c.day} onChange={(e) => up("day", e.target.value)} /></label>
      <label>Preferred time
        <select value={c.window} onChange={(e) => up("window", e.target.value)}>
          <option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option>
        </select>
      </label>
      <label>Anything else we should know?<input value={c.notes} onChange={(e) => up("notes", e.target.value)} maxLength={600} /></label>
      <input aria-hidden tabIndex={-1} autoComplete="off" value={c.website} onChange={(e) => up("website", e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
      <label className="opt"><input type="checkbox" checked={c.consent} onChange={(e) => up("consent", e.target.checked)} />I agree to be contacted about this request.</label>
      {msg && !msg.ok && <p className="msg err">{msg.text}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? "Sending…" : "Send quote request"}</button>
    </form>
  );
}
