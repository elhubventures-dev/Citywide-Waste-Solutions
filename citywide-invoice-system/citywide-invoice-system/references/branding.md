# Citywide Waste Solutions — Brand & Business Facts

Pull these into any invoice template, PDF, email, or UI component instead of inventing placeholders.

## Company identity

- **Legal name:** Citywide Waste Solutions
- **Sister brand:** Citywide Moving Solutions (relocate.citywidewastesolutions.com) — same crew/company, separate brand skin. Use multi-company branding for this pairing rather than a generic "multi-brand" abstraction.
- **Tagline:** "Cleaner City. Better Tomorrow."
- **Founded:** 2014 (10+ years in business)
- **Address:** Prestonvale Road, Courtice, Ontario L1E 3H8, Canada
- **Phone:** 437-580-6054 (tel:+14375806054)
- **Email:** wastesolutions80@gmail.com
- **WhatsApp:** https://wa.me/14375806054
- **Business numbers (put on invoice footer, required for CA tax invoices):**
  - BN 716988035TZ0002
  - BIN 1001615565
  - NAICS 562210 — Waste Treatment and Disposal
- **Hours:** Mon–Fri 7:00 AM–6:00 PM, Sat 8:00 AM–2:00 PM, Sun closed
- **Service areas:** Durham, Clarington, Toronto, Scarborough, Vaughan (Ontario, Canada)
- **Socials:** Facebook, Instagram, LinkedIn — facebook.com/citywidewastesolutions, instagram.com/citywidewastesolutions, linkedin.com/company/citywide-waste-solutions

## Visual identity

- **Theme/brand color:** `#1E3A5C` (deep navy blue) — use as primary; this is the site's declared theme-color.
- **Logo assets (Next.js `/_next/image` optimized, so treat as remote images, not files you own):**
  - Header logo: `/images/logos/logo-header.png`
  - Footer logo: `/images/logos/logo-footer.png`
- **Iconography style:** simple emoji/line icons used informally on marketing site (🛡️ 💰 ⚡ 🌱 😊) — for the invoice module, prefer a proper icon set (lucide-react) rather than emoji, since this is an admin tool, not the marketing site.
- **Tone:** clean, professional, eco-conscious SaaS feel — rounded cards, soft shadows, generous whitespace. Not playful/startup-quirky.
- **Currency & locale:** CAD, en-CA. Tax = Canadian HST/GST (Ontario = 13% HST typical, but make the rate configurable, don't hardcode 13%).

## Site & stack signals

- Built on **Next.js** (evidenced by `/_next/image` optimization pipeline).
- Two live subdomains/sites share the brand: main site (waste) and `relocate.citywidewastesolutions.com` (moving). The invoice module's multi-company branding feature should model exactly these two brands as the first-class example, not a generic placeholder brand.
- No CMS/backend details are publicly visible from the marketing site — do NOT assume a specific backend (e.g. don't assume WordPress, Shopify, etc.). Ask the user what backend/hosting they use before writing server code, or default to a self-contained Next.js API routes + a simple DB (e.g. Postgres via Prisma) if they have no preference, and say that's the assumption.
- Services referenced on the live site map closely to the "Service Library" examples in the original spec: Residential Waste Collection, Commercial Waste Management, Recycling Services, Dumpster & Bin Rental, Junk Removal, Construction Waste Removal, Hazardous Materials, plus moving services (Residential/Commercial Moving, Packing, Unpacking, Furniture Assembly, Office Relocation, Loading, Unloading, Storage, Vehicle/Heavy Equipment Moving). Seed the default service library with these real services, not generic examples.
