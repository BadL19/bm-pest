# B&M Pest Control website

Next.js 15 + TypeScript. Homepage plus an online invoice payment page powered by Stripe.

## How invoice payment works
1. You create and send invoices from the Stripe Dashboard (Billing > Invoices), with the customer's email on it.
2. The customer opens /pay and enters the invoice number and the email on that invoice.
3. The server (app/api/invoice/lookup/route.ts) looks the invoice up in Stripe. Number and email must both match.
4. If unpaid, the customer goes to Stripe's hosted invoice page to pay by card. Card details never touch this site.
5. Stripe emails the receipt and marks the invoice paid. Check payments in your Stripe Dashboard.

No database is needed. Stripe is the system of record.

## Setup
1. Create a Stripe account for B&M (Canada, CAD) and complete business verification.
2. Developers > API keys > create a restricted key with only "Invoices: Read". Put it in STRIPE_SECRET_KEY.
3. Set up HST on your invoices in Stripe (Stripe Tax or a manual tax rate). Confirm with your accountant.
4. cp .env.example .env.local, fill it in, then npm install && npm run dev.

## Deploy (Vercel)
Import the repo, add STRIPE_SECRET_KEY and NEXT_PUBLIC_SITE_URL as environment variables, deploy, then add bmpestcontrol.ca under Project > Domains and set the DNS records Vercel shows. Do not change DNS until you are ready.

## Costs (confirm current pricing)
Vercel Hobby is free for low traffic, but check its terms for commercial use (Pro is about $20 USD/month). Stripe has no monthly fee; per-payment card fees apply, and invoicing may add a per-invoice fee.

## Security notes
- Lookup needs invoice number AND email, uses a read-only key, validates input and rate limits per IP.
- The rate limiter is in-memory (resets on redeploy, per server instance). Fine to start; move to Vercel KV/Upstash later.
- Error messages don't reveal whether an invoice number exists.

## Address checker
/check-area geocodes the typed address with OpenStreetMap Nominatim (free, low-volume use only) and compares it to the distance from each community centre in lib/site.ts. Addresses are not stored. For heavy traffic, swap the geocoder in app/api/check-area/route.ts for a paid one.

## Calculator
/calculator uses lib/pricing.ts. Edit the rates there. Results are shown as a range (plus or minus 15%) and labelled as an estimate.

## Address suggestions (autocomplete)
The address box on /check-area suggests real addresses as the customer types (250 ms debounce, keyboard and screen-reader friendly). Picking a suggestion sends its coordinates straight to the range check, so there is no second lookup.
- Provider: Mapbox Geocoding v6, called only from the server (app/api/address-suggest) so the token never reaches the browser. Create a Mapbox account, make a public-scope token restricted by URL if you can, and set MAPBOX_ACCESS_TOKEN.
- Without a token: suggestions switch off and the check falls back to OpenStreetMap Nominatim (single lookups only; its policy forbids type-ahead).
- Review Mapbox's current pricing, free tier and terms (including attribution rules) before launch.

## Calculator and quote requests
All prices and rules are in lib/pricing.ts; the maths is in lib/estimate.ts (shared by the page and the quote API, which recomputes the estimate on the server). Quote requests are emailed through Resend: create an account, verify your sending domain, then set RESEND_API_KEY, LEAD_TO_EMAIL and LEAD_FROM_EMAIL. Nothing is booked automatically.
