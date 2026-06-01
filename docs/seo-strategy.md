# Citywide Waste Solutions — SEO Strategy

## Target Keyword Matrix

### Tier 1 — High Priority (Primary service + city combos)

| Keyword                              | Monthly Volume | Difficulty | Page                                   |
| ------------------------------------ | -------------- | ---------- | -------------------------------------- |
| waste collection Vaughan             | 480            | Low        | /service-areas/vaughan                 |
| junk removal Toronto                 | 2,400          | Medium     | /service-areas/toronto                 |
| dumpster rental Brampton             | 390            | Low        | /service-areas/brampton                |
| waste collection Mississauga         | 590            | Low        | /service-areas/mississauga             |
| recycling services Ontario           | 720            | Medium     | /services/recycling-services           |
| construction waste removal Ontario   | 320            | Low        | /services/construction-waste-removal   |
| residential waste collection Ontario | 880            | Low        | /services/residential-waste-collection |
| commercial waste management Ontario  | 540            | Low        | /services/commercial-waste-management  |
| bin rental Ontario                   | 1,200          | Medium     | /services/dumpster-bin-rental          |

### Tier 2 — Supporting (Long-tail, blog, FAQ targets)

| Keyword                                       | Page / Content Type           |
| --------------------------------------------- | ----------------------------- |
| how to dispose of construction debris Ontario | Blog post                     |
| what can be recycled in Ontario               | /recycling                    |
| waste collection schedule Courtice            | /service-areas/courtice       |
| junk removal same day Toronto                 | /services/junk-removal        |
| how much does bin rental cost Ontario         | /pricing                      |
| eco-friendly waste disposal Ontario           | Homepage / About              |
| residential garbage pickup Vaughan            | /service-areas/vaughan        |
| commercial dumpster rental GTA                | /services/dumpster-bin-rental |

---

## On-Page SEO Templates

### Service Page Title Template

`{Service Name} in {City/Ontario} | Citywide Waste Solutions`

**Examples:**

- "Junk Removal in Toronto | Citywide Waste Solutions"
- "Dumpster Rental in Brampton | Citywide Waste Solutions"

### Service Page Meta Description Template

`Professional {service} across {city/Ontario}. {Key benefit}. Serving Durham, Scarborough, Vaughan & Toronto. Get your free quote today.`

### City Page Title Template

`Waste Collection & Recycling in {City}, Ontario | Citywide Waste Solutions`

### City Page Meta Description Template

`Reliable waste collection, junk removal & recycling services in {City}, Ontario. Local crews, on-time pickups, transparent pricing. Free quote — no commitment.`

---

## JSON-LD Schemas — Implementation Checklist

- [x] LocalBusiness — root layout (all pages)
- [x] Service — each /services/[slug] page
- [x] LocalBusiness (city-specific) — each /service-areas/[slug] page
- [x] Article — each /blog/[slug] page
- [x] FAQPage — service pages with FAQs (via buildFaqSchema helper)
- [x] BreadcrumbList — service + blog pages (via buildBreadcrumbSchema helper)
- [ ] AggregateRating — add after collecting 10+ Google reviews

---

## Google Business Profile (GBP) Optimization

### NAP Consistency (must match exactly across all platforms)

- **Name:** Citywide Waste Solutions
- **Address:** Prestonvale Road, Courtice, Ontario L1E 0A1
- **Phone:** +1 (905) 000-0000

### GBP Checklist

- [ ] Claim and verify listing at business.google.com
- [ ] Set primary category: "Waste Management Service"
- [ ] Add secondary categories: "Junk Removal Service", "Recycling Center", "Dumpster Rental Service"
- [ ] Upload 10+ photos: trucks, team, before/after cleanouts, recycling operations
- [ ] Add all 6 services with descriptions and prices
- [ ] Write a 750-character business description with primary keywords
- [ ] Set up Q&A section with pre-answered common questions
- [ ] Enable messaging
- [ ] Add booking link: https://citywidewastesolutions.ca/contact#quote
- [ ] Post weekly updates (seasonal tips, promotions, completed projects)
- [ ] Respond to every review within 24 hours

### Review Acquisition Strategy

1. After pickup completion SMS includes review link
2. Follow-up email 3 days after service completion
3. QR code on invoice linking to GBP review page
4. Staff reminder to mention reviews on satisfied jobs

---

## Content Calendar — Blog (First 30 Days)

| Week | Title                                                   | Category          | Target Keyword                      |
| ---- | ------------------------------------------------------- | ----------------- | ----------------------------------- |
| 1    | 10 Ways to Reduce Household Waste in Ontario            | Recycling Tips    | reduce household waste Ontario      |
| 1    | Complete Guide: Construction Debris Disposal in Ontario | Waste Reduction   | construction waste disposal Ontario |
| 2    | What Happens to Your Recycling After Pickup?            | Environmental     | recycling process Ontario           |
| 2    | Spring Cleanout Checklist for Ontario Homeowners        | Seasonal Tips     | spring cleanout Toronto             |
| 3    | The Real Cost of Dumpster Rental in the GTA             | Waste Reduction   | dumpster rental cost GTA            |
| 3    | 7 Items You Didn't Know Could Be Recycled               | Recycling Tips    | what can be recycled Ontario        |
| 4    | Commercial Waste Management: A Guide for GTA Businesses | Environmental     | commercial waste management GTA     |
| 4    | Courtice Community Cleanup 2024 Recap                   | Community Cleanup | community cleanup Courtice          |

---

## Technical SEO Checklist

### Core Infrastructure

- [x] HTTPS enforced (Cloudflare SSL)
- [x] www → non-www canonical redirect
- [x] robots.txt — /robots.ts (blocks admin, API, studio)
- [x] sitemap.xml — /sitemap.ts (dynamic, includes blog + service pages)
- [x] RSS feed — /feed.xml (for blog aggregators)
- [x] Web app manifest — /site.webmanifest

### Performance (PageSpeed Targets: Mobile 90+, Desktop 95+)

- [x] next/image with WebP/AVIF + lazy loading
- [x] Font subsetting via next/font (Plus Jakarta Sans)
- [x] ISR (Incremental Static Regeneration) on blog + service pages
- [x] Edge caching via Cloudflare + Vercel Edge Network
- [x] Preconnect hints in <head> for Google Fonts, Maps, Sanity CDN
- [x] Security headers (X-Frame-Options, CSP, HSTS)
- [ ] Bundle analysis: run `npm run analyze` pre-launch and reduce chunks > 250kb
- [ ] Core Web Vitals: audit LCP, CLS, INP with Chrome DevTools
- [ ] Image optimization: audit all hero images, compress to < 200kb

### Indexing

- [ ] Submit sitemap.xml to Google Search Console
- [ ] Submit sitemap.xml to Bing Webmaster Tools
- [ ] Verify site in Google Search Console (DNS TXT record)
- [ ] Request indexing for all key pages after launch
- [ ] Monitor coverage report weekly for crawl errors

### Structured Data Validation

- [ ] Test all JSON-LD schemas at schema.org/SchemaApp validator
- [ ] Test rich results at search.google.com/test/rich-results
- [ ] Check for FAQPage rich results on service pages

---

## Link Building Strategy

### Local Citations (Priority order)

1. Google Business Profile ✓
2. Bing Places for Business
3. Apple Maps Connect
4. Yelp for Business
5. Yellow Pages Canada
6. HomeStars (key for Ontario contractors)
7. Houzz (renovation/construction audience)
8. BBB (Better Business Bureau Canada)
9. Angi (formerly Angie's List)
10. LocalStack / Yext for citation management

### Content-Based Link Building

- Guest posts on Ontario home improvement blogs
- Partnerships with Courtice / Durham Region local news
- LEED/green building resource pages (link from recycling guide)
- Ontario municipality recycling resource pages

---

## Monthly SEO Reporting KPIs

| Metric                              | Tool                    | Target           |
| ----------------------------------- | ----------------------- | ---------------- |
| Organic sessions                    | Google Analytics 4      | +20% MoM         |
| Keyword rankings (Tier 1)           | Google Search Console   | Top 5 within 6mo |
| GBP calls & direction requests      | Google Business Profile | +10% MoM         |
| Core Web Vitals (LCP)               | Search Console / CrUX   | < 2.5s           |
| Quote form conversions from organic | GA4 Goals               | 5%+ CVR          |
| Blog organic traffic                | GA4                     | +15% MoM         |
| Backlinks acquired                  | Ahrefs / GSC            | 5+ new/month     |
