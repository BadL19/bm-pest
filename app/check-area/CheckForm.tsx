"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type Place = { label: string; lat: number; lon: number };
type R = { status: "in"; community: string; slug: string } | { status: "out"; nearest: string; km: number } | { status: "unknown" };

export default function CheckForm() {
  const listId = useId();
  const [address, setAddress] = useState("");
  const [picked, setPicked] = useState<Place | null>(null);
  const [options, setOptions] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [r, setR] = useState<R | null>(null);
  const ctl = useRef<AbortController | null>(null);

  // Debounced type-ahead. Skipped once the user has picked a suggestion.
  useEffect(() => {
    if (picked || address.trim().length < 3) { setOptions([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      ctl.current?.abort();
      ctl.current = new AbortController();
      try {
        const res = await fetch(`/api/address-suggest?q=${encodeURIComponent(address.trim())}`, { signal: ctl.current.signal });
        const d = await res.json();
        const list: Place[] = d.suggestions || [];
        setOptions(list); setActive(-1); setOpen(list.length > 0);
      } catch { /* aborted or offline: user can still type the full address */ }
    }, 250);
    return () => clearTimeout(t);
  }, [address, picked]);

  function choose(p: Place) {
    setAddress(p.label); setPicked(p); setOpen(false); setOptions([]); setActive(-1);
  }

  function onKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? options.length - 1 : a - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(options[active]); }
    else if (e.key === "Escape") setOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setR(null); setOpen(false);
    try {
      const res = await fetch("/api/check-area", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(picked ? { address, lat: picked.lat, lon: picked.lon } : { address }),
      });
      const d = await res.json();
      if (!res.ok) setError(d.error || "Something went wrong. Please call 705-707-3016.");
      else setR(d);
    } catch { setError("Could not reach the server. Please call 705-707-3016."); }
    finally { setBusy(false); }
  }

  return (
    <>
      <form className="pay" onSubmit={submit} noValidate>
        <div className="combo">
          <label htmlFor="addr">Your address</label>
          <input
            id="addr" value={address} placeholder="Start typing your street address" autoComplete="off"
            role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            onChange={(e) => { setAddress(e.target.value); setPicked(null); }}
            onKeyDown={onKey} onBlur={() => setTimeout(() => setOpen(false), 120)}
            onFocus={() => options.length && setOpen(true)}
          />
          {open && (
            <ul id={listId} role="listbox" className="suggest">
              {options.map((o, i) => (
                <li key={o.label + i} id={`${listId}-${i}`} role="option" aria-selected={i === active}
                  className={i === active ? "on" : ""} onMouseDown={(e) => { e.preventDefault(); choose(o); }}>
                  {o.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="btn" type="submit" disabled={busy}>{busy ? "Checking…" : "Check my address"}</button>
      </form>
      <p className="small" style={{ maxWidth: 520 }}>Your address is used for one thing: checking the map. We do not save it.</p>
      <div aria-live="polite">
        {error && <p className="msg err">{error}</p>}
        {r?.status === "in" && (
          <div className="msg">
            <p><b>You are on our map</b> ({r.community}).</p>
            <p>Call 705-707-3016 to confirm coverage, or get an estimate.</p>
            <div className="cta"><Link className="btn" href="/calculator">Get an estimate</Link><Link className="btn o" href={`/areas/${r.slug}`}>About {r.community}</Link></div>
          </div>
        )}
        {r?.status === "out" && (
          <div className="msg err">
            <p><b>That address falls outside our map.</b> The closest community we serve is {r.nearest}, about {r.km} km away.</p>
            <p>If you think this is wrong, call 705-707-3016 and we will check it with you.</p>
          </div>
        )}
        {r?.status === "unknown" && (
          <div className="msg err"><p>We could not find that address. Try adding the town, for example &ldquo;123 Main St, Bruce Mines, Ontario&rdquo;, or call 705-707-3016.</p></div>
        )}
      </div>
    </>
  );
}
