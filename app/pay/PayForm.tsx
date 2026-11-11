"use client";
import { useState } from "react";

type Result =
  | { status: "open"; number: string; amount: number; currency: string; url: string }
  | { status: "paid"; number: string };

export default function PayForm() {
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/invoice/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, email }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong. Please try again or call 705-707-3016.");
      else setResult(data);
    } catch {
      setError("Could not reach the server. Please try again or call 705-707-3016.");
    } finally { setBusy(false); }
  }

  const money = (cents: number, cur: string) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: cur.toUpperCase() }).format(cents / 100);

  return (
    <>
      <form className="pay" onSubmit={submit} noValidate>
        <label>Invoice number
          <input value={number} onChange={(e) => setNumber(e.target.value)} required autoComplete="off" placeholder="e.g. BM-0001" />
        </label>
        <label>Email on the invoice
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <button className="btn" disabled={busy} type="submit">{busy ? "Looking up…" : "Find my invoice"}</button>
      </form>
      <div aria-live="polite" style={{ marginTop: 24 }}>
        {error && <p className="msg err">{error}</p>}
        {result?.status === "paid" && <p className="msg">Invoice {result.number} is already paid in full. We appreciate you.</p>}
        {result?.status === "open" && (
          <div className="msg">
            <p>Invoice {result.number}</p>
            <p className="big">{money(result.amount, result.currency)}</p>
            <a className="btn" href={result.url}>Pay securely with Stripe</a>
          </div>
        )}
      </div>
    </>
  );
}
