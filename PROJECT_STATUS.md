# Project status

## Built
- Pages: Home, Insects (index + 12 pest pages), Rodents (index + mice, rats), Structural monthly plan, Treatment estimate calculator, Check my area, Service areas (index + 8 community pages), About, Contact, FAQ, Pay an invoice, 404, sitemap.xml, robots.txt.
- Nav bar with Insects and Rodents dropdowns (hover/keyboard on desktop, menu on mobile), Structural, Estimate, Check my area, Pay invoice.
- Pay an invoice: Stripe-backed lookup by invoice number + email (see README).

## Tested (local production build)
- Build passes (types and lint); all routes return 200, unknown route 404.
- Address checker: input validation works; the in/out-of-range logic was checked with sample coordinates (in-range: Sault Ste. Marie, Richards Landing, Blind River; out-of-range: Wawa, Sudbury, Elliot Lake).
- Invoice lookup: validation, rate limit, missing-key and Stripe-error handling.

## NOT tested
- Live address geocoding (the test sandbox blocks outside requests). Try a few real addresses after deploying.
- A real Stripe invoice lookup and payment.
- Calculator in a browser, mobile layout, accessibility audit, Lighthouse.

## You must do before launch
1. Review the starting prices in lib/pricing.ts (they are the owner's starting structure; every number lives in that one file).
2. Review service radii in lib/site.ts (coverage is distance from each community centre).
3. Stripe account + restricted key (README).
4. Confirm licence status/scope before taking payment for treatments; check the pest list against what you will actually treat.
5. Monthly plan terms (visit timing, cancellation) and refund/terms wording; privacy policy (address checker and invoice emails); legal review.
6. HST setup on invoices.

## Address autocomplete (added)
- Tested against a mock geocoder through the real API routes: suggestions, picked-coordinate check, typed-address check (in range, out of range, not found), bad input, and suggestions off with no token.
- NOT tested: the real Mapbox service, or the dropdown in a real browser/phone (keyboard and screen-reader behaviour included). Add MAPBOX_ACCESS_TOKEN and try real addresses.

## Calculator rebuild (added)
- lib/pricing.ts (all prices/rules), lib/estimate.ts (calculation engine), app/calculator/Calculator.tsx (form + results), app/calculator/QuoteForm.tsx (formal quote request), app/api/quote/route.ts (sends the lead by email through Resend).
- Tested: 35 calculation cases (formula, rounding, floor, garages, travel, wasps, mosquitoes/ticks, fleas, pantry, rodents, packages, plans, custom-quote triggers); quote API against a mock email service (valid, missing consent, bad email, honeypot, not configured).
- NOT tested: the form in a real browser/phone; real email delivery (needs RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL and a verified sending domain).
- There are no pest pages yet for mosquitoes and ticks, though they are in the calculator.

## Not built yet
Pest education articles, enquiry form, privacy policy page, analytics, structured data.
