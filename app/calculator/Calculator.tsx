"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pricing as P } from "@/lib/pricing";
import { calculate, defaultInput, itemInfo, type Estimate, type Input, type Range } from "@/lib/estimate";
import QuoteForm from "./QuoteForm";

const money = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);
const rg = (r: Range) => (r.low === r.high ? money(r.low) : `${money(r.low)} to ${money(r.high)}`);

export default function Calculator() {
  const sp = useSearchParams();
  const [f, setF] = useState<Input>({ ...defaultInput, mode: sp.get("mode") === "plan" ? "plan" : "once" });
  const [sqftText, setSqftText] = useState("");
  const [range, setRange] = useState("");
  const [err, setErr] = useState("");
  const [est, setEst] = useState<{ e: Estimate; input: Input } | null>(null);

  const info = useMemo(() => itemInfo(f.item), [f.item]);
  const set = <K extends keyof Input>(k: K, v: Input[K]) => { setF((p) => ({ ...p, [k]: v })); setEst(null); };
  const isPlan = f.mode === "plan";
  const needsSize = isPlan || !!info?.size;
  const needsHouse = isPlan || !!info?.house;
  const kind = info?.kind;
  const showOutdoor = kind === "outdoor" || kind === "pkg-outdoor";

  function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    let sqft: number | null = null;
    if (needsSize) {
      if (sqftText.trim()) {
        sqft = Number(sqftText.replace(/,/g, ""));
        if (!Number.isFinite(sqft) || sqft < P.sqftMin || sqft > P.sqftMax) { setErr(`Enter your finished living area in square feet, between ${P.sqftMin.toLocaleString()} and ${P.sqftMax.toLocaleString()}, or choose a range.`); return; }
      } else if (range) sqft = P.sizeTiers.find((t) => t.id === range)!.rep;
      else { setErr("Enter your home size in square feet, or choose a range."); return; }
    }
    const input = { ...f, sqft };
    setEst({ e: calculate(input), input });
    setTimeout(() => document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <>
      <form className="pay" onSubmit={submit} noValidate style={{ maxWidth: 640 }}>
        <fieldset>
          <legend>What&rsquo;s the mission?</legend>
          <label className="opt"><input type="radio" name="mode" checked={!isPlan} onChange={() => set("mode", "once")} />One-time treatment</label>
          <label className="opt"><input type="radio" name="mode" checked={isPlan} onChange={() => set("mode", "plan")} />Monthly Home Protection Plan</label>
        </fieldset>

        {!isPlan && (
          <label>Treatment
            <select value={f.item} onChange={(e) => set("item", e.target.value)}>
              <optgroup label="Individual pest treatments">{P.pests.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</optgroup>
              <optgroup label="Combined packages">{P.packages.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</optgroup>
              <optgroup label="Inspection"><option value="inspection">Standalone inspection</option></optgroup>
            </select>
          </label>
        )}
        {!isPlan && P.packages.find((p) => p.id === f.item) && <p className="small" style={{ margin: 0 }}>{P.packages.find((p) => p.id === f.item)!.blurb}</p>}

        {isPlan && (
          <fieldset>
            <legend>Plan</legend>
            <label className="opt"><input type="radio" name="plan" checked={f.plan === "essential"} onChange={() => set("plan", "essential")} /><span>Essential<br /><span className="small">{P.plan.essentialIncludes.join(". ")}.</span></span></label>
            <label className="opt"><input type="radio" name="plan" checked={f.plan === "premium"} onChange={() => set("plan", "premium")} /><span>Premium<br /><span className="small">{P.plan.premiumIncludes.join(". ")}.</span></span></label>
          </fieldset>
        )}

        {needsHouse && (
          <label>House type
            <select value={f.houseType} onChange={(e) => set("houseType", e.target.value)}>{P.houseTypes.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}</select>
          </label>
        )}

        {needsSize && (
          <fieldset>
            <legend>Finished living area</legend>
            <label>Approximate square feet
              <input inputMode="numeric" value={sqftText} onChange={(e) => { setSqftText(e.target.value.replace(/[^\d,]/g, "")); setEst(null); }} placeholder="e.g. 1800" />
            </label>
            <label style={{ marginTop: 10 }}>Or choose a range
              <select value={range} onChange={(e) => { setRange(e.target.value); setEst(null); }}>
                <option value="">Select a range</option>
                {P.sizeTiers.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <p className="small" style={{ margin: "8px 0 0" }}>If you enter a number, it is used instead of the range. Garages do not count as living area.</p>
          </fieldset>
        )}

        {!isPlan && info?.garage && (
          <fieldset>
            <legend>Garage</legend>
            <label>Garage on the property
              <select value={f.garage} onChange={(e) => set("garage", e.target.value)}>{P.garages.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select>
            </label>
            {f.garage !== "none" && (
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600 }}>Would you like the garage included in the inspection or treatment?</p>
                <label className="opt"><input type="radio" name="gi" checked={f.garageIncluded} onChange={() => set("garageIncluded", true)} />Yes, include the garage</label>
                <label className="opt"><input type="radio" name="gi" checked={!f.garageIncluded} onChange={() => set("garageIncluded", false)} />No, house only</label>
              </div>
            )}
          </fieldset>
        )}
        {isPlan && (
          <label>Garage on the property
            <select value={f.garage} onChange={(e) => set("garage", e.target.value)}>{P.garages.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select>
          </label>
        )}

        {!isPlan && kind === "wasp" && (
          <fieldset>
            <legend>The nests</legend>
            <label>How many accessible nests?
              <select value={f.waspNests} onChange={(e) => set("waspNests", Number(e.target.value))}>
                <option value={1}>One</option><option value={2}>Two</option><option value={3}>Three</option><option value={4}>Four or more</option>
              </select>
            </label>
            <label className="opt" style={{ marginTop: 8 }}><input type="checkbox" checked={f.waspDifficult} onChange={(e) => set("waspDifficult", e.target.checked)} />Difficult roofline access</label>
          </fieldset>
        )}
        {!isPlan && showOutdoor && (
          <fieldset>
            <legend>Your property</legend>
            <label>Property size (outdoor)
              <select value={f.lot} onChange={(e) => set("lot", e.target.value)}>{P.outdoor.lots.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select>
            </label>
            {kind === "outdoor" && (
              <>
                <label className="opt" style={{ marginTop: 8 }}><input type="radio" name="mo" checked={f.mosquitoOption === "once"} onChange={() => set("mosquitoOption", "once")} />One-time treatment</label>
                <label className="opt"><input type="radio" name="mo" checked={f.mosquitoOption === "seasonal"} onChange={() => set("mosquitoOption", "seasonal")} />Five-visit seasonal package</label>
              </>
            )}
          </fieldset>
        )}
        {!isPlan && kind === "fleas" && (
          <label>How many rooms are affected?
            <select value={f.fleasRooms} onChange={(e) => set("fleasRooms", e.target.value)}>{P.fleasRooms.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
          </label>
        )}
        {!isPlan && kind === "pantry" && (
          <label>How many areas are affected?
            <select value={f.pantryAreas} onChange={(e) => set("pantryAreas", e.target.value)}>{P.pantryAreas.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
          </label>
        )}
        {!isPlan && kind === "rodent" && f.item === "rats" && (
          <label className="opt"><input type="checkbox" checked={f.rodentRepairs} onChange={(e) => set("rodentRepairs", e.target.checked)} />Entry-point sealing or repairs are needed</label>
        )}

        {!isPlan && info?.severity && (
          <fieldset>
            <legend>How bad is the pest problem?</legend>
            {P.severity.map((s) => (
              <label key={s.id} className="opt"><input type="radio" name="sev" checked={f.severity === s.id} onChange={() => set("severity", s.id)} /><span>{s.label}<br /><span className="small">{s.bullets.join(". ")}.</span></span></label>
            ))}
          </fieldset>
        )}

        <label>Where is the property?
          <select value={f.location} onChange={(e) => set("location", e.target.value)}>{P.travel.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
        </label>
        {!isPlan && <label className="opt"><input type="checkbox" checked={f.emergency} onChange={(e) => set("emergency", e.target.checked)} />Emergency / after-hours service (+${P.emergencySurcharge})</label>}

        <button className="btn" type="submit">Calculate estimate</button>
      </form>

      <div id="estimate" aria-live="polite" style={{ scrollMarginTop: 90 }}>
        {err && <p className="msg err">{err}</p>}
        {est && <Result e={est.e} />}
        {est && !err && <QuoteForm input={est.input} />}
      </div>
    </>
  );
}

function Result({ e }: { e: Estimate }) {
  return (
    <div className="result" style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: "1.6rem" }}>Your estimate</h2>
      <table className="rt"><tbody>{e.summary.map(([k, v]) => (<tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>))}</tbody></table>

      {e.custom.length > 0 ? (
        <div className="msg err" style={{ marginTop: 16 }}>
          <p><b>This one needs a custom quote.</b></p>
          <ul style={{ margin: 0, paddingLeft: "1.2em" }}>{e.custom.map((c) => <li key={c}>{c}</li>)}</ul>
          <p style={{ marginBottom: 0 }}>Request a formal quote below, or call 705-707-3016.</p>
        </div>
      ) : (
        <>
          <table className="rt" style={{ marginTop: 16 }}>
            <tbody>
              {e.lines.map((l) => (<tr key={l.label}><th scope="row">{l.label}</th><td>{l.low === 0 && l.high === 0 ? "$0" : rg(l)}</td></tr>))}
              {e.subtotal && <tr><th scope="row">Subtotal</th><td>{rg(e.subtotal)}</td></tr>}
              {e.hst && <tr><th scope="row">HST (13%)</th><td>{rg(e.hst)}</td></tr>}
            </tbody>
          </table>
          {e.total && (
            <>
              <p style={{ margin: "14px 0 0" }}>{e.plan ? "First-year estimated total" : "Estimated total"}</p>
              <p className="big">{rg(e.total)}</p>
            </>
          )}
          {e.plan && (
            <div className="msg" style={{ marginTop: 12 }}>
              <p style={{ margin: 0 }}><b>{money(e.plan.monthly)} per month</b> (before HST) after a {money(e.plan.enrollment)} enrollment fee.</p>
              <p style={{ margin: "6px 0 0" }}>{e.plan.visits} scheduled visits per year. Monthly billing does not mean monthly visits.</p>
              <p style={{ margin: "10px 0 4px", fontWeight: 600 }}>Included</p>
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>{e.plan.includes.map((x) => <li key={x}>{x}</li>)}</ul>
              <p style={{ margin: "10px 0 4px", fontWeight: 600 }}>Not included</p>
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>{e.plan.excludes.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
        </>
      )}
      {e.travelNote && <p className="small">{e.travelNote}</p>}
      {e.notices.map((n) => <p key={n} className="small" style={{ margin: "6px 0 0" }}>{n}</p>)}
      <p className="small" style={{ marginTop: 12 }}>{P.disclaimer}</p>
      <details style={{ marginTop: 8 }}>
        <summary>Other charges that may apply</summary>
        <table className="rt"><tbody>{P.otherCharges.map(([k, v]) => (<tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>))}</tbody></table>
        <p className="small">These are not added to your estimate. They apply only if the work is needed and is not already part of your service.</p>
      </details>
    </div>
  );
}
