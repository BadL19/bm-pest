import { pricing as P } from "./pricing";

export type Input = {
  mode: "once" | "plan";
  item: string;                 // pest id, package id, or "inspection"
  houseType: string;
  sqft: number | null;          // actual finished living area
  garage: string;
  garageIncluded: boolean;      // customer wants garage inspected/treated separately
  severity: string;
  location: string;
  emergency: boolean;
  plan: "essential" | "premium";
  fleasRooms: string;
  pantryAreas: string;
  waspNests: number;            // accessible nests (1..)
  waspDifficult: boolean;
  lot: string;                  // outdoor property size id
  mosquitoOption: "once" | "seasonal";
  rodentRepairs: boolean;       // entry-point sealing / repairs needed
};

export type Range = { low: number; high: number };
export type Line = { label: string } & Range;
export type Estimate = {
  kind: "once" | "plan";
  summary: [string, string][];
  custom: string[];             // if non-empty: no price, custom quote / manual review
  lines: Line[];                // treatment + additional + travel
  subtotal: Range | null;
  hst: Range | null;
  total: Range | null;
  notices: string[];
  travelNote?: string;
  plan?: { name: string; monthly: number; enrollment: number; visits: number; includes: string[]; excludes: string[] };
};

export const defaultInput: Input = {
  mode: "once", item: "ants", houseType: "detached", sqft: null, garage: "none", garageIncluded: false,
  severity: "light", location: "sault-ste-marie", emergency: false, plan: "essential",
  fleasRooms: "one", pantryAreas: "one", waspNests: 1, waspDifficult: false, lot: "small",
  mosquitoOption: "once", rodentRepairs: false,
};

export const r5 = (n: number) => Math.round(n / P.roundTo) * P.roundTo;
const cents = (n: number) => Math.round(n * 100) / 100;
export const sizeTier = (sqft: number) => P.sizeTiers.find((t) => t.max === null || sqft <= t.max)!;

// What each service needs from the form.
export type ItemInfo = {
  label: string; kind: string; base: number;
  size: boolean; house: boolean; garage: boolean; severity: boolean;
};
export function itemInfo(id: string): ItemInfo | null {
  if (id === "inspection") return { label: "Standalone inspection", kind: "inspection", base: P.standaloneInspection, size: false, house: false, garage: false, severity: false };
  const pk = P.packages.find((p) => p.id === id);
  if (pk) return { label: pk.label, kind: pk.kind, base: pk.base, size: pk.kind === "pkg", house: pk.kind === "pkg", garage: pk.kind === "pkg", severity: false };
  const p = P.pests.find((x) => x.id === id);
  if (!p) return null;
  const std = p.kind === "standard" || p.kind === "rodent";
  return { label: p.label, kind: p.kind, base: p.base, size: std, house: std, garage: std, severity: true };
}

const add = (a: Range, b: Range): Range => ({ low: a.low + b.low, high: a.high + b.high });

export function calculate(i: Input): Estimate {
  const custom: string[] = [];
  const notices: string[] = [];
  const lines: Line[] = [];
  const summary: [string, string][] = [];
  const ht = P.houseTypes.find((h) => h.id === i.houseType);
  const tier = i.sqft && i.sqft > 0 ? sizeTier(i.sqft) : null;
  const gar = P.garages.find((g) => g.id === i.garage);
  const loc = P.travel.find((t) => t.id === i.location);
  const sev = P.severity.find((s) => s.id === i.severity);
  const sizeText = i.sqft ? `${Math.round(i.sqft).toLocaleString("en-CA")} sq. ft. (${tier!.label})` : "Not provided";
  const out = (e: Partial<Estimate>): Estimate => ({ kind: i.mode, summary, custom, lines, subtotal: null, hst: null, total: null, notices, ...e });

  const needs = (cond: boolean, msg: string) => { if (cond) custom.push(msg); };
  const travelFor = (): { line?: Line; note?: string } => {
    if (!loc) return { note: "Travel charges will be confirmed when we review your request." };
    if (loc.charge === null) return { note: "Travel charges will be confirmed when we review your request." };
    return { line: { label: `Travel (${loc.label})${loc.charge === 0 ? ": free" : ""}`, low: loc.charge, high: loc.charge } };
  };
  const finish = (base: Range): Estimate => {
    const sub = lines.reduce((acc, l) => add(acc, l), base);
    const hst = { low: cents(sub.low * P.hstRate), high: cents(sub.high * P.hstRate) };
    return out({ subtotal: sub, hst, total: { low: cents(sub.low + hst.low), high: cents(sub.high + hst.high) } });
  };

  // ---------- Monthly Home Protection Plan ----------
  if (i.mode === "plan") {
    const planName = i.plan === "premium" ? "Premium" : "Essential";
    summary.push(["Service", `Monthly Home Protection Plan (${planName})`], ["House type", ht?.label ?? "Not provided"], ["Home size", sizeText], ["Garage", gar?.label ?? "Not provided"], ["Location", loc?.label ?? "Not provided"]);
    needs(!ht, "Choose a house type.");
    needs(!tier, "Enter your home size.");
    needs(ht?.factor === null, "Property type “Other” needs a manual review before we can price a plan.");
    needs(!!tier && tier.essential === null, "Homes over 3,500 sq. ft. need a custom plan quote.");
    notices.push(`Monthly billing does not mean monthly visits. The plan includes ${P.plan.visitsPerYear} scheduled visits per year.`);
    const tr = travelFor();
    notices.push(tr.line ? "Travel charges, if any, may apply to scheduled visits and will be confirmed when we review your request." : "Travel charges will be confirmed when we review your request.");
    notices.push(P.licensingNotice);
    if (custom.length || !tier) return out({});
    const monthly = (i.plan === "premium" ? tier.premium : tier.essential)!;
    const first = P.plan.enrollment + monthly * 12;
    const hst = cents(first * P.hstRate);
    return out({
      lines: [{ label: "Initial enrollment fee", low: P.plan.enrollment, high: P.plan.enrollment }, { label: `Monthly payments (12 × $${monthly})`, low: monthly * 12, high: monthly * 12 }],
      subtotal: { low: first, high: first }, hst: { low: hst, high: hst }, total: { low: cents(first + hst), high: cents(first + hst) },
      plan: { name: planName, monthly, enrollment: P.plan.enrollment, visits: P.plan.visitsPerYear, includes: i.plan === "premium" ? P.plan.premiumIncludes : P.plan.essentialIncludes, excludes: P.plan.notIncluded },
    });
  }

  // ---------- One-time treatment / package / inspection ----------
  const info = itemInfo(i.item);
  if (!info) { custom.push("Choose a service."); return out({}); }
  summary.push(["Service", "One-time treatment"], ["Pest / package", info.label]);
  if (info.house) summary.push(["House type", ht?.label ?? "Not provided"]);
  if (info.size) summary.push(["Home size", sizeText]);
  if (info.garage) summary.push(["Garage", gar ? gar.label + (i.garage !== "none" ? (i.garageIncluded ? " (included)" : " (not included)") : "") : "Not provided"]);
  if (info.severity) summary.push(["Severity", sev?.label ?? "Not provided"]);
  summary.push(["Location", loc?.label ?? "Not provided"]);

  if (info.house) { needs(!ht, "Choose a house type."); needs(ht?.factor === null, "Property type “Other” needs a manual review before we can price it."); }
  if (info.size) needs(!tier, "Enter your home size.");
  if (info.kind === "standard" || info.kind === "rodent") needs(!!tier && tier.factor === null, "Homes over 3,500 sq. ft. need a custom quote.");
  if (info.severity) needs(!sev, "Choose how bad the problem is.");

  let treat: Range = { low: 0, high: 0 };
  let label = "Estimated treatment price";

  switch (info.kind) {
    case "standard":
    case "rodent": {
      if (!custom.length) {
        const rodentFlat = i.item === "rats" && i.rodentRepairs;
        const raw = rodentFlat ? info.base : info.base * tier!.factor! * ht!.factor! * sev!.factor;
        const v = Math.max(P.minimumOneTime, r5(raw));
        treat = { low: v, high: v };
        if (rodentFlat) notices.push("Because rodent entry-point sealing or repairs are needed, the size, house type and severity adjustments are not applied. The repair and exclusion work is quoted separately.");
      }
      if (info.kind === "rodent") notices.push("The initial service includes inspection and an initial control plan, not unlimited visits or unlimited exclusion work. Additional exclusion and repair work is quoted separately.");
      break;
    }
    case "wasp": {
      const n = Math.max(1, Math.floor(i.waspNests || 1));
      needs(n > P.wasp.maxPricedNests, "Four or more nests need an inspection and a custom quote.");
      if (!custom.length) {
        const extra = n - 1;
        let lo = P.wasp.firstNest + extra * P.wasp.extraNest[0], hi = P.wasp.firstNest + extra * P.wasp.extraNest[1];
        if (i.waspDifficult) { lo += P.wasp.roofline[0]; hi += P.wasp.roofline[1]; notices.push("Difficult roofline access adds $50–$150, confirmed at inspection."); }
        treat = { low: r5(lo), high: r5(hi) };
        if (extra > 0) notices.push("Additional accessible nests are $75–$125 each, confirmed at inspection.");
      }
      summary.push(["Nests", String(n)], ["Roofline", i.waspDifficult ? "Difficult access" : "Normal access"]);
      notices.push("Wasp and hornet pricing does not use your home size.");
      break;
    }
    case "outdoor":
    case "pkg-outdoor": {
      const lot = P.outdoor.lots.find((l) => l.id === i.lot);
      const seasonal = info.kind === "pkg-outdoor" || i.mosquitoOption === "seasonal";
      summary.push(["Property size", lot?.label ?? "Not provided"], ["Option", seasonal ? `Seasonal package (${P.outdoor.seasonalVisits} visits)` : "One-time treatment"]);
      needs(!lot, "Choose your property size.");
      needs(lot?.once === null, "Properties over 1 acre need a custom quote.");
      if (!custom.length && lot) { const v = (seasonal ? lot.seasonal : lot.once)!; treat = { low: v, high: v }; }
      notices.push("Mosquito and tick services are subject to the appropriate Ontario licensing and application requirements. Pricing uses outdoor property size, not house size.");
      break;
    }
    case "fleas": {
      const r = P.fleasRooms.find((x) => x.id === i.fleasRooms);
      summary.push(["Rooms affected", r?.label ?? "Not provided"]);
      needs(!r, "Tell us how many rooms are affected.");
      needs(!!r?.custom, "Four or more affected rooms need an inspection or manual pricing.");
      if (!custom.length) { const v = Math.max(P.minimumOneTime, info.base); treat = { low: v, high: v }; }
      break;
    }
    case "pantry": {
      const a = P.pantryAreas.find((x) => x.id === i.pantryAreas);
      summary.push(["Areas affected", a?.label ?? "Not provided"]);
      needs(!a, "Tell us how many areas are affected.");
      needs(!!a?.custom, "Several affected rooms need an inspection.");
      if (!custom.length) { const v = Math.max(P.minimumOneTime, info.base); treat = { low: v, high: v }; }
      break;
    }
    case "pkg": {
      if (!custom.length) treat = { low: info.base, high: info.base };
      notices.push("Package prices are starting prices for eligible treatment scopes and may be adjusted following inspection.");
      break;
    }
    case "inspection": {
      treat = { low: info.base, high: info.base };
      label = "Inspection price";
      break;
    }
  }

  if (info.severity && sev?.inspection) notices.push("Severe infestations are subject to inspection. The final price must be confirmed after inspection.");
  if (info.severity && ["wasp", "outdoor", "fleas", "pantry"].includes(info.kind)) notices.push("The severity you chose does not change this service’s listed price, but it can change what work is required.");
  notices.push(P.licensingNotice);

  if (custom.length) return out({});

  lines.push({ label, ...treat });
  if (info.garage && i.garageIncluded && gar) {
    if (gar.charge === null) notices.push("A detached garage or workshop larger than two cars needs an inspection. It is not included in this estimate.");
    else if (gar.charge > 0) lines.push({ label: `Garage treatment (${gar.label})`, low: gar.charge, high: gar.charge });
  }
  if (i.emergency) lines.push({ label: "Emergency / after-hours service", low: P.emergencySurcharge, high: P.emergencySurcharge });
  const tr = travelFor();
  if (tr.line) lines.push(tr.line);
  const e = finish({ low: 0, high: 0 });
  e.travelNote = tr.note;
  return e;
}

export function estimateToText(e: Estimate): string {
  const m = (n: number) => `$${n.toFixed(2)}`;
  const rg = (r: Range) => (r.low === r.high ? m(r.low) : `${m(r.low)} to ${m(r.high)}`);
  const out: string[] = e.summary.map(([k, v]) => `${k}: ${v}`);
  out.push("");
  if (e.custom.length) out.push("CUSTOM QUOTE / MANUAL REVIEW NEEDED:", ...e.custom.map((c) => `- ${c}`));
  else {
    e.lines.forEach((l) => out.push(`${l.label}: ${rg(l)}`));
    if (e.plan) out.push(`Monthly payment: ${m(e.plan.monthly)} (${e.plan.visits} scheduled visits per year)`);
    if (e.subtotal) out.push(`Subtotal: ${rg(e.subtotal)}`, `HST (13%): ${rg(e.hst!)}`, `Estimated total: ${rg(e.total!)}`);
  }
  if (e.travelNote) out.push("", e.travelNote);
  if (e.notices.length) out.push("", ...e.notices.map((n) => `Note: ${n}`));
  return out.join("\n");
}
