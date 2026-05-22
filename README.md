# Citywide Waste Solutions — Website Platform

Production-grade website for a professional Ontario waste collection and recycling company.

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Next.js 14 (App Router) + TypeScript    |
| Styling     | Tailwind CSS + shadcn/ui + Framer Motion|
| Database    | PostgreSQL via Supabase + Prisma ORM    |
| CMS         | Sanity v3                               |
| Payments    | Stripe                                  |
| SMS         | Twilio                                  |
| Email       | Resend                                  |
| Auth        | Clerk                                   |
| Hosting     | Vercel + Cloudflare CDN                 |
| CRM         | GoHighLevel                             |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up the database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to Supabase
```

### 4. Run development server
```bash
npm run dev
```

### 5. Run Sanity Studio (separate terminal)
```bash
npm run sanity:dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Homepage
│   ├── about/
│   ├── services/
│   │   └── [slug]/         # Dynamic service pages
│   ├── service-areas/
│   │   └── [slug]/         # Dynamic city pages
│   ├── pricing/
│   ├── recycling/
│   ├── blog/
│   │   └── [slug]/         # Dynamic blog posts
│   ├── contact/
│   └── api/                # API routes
│       ├── quote/
│       └── contact/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Header, Footer, Navigation
│   ├── sections/           # Page sections (Hero, Services, etc.)
│   └── forms/              # Quote form, Contact form
├── lib/
│   ├── utils.ts            # cn() and helper functions
│   ├── constants.ts        # Site data (services, areas, pricing)
│   └── ...
├── hooks/                  # Custom React hooks
├── styles/
│   └── globals.css         # Tailwind + CSS custom properties
└── types/
    └── index.ts            # All TypeScript types
prisma/
└── schema.prisma           # Database schema
sanity/
├── schemas/                # Content schemas
└── lib/                    # Sanity client + queries
```

## Build Phases

- [x] **Phase 1** — Project scaffold, design system, types, DB schema
- [ ] **Phase 2** — Core pages (Home, Services, Areas, Pricing, Recycling, Contact)
- [ ] **Phase 3** — Backend, forms, Stripe, Twilio, CRM automation
- [ ] **Phase 4** — Sanity CMS, blog system, admin panel
- [ ] **Phase 5** — SEO, performance, Vercel deployment

## Brand Colors

| Name         | Hex       |
|--------------|-----------|
| Forest Green | `#1B6B3A` |
| Deep Blue    | `#1A4A7A` |
| Earth Tone   | `#6B4226` |
| Off White    | `#F8FAF9` |

## Services

- Residential Waste Collection
- Commercial Waste Management
- Recycling Services
- Dumpster & Bin Rental
- Junk Removal
- Construction Waste Removal

## Service Areas

Vaughan · Toronto · Brampton · Mississauga · Courtice
