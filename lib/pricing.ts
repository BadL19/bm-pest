// =============================================================================
// ALL CALCULATOR PRICES AND RULES LIVE HERE. Change numbers in this file only.
// All prices are CAD, before HST. These are starting estimates, not final quotes.
// null = "needs a custom quote / manual review".
// =============================================================================
export const pricing = {
  hstRate: 0.13,
  minimumOneTime: 179,   // a calculated one-time treatment never goes below this
  roundTo: 5,            // one-time treatment prices round to the nearest $5
  sqftMin: 200,
  sqftMax: 50000,

  houseTypes: [
    { id: "detached", label: "Detached house", factor: 1.0 as number | null },
    { id: "semi", label: "Semi-detached house", factor: 0.95 },
    { id: "townhouse", label: "Townhouse / row house", factor: 0.9 },
    { id: "duplex", label: "Duplex", factor: 1.05 },
    { id: "apartment", label: "Apartment / condominium", factor: 0.85 },
    { id: "cottage", label: "Cottage", factor: 1.1 },
    { id: "other", label: "Other", factor: null }, // manual review
  ],

  // Finished living area. `max` is the upper bound (inclusive). `rep` is used when a customer picks a range instead of typing a number.
  sizeTiers: [
    { id: "t1", label: "Up to 1,000 sq. ft.", max: 1000, rep: 900, factor: 0.85 as number | null, essential: 39 as number | null, premium: 59 as number | null },
    { id: "t2", label: "1,001–1,500 sq. ft.", max: 1500, rep: 1250, factor: 0.93, essential: 45, premium: 65 },
    { id: "t3", label: "1,501–2,000 sq. ft.", max: 2000, rep: 1750, factor: 1.0, essential: 49, premium: 79 },
    { id: "t4", label: "2,001–2,500 sq. ft.", max: 2500, rep: 2250, factor: 1.12, essential: 59, premium: 89 },
    { id: "t5", label: "2,501–3,500 sq. ft.", max: 3500, rep: 3000, factor: 1.25, essential: 69, premium: 99 },
    { id: "t6", label: "Over 3,500 sq. ft.", max: null as number | null, rep: 4000, factor: null, essential: null, premium: null },
  ],

  garages: [
    { id: "none", label: "No garage", charge: 0 as number | null, attached: false },
    { id: "att1", label: "Attached single-car garage", charge: 0, attached: true },
    { id: "att2", label: "Attached double-car garage", charge: 0, attached: true },
    { id: "det1", label: "Detached single-car garage", charge: 35, attached: false },
    { id: "det2", label: "Detached double-car garage", charge: 50, attached: false },
    { id: "detL", label: "Detached garage / workshop larger than two cars", charge: null, attached: false }, // inspection required
  ],

  // kind decides which rules apply:
  //  standard = base x size x house type x severity
  //  rodent   = standard formula (rats with exclusion/repairs: base only)
  //  wasp / outdoor / fleas / pantry = their own rules, no multipliers
  pests: [
    { id: "ants", label: "Ants", base: 179, kind: "standard" },
    { id: "carpenter-ants", label: "Carpenter ants", base: 249, kind: "standard" },
    { id: "spiders", label: "Spiders", base: 179, kind: "standard" },
    { id: "wasps-and-hornets", label: "Wasps and hornets", base: 199, kind: "wasp" },
    { id: "cockroaches", label: "Cockroaches", base: 299, kind: "standard" },
    { id: "silverfish-and-earwigs", label: "Silverfish and earwigs", base: 179, kind: "standard" },
    { id: "fleas", label: "Fleas", base: 249, kind: "fleas" },
    { id: "flies", label: "Flies", base: 179, kind: "standard" },
    { id: "fall-invaders", label: "Fall invaders", base: 179, kind: "standard" },
    { id: "pantry-pests", label: "Pantry pests", base: 179, kind: "pantry" },
    { id: "carpet-beetles-and-clothes-moths", label: "Carpet beetles and clothes moths", base: 229, kind: "standard" },
    { id: "centipedes-and-millipedes", label: "Centipedes and millipedes", base: 179, kind: "standard" },
    { id: "mice", label: "Mice", base: 249, kind: "rodent" },
    { id: "rats", label: "Rats", base: 349, kind: "rodent" },
    { id: "mosquitoes", label: "Mosquitoes", base: 199, kind: "outdoor" },
    { id: "ticks", label: "Ticks", base: 199, kind: "outdoor" },
  ],

  severity: [
    { id: "light", label: "Light", factor: 1.0, inspection: false, bullets: ["One or two sightings", "Recently noticed activity", "Small affected area"] },
    { id: "moderate", label: "Moderate", factor: 1.25, inspection: false, bullets: ["Regular sightings", "Several affected rooms or areas", "Activity is becoming more frequent"] },
    { id: "heavy", label: "Heavy", factor: 1.5, inspection: false, bullets: ["Widespread pest activity", "Signs of an established infestation", "Multiple affected areas"] },
    { id: "severe", label: "Severe", factor: 1.75, inspection: true, bullets: ["Extensive infestation", "Multiple nesting areas", "Difficult access or extensive work required"] },
  ],

  wasp: {
    firstNest: 199,
    extraNest: [75, 125] as [number, number],   // per additional accessible nest
    maxPricedNests: 3,                           // 4+ nests = inspection and custom quote
    roofline: [50, 150] as [number, number],     // difficult roofline access
  },

  outdoor: {
    seasonalVisits: 5,
    lots: [
      { id: "small", label: "Small: up to 1/4 acre", once: 199 as number | null, seasonal: 749 as number | null },
      { id: "medium", label: "Medium: 1/4 to 1/2 acre", once: 249, seasonal: 899 },
      { id: "large", label: "Large: 1/2 to 1 acre", once: 299, seasonal: 1099 },
      { id: "xl", label: "Extra large: over 1 acre", once: null, seasonal: null },
    ],
  },

  fleasRooms: [
    { id: "one", label: "One room", custom: false },
    { id: "few", label: "Two to three rooms", custom: false },
    { id: "many", label: "Four or more rooms", custom: true },
  ],
  pantryAreas: [
    { id: "one", label: "One cupboard or pantry", custom: false },
    { id: "multi", label: "Multiple cupboards", custom: false },
    { id: "rooms", label: "Several rooms", custom: true },
  ],

  standaloneInspection: 89,
  emergencySurcharge: 75,

  packages: [
    { id: "pkg-ant-spider", label: "Ant & Spider Protection", base: 299, kind: "pkg", blurb: "Combined inspection and eligible targeted treatments." },
    { id: "pkg-exterior", label: "Complete Exterior Protection", base: 349, kind: "pkg", blurb: "Exterior pest inspection, spider and crawling pest assessment, eligible treatments and prevention recommendations." },
    { id: "pkg-rodent", label: "Rodent Prevention", base: 349, kind: "pkg", blurb: "Initial rodent inspection, entry-point assessment and control plan." },
    { id: "pkg-mosquito-tick", label: "Seasonal Mosquito & Tick", base: 0, kind: "pkg-outdoor", blurb: "Five scheduled visits. Priced by lot size." },
  ],

  travel: [
    { id: "sault-ste-marie", label: "Sault Ste. Marie", charge: 0 as number | null },
    { id: "goulais-river", label: "Goulais River", charge: 15 },
    { id: "echo-bay", label: "Echo Bay", charge: 15 },
    { id: "st-joseph-island", label: "St. Joseph Island", charge: 20 },
    { id: "bruce-mines", label: "Bruce Mines", charge: 25 },
    { id: "thessalon", label: "Thessalon", charge: 40 },
    { id: "blind-river", label: "Blind River", charge: 50 },
    { id: "other", label: "Other / not listed", charge: null }, // confirmed on review
  ],

  plan: {
    enrollment: 99,
    visitsPerYear: 4,
    essentialIncludes: [
      "Four scheduled inspections per year",
      "Exterior entry-point inspections",
      "Spider and crawling pest activity assessments",
      "Web removal assessment",
      "Pest prevention recommendations",
      "Priority scheduling",
    ],
    premiumIncludes: [
      "Everything in Essential",
      "More detailed interior and exterior inspections",
      "Rodent activity monitoring",
      "Accessible attic, basement and foundation inspections",
      "Eligible preventative services",
      "Priority follow-up assessments",
    ],
    notIncluded: [
      "Unlimited treatments",
      "Major infestation removal",
      "Repair or rodent exclusion work (quoted separately)",
    ],
  },

  // Shown for reference on results. Not added automatically, because they depend on what is actually needed.
  otherCharges: [
    ["Standalone inspection", "$89"],
    ["Additional follow-up visit", "$75–$125"],
    ["Additional treatment area", "$35–$75"],
    ["Additional rodent monitoring station", "$25–$40"],
    ["Minor rodent entry-point sealing", "$25–$75 per point"],
    ["Larger exclusion work", "Custom quote"],
    ["Emergency / after-hours service", "+$75"],
    ["Additional wasp/hornet nest", "$75–$125"],
    ["Difficult roofline access", "+$50–$150"],
  ] as [string, string][],

  disclaimer:
    "This is an estimated price based on the information provided. Final pricing may change following inspection and confirmation of the required service. Additional work, repairs, difficult access and severe infestations may require a separate quote.",
  licensingNotice:
    "All services are subject to applicable Ontario licensing and pesticide-label requirements.",
};
