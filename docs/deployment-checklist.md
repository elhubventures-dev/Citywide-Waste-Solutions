# Citywide Waste Solutions — Deployment Checklist

## Phase A — Pre-Launch Setup

### 1. Environment & Secrets
- [ ] Create Vercel project → link GitHub repo
- [ ] Add all `.env.example` variables to Vercel Environment Variables
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET`
  - [ ] `SANITY_API_TOKEN` + `SANITY_WEBHOOK_SECRET`
  - [ ] `DATABASE_URL` (Supabase connection string)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_WEBHOOK_SECRET`
  - [ ] `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_PHONE_NUMBER`
  - [ ] `RESEND_API_KEY` + `EMAIL_FROM` + `EMAIL_ADMIN`
  - [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - [ ] `NEXT_PUBLIC_GA_ID`
  - [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`
  - [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `GHL_API_KEY` + `GHL_LOCATION_ID`
  - [ ] `CRON_SECRET` (random 32-char string for cron auth)

### 2. Database (Supabase)
- [ ] Create Supabase project in `ca-central-1` region (Canada)
- [ ] Run `npm run db:push` to apply Prisma schema
- [ ] Enable Row Level Security on all tables
- [ ] Set up Supabase backups (daily, 30-day retention)
- [ ] Test connection string from local env

### 3. Sanity CMS
- [ ] Create Sanity project at sanity.io
- [ ] Copy Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] Run `npm run sanity:build` to verify Studio compiles
- [ ] Set up Sanity webhook:
  - URL: `https://citywidewastesolutions.ca/api/revalidate`
  - Secret: value of `SANITY_WEBHOOK_SECRET`
  - Trigger: on publish/unpublish
- [ ] Populate initial content:
  - [ ] Site Settings singleton
  - [ ] All 6 services (copy from constants.ts)
  - [ ] All 5 service areas (copy from constants.ts)
  - [ ] All 3 pricing tiers
  - [ ] 5–10 FAQs
  - [ ] 5 testimonials
  - [ ] 1–3 initial blog posts

### 4. Third-Party Services
- [ ] **Stripe:**
  - [ ] Activate live mode account
  - [ ] Add webhook endpoint: `https://citywidewastesolutions.ca/api/stripe/webhook`
  - [ ] Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
  - [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`
  - [ ] Create test invoice in DB and run end-to-end payment test
- [ ] **Twilio:**
  - [ ] Purchase Canadian phone number in Courtice area code (905)
  - [ ] Verify sender compliance for Canadian SMS
  - [ ] Test quote confirmation SMS
- [ ] **Resend:**
  - [ ] Add and verify domain `citywidewastesolutions.ca`
  - [ ] Set up SPF and DKIM DNS records
  - [ ] Send test confirmation email
- [ ] **GoHighLevel:**
  - [ ] Create pipeline "Website Leads" with stages:
    - New Quote → Contacted → Quote Sent → Scheduled → Completed
  - [ ] Copy pipeline and stage IDs → env vars
  - [ ] Test form submission → GHL contact sync
- [ ] **Google reCAPTCHA:**
  - [ ] Create v3 site at google.com/recaptcha
  - [ ] Add domain `citywidewastesolutions.ca`
  - [ ] Copy keys → env vars
- [ ] **Upstash Redis:**
  - [ ] Create Redis database (Global, closest to `ca-central-1`)
  - [ ] Copy REST URL + token → env vars

### 5. Cloudflare
- [ ] Add site to Cloudflare (change nameservers at registrar)
- [ ] Wait for propagation (up to 48h, usually < 2h)
- [ ] Set SSL mode: Full (Strict)
- [ ] Enable HSTS
- [ ] Create Cache Rules (see docs/cloudflare-setup.md)
- [ ] Create WAF rules for rate limiting and bot blocking
- [ ] Enable Brotli, HTTP/2, HTTP/3

---

## Phase B — Launch Day

### Build & Deploy
- [ ] Run `npm run type-check` — 0 TypeScript errors
- [ ] Run `npm run lint` — 0 ESLint errors
- [ ] Run `npm run build` locally — builds successfully
- [ ] Run `npm run analyze` — no chunks > 500kb
- [ ] Push to `main` branch → Vercel auto-deploys
- [ ] Check Vercel deployment log — no build errors
- [ ] Check Vercel Function logs — no runtime errors

### Domain Setup
- [ ] Add custom domain `citywidewastesolutions.ca` in Vercel project settings
- [ ] Add `www.citywidewastesolutions.ca` → redirect to apex
- [ ] Verify SSL certificate provisioned in Vercel

### Smoke Testing (manual, every page)
- [ ] Homepage loads, all sections render, stats show
- [ ] Navigation: all links work on desktop + mobile drawer
- [ ] Each of 6 service pages: loads, FAQ accordion works, quote form visible
- [ ] Each of 5 city pages: loads, map shows, quote form works
- [ ] /pricing: all 3 tier cards visible, CTAs link to /contact#quote
- [ ] /recycling: materials grid loads, schedule table renders
- [ ] /about: all sections load
- [ ] /blog: posts list (or empty state)
- [ ] /contact: both forms (Quote + Contact) submit successfully
- [ ] /pay: invoice lookup returns 404 for bad invoice, payment flow works end-to-end
- [ ] /studio: Sanity Studio loads and is editable
- [ ] /admin/dashboard: submissions table loads
- [ ] /sitemap.xml: renders valid XML
- [ ] /robots.txt: correct allow/disallow rules
- [ ] /feed.xml: valid RSS output

### Form & Integration Tests
- [ ] Submit quote form → confirm DB record created
- [ ] Submit quote form → confirm customer email received
- [ ] Submit quote form → confirm admin notification email received
- [ ] Submit quote form (smsOptIn=true) → confirm SMS received on test number
- [ ] Submit quote form → confirm GHL contact created
- [ ] Submit contact form → confirm emails both ways
- [ ] Pay invoice (test mode Stripe) → confirm webhook fires, invoice status = COMPLETED
- [ ] Revalidation webhook: publish a Sanity post → confirm blog page updates

### Performance Audit
- [ ] Run Lighthouse on homepage (target: 90+/90+/100/100)
- [ ] Run Lighthouse on /services/residential-waste-collection
- [ ] Run Lighthouse on /blog (or a blog post)
- [ ] Check Core Web Vitals in Chrome DevTools (LCP < 2.5s, CLS < 0.1)
- [ ] Test on real mobile device (iOS Safari + Android Chrome)

---

## Phase C — Post-Launch (Week 1)

### SEO & Analytics
- [ ] Verify site in Google Search Console
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Submit sitemap.xml to Bing Webmaster Tools
- [ ] Set up GA4 goals: quote form submissions, contact form submissions, invoice payments
- [ ] Verify GA4 receiving data (realtime view)
- [ ] Claim/update Google Business Profile
- [ ] Test GBP click-to-call and direction links

### Monitoring
- [ ] Set up Vercel Analytics (enable in project settings)
- [ ] Set up Vercel Speed Insights
- [ ] Configure uptime monitoring (e.g. Better Uptime, UptimeRobot) for:
  - `https://citywidewastesolutions.ca`
  - `https://citywidewastesolutions.ca/api/quote` (POST ping)
- [ ] Set up Sentry or LogRocket for error tracking (add to layout.tsx)
- [ ] Set alert thresholds: > 5 errors/hour → email + Slack notification

### Content
- [ ] Publish first 2 blog posts in Sanity Studio
- [ ] Update pricing tiers if different from placeholders
- [ ] Add real phone number and business hours
- [ ] Upload og-image.jpg (1200×630px, brand-consistent)
- [ ] Upload favicon.ico, icon-16.png, icon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png

---

## Maintenance Schedule

| Frequency | Task                                              |
|-----------|---------------------------------------------------|
| Daily     | Review new form submissions in /admin/dashboard   |
| Weekly    | Publish 1–2 blog posts via Sanity Studio          |
| Weekly    | Monitor Google Search Console for crawl errors    |
| Monthly   | Run PageSpeed audit and fix regressions           |
| Monthly   | Review Vercel function error logs                 |
| Monthly   | Rotate Stripe webhook secret if any breach        |
| Quarterly | Update npm dependencies (`npm audit fix`)         |
| Quarterly | Review and refresh GBP photos and posts           |
