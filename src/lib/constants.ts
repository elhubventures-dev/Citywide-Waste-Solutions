export { BUSINESS, SITE_URL } from "./business";
import { BUSINESS } from "./business";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Residential Waste Collection", href: "/services/residential-waste-collection" },
      { label: "Commercial Waste Management",  href: "/services/commercial-waste-management" },
      { label: "Recycling Services",           href: "/services/recycling-services" },
      { label: "Dumpster & Bin Rental",        href: "/services/dumpster-bin-rental" },
      { label: "Junk Removal",                 href: "/services/junk-removal" },
      { label: "Construction Waste Removal",   href: "/services/construction-waste-removal" },
    ],
  },
  { label: "Service Areas",  href: "/service-areas" },
  { label: "Recycling Info", href: "/recycling" },
  { label: "Pricing",        href: "/pricing" },
  { label: "About",          href: "/about" },
  { label: "Blog",           href: "/blog" },
] as const;

export const NAV_CTA = {
  label: "Get Free Quote",
  href:  "/contact#quote",
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    slug:        "residential-waste-collection",
    title:       "Residential Waste Collection",
    shortTitle:  "Residential",
    description: "Reliable curbside and bin pickup for homes across Ontario. Weekly, bi-weekly, or custom schedules tailored to your household needs.",
    color:       "green",
    price:       "From $30/month",
    features: [
      "Weekly & bi-weekly pickup options",
      "Oversized item collection",
      "Scheduled pickup reminders",
      "Eco-conscious disposal",
    ],
  },
  {
    slug:        "commercial-waste-management",
    title:       "Commercial Waste Management",
    shortTitle:  "Commercial",
    description: "Scalable waste solutions for offices, restaurants, retail, and industrial sites. Compliance, reliability, and transparent reporting.",
    color:       "blue",
    price:       "Custom Quote",
    features: [
      "Flexible contract terms",
      "Compliance documentation",
      "Dedicated account manager",
      "Multi-location support",
    ],
  },
  {
    slug:        "recycling-services",
    title:       "Recycling Services",
    shortTitle:  "Recycling",
    description: "Comprehensive recycling programs for paper, plastics, metals, electronics, and organics. We make sustainability simple.",
    color:       "earth",
    price:       "From $25/month",
    features: [
      "Multi-stream recycling",
      "Electronics recycling (e-waste)",
      "Organics composting",
      "Recycling audits",
    ],
  },
  {
    slug:        "dumpster-bin-rental",
    title:       "Dumpster & Bin Rental",
    shortTitle:  "Bin Rental",
    description: "Available in multiple sizes for home renovations, cleanouts, and construction. Fast delivery and flexible rental periods.",
    color:       "green",
    price:       "From $150/day",
    features: [
      "10, 14, 20 & 30 yard bins",
      "Next-day delivery available",
      "Flexible rental periods",
      "Prompt pickup on completion",
    ],
  },
  {
    slug:        "junk-removal",
    title:       "Junk Removal",
    shortTitle:  "Junk Removal",
    description: "Full-service junk hauling for homes and businesses. Our crew does all the heavy lifting — you just point to what goes.",
    color:       "blue",
    price:       "From $80",
    features: [
      "Same-day availability",
      "Full interior removal",
      "Furniture & appliances",
      "Responsible disposal",
    ],
  },
  {
    slug:        "construction-waste-removal",
    title:       "Construction Waste Removal",
    shortTitle:  "Construction",
    description: "Efficient debris removal for renovation and construction sites. Concrete, lumber, drywall, and mixed load removal at competitive rates.",
    color:       "earth",
    price:       "Custom Quote",
    features: [
      "Concrete & rubble removal",
      "Renovation debris hauling",
      "Site cleanup crews",
      "LEED-compliant disposal",
    ],
  },
] as const;

// ─── Service Areas ─────────────────────────────────────────────────────────────
export const SERVICE_AREAS = [
  {
    slug:  "vaughan",
    name:  "Vaughan",
    desc:  "Comprehensive waste collection, recycling, and junk removal across all Vaughan neighbourhoods.",
    pop:   "350,000+",
    coords: { lat: 43.8361, lng: -79.4983 },
  },
  {
    slug:  "toronto",
    name:  "Toronto",
    desc:  "Serving Toronto homes and businesses from Etobicoke to Scarborough with reliable waste solutions.",
    pop:   "2.9 million+",
    coords: { lat: 43.6532, lng: -79.3832 },
  },
  {
    slug:  "brampton",
    name:  "Brampton",
    desc:  "Fast, affordable waste and recycling services for Brampton's growing residential and commercial base.",
    pop:   "640,000+",
    coords: { lat: 43.7315, lng: -79.7624 },
  },
  {
    slug:  "mississauga",
    name:  "Mississauga",
    desc:  "Full-service waste management for Mississauga — from Port Credit to Malton and everywhere between.",
    pop:   "720,000+",
    coords: { lat: 43.5890, lng: -79.6441 },
  },
  {
    slug:  "courtice",
    name:  "Courtice",
    desc:  "Our home base. We know Courtice like the back of our hand — fast local service, no surprises.",
    pop:   "35,000+",
    coords: { lat: 43.9167, lng: -78.7667 },
  },
] as const;

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const PRICING_TIERS = [
  {
    id:          "residential",
    name:        "Residential",
    price:       30,
    period:      "/month",
    description: "Perfect for homeowners wanting reliable, scheduled collection.",
    features: [
      "Weekly or bi-weekly pickup",
      "One standard bin included",
      "Pickup reminders via SMS",
      "Recyclables separated",
      "Friendly, on-time service",
    ],
    cta:      "Get Started",
    href:     "/contact#quote",
    featured: false,
    color:    "green",
  },
  {
    id:          "junk",
    name:        "Junk Removal",
    price:       80,
    period:      " starting",
    description: "One-time or recurring junk hauling for any size job.",
    features: [
      "Same-day options available",
      "Full crew does the work",
      "Furniture, appliances, debris",
      "Responsible sorting & recycling",
      "No hidden fees",
    ],
    cta:      "Book Now",
    href:     "/contact#quote",
    featured: true,
    color:    "blue",
  },
  {
    id:          "dumpster",
    name:        "Dumpster Rental",
    price:       150,
    period:      "/day",
    description: "Flexible bin rental for renovations, cleanouts, and construction.",
    features: [
      "10, 14, 20 & 30 yard bins",
      "Next-day delivery",
      "Flexible rental terms",
      "Mixed load accepted",
      "Prompt pickup on request",
    ],
    cta:      "Reserve a Bin",
    href:     "/contact#quote",
    featured: false,
    color:    "earth",
  },
] as const;

// ─── Who We Are (homepage) ────────────────────────────────────────────────────
export const WHO_WE_ARE = {
  eyebrow:      "Who We Are",
  title:        "Your Partner in Responsible Waste Disposal",
  sustainability: "Sustainability Comes Full Circle",
  intro:
    "Since 2014, Citywide Waste Solutions has delivered reliable, affordable, and eco-friendly waste management across the GTA and Durham Region. From our home base in Courtice, we help homes, businesses, and job sites stay clean while keeping as much material out of landfill as possible.",
  mission:
    "We are committed to environmentally responsible waste management tailored to every sector — with professional crews, transparent pricing, and solutions that keep Ontario communities cleaner.",
} as const;

export const SERVICE_PILLARS = [
  {
    icon:  "♻️",
    title: "Recycling",
    desc:  "Recycle today for a cleaner, greener, and healthier tomorrow. Paper, plastics, metals, organics, and e-waste handled responsibly.",
    href:  "/recycling",
  },
  {
    icon:  "🗑️",
    title: "Waste Services",
    desc:  "Reliable collection and disposal for homes, businesses, and construction sites — safe, efficient, and eco-conscious every pickup.",
    href:  "/services/residential-waste-collection",
  },
] as const;

export const CLIENT_TYPES = [
  "Residential homeowners",
  "Commercial establishments",
  "Industrial facilities",
  "Construction & renovation sites",
  "Schools & institutions",
  "Retail & supermarkets",
  "Property managers & landlords",
  "Municipal & community programs",
] as const;

/** Supplementary “why choose us” bullets — additive to TRUST_POINTS */
export const WHY_US_HIGHLIGHTS = [
  "Over 10 years of industry expertise across Ontario",
  "Professional, timely, and trusted service on every route",
  "Wide range of bin and dumpster sizes for every project",
  "Curbside placement guidance and permit support where required",
  "Eco-friendly disposal and recycling on every job",
  "Competitive and transparent pricing — no surprise fees",
] as const;

/** Detailed service blurbs — maps to existing service pages */
export const SPECIALIZED_SOLUTIONS = [
  {
    title:       "Municipal & Residential Waste Collection",
    description:
      "Efficient collection and disposal of everyday household and community waste, ensuring cleaner neighbourhoods and healthier living spaces.",
    href:        "/services/residential-waste-collection",
  },
  {
    title:       "Construction & Demolition Waste",
    description:
      "Safe collection and recycling of rubble, concrete, lumber, drywall, and mixed construction debris — helping contractors maintain clean, compliant sites.",
    href:        "/services/construction-waste-removal",
  },
  {
    title:       "Wood Waste Recycling",
    description:
      "Sustainable recycling of wood waste from renovations and job sites to reduce landfill impact and support eco-friendly reuse.",
    href:        "/services/recycling-services",
  },
  {
    title:       "Paper, Plastics & Metal Recycling",
    description:
      "Comprehensive recycling of paper, plastics, and metals to conserve resources and support a circular economy across Ontario.",
    href:        "/services/recycling-services",
  },
] as const;

// ─── Trust Indicators ─────────────────────────────────────────────────────────
export const TRUST_POINTS = [
  {
    icon:  "🛡️",
    title: "Professional Handling",
    desc:  "Trained, uniformed crews with full insurance coverage on every job.",
  },
  {
    icon:  "💰",
    title: "Affordable Pricing",
    desc:  "Transparent pricing with no surprise fees. Get your quote upfront.",
  },
  {
    icon:  "⚡",
    title: "Fast Pickup",
    desc:  "Same-day and next-day availability. We show up when we say we will.",
  },
  {
    icon:  "🌱",
    title: "Eco-Conscious Disposal",
    desc:  "We maximize recycling and minimize landfill impact on every job.",
  },
  {
    icon:  "😊",
    title: "Friendly Support",
    desc:  "Real people answering calls and messages — no bots, no runaround.",
  },
] as const;

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id:     1,
    name:   "Sarah M.",
    role:   "Homeowner, Vaughan",
    rating: 5,
    text:   "Switched to Citywide after years of inconsistent service. Night and day difference — they show up on time every single week. Love the SMS reminders too.",
  },
  {
    id:     2,
    name:   "David K.",
    role:   "Restaurant Owner, Toronto",
    rating: 5,
    text:   "Running a busy restaurant means reliable waste pickup is non-negotiable. Citywide has never let us down. Their commercial plans are flexible and fairly priced.",
  },
  {
    id:     3,
    name:   "James R.",
    role:   "General Contractor, Brampton",
    rating: 5,
    text:   "We use them for construction site cleanups on every project. Fast, competitive on price, and the crews work hard. My go-to recommendation for any contractor in the GTA.",
  },
  {
    id:     4,
    name:   "Linda P.",
    role:   "Property Manager, Mississauga",
    rating: 5,
    text:   "Managing multiple properties means I need vendors I can trust. Citywide handles three of my buildings without a single complaint from tenants.",
  },
  {
    id:     5,
    name:   "Mike T.",
    role:   "Homeowner, Courtice",
    rating: 5,
    text:   "Had a big basement cleanout — called on Monday, they were there Tuesday morning. Three guys, done in two hours. Honestly impressive.",
  },
  {
    id:     6,
    name:   "Alex R.",
    role:   "Contractor, Toronto",
    rating: 5,
    text:   "Professional, quick, and cost-effective! Citywide made our construction cleanup hassle-free. Bins arrived on time and pickup was prompt.",
  },
  {
    id:     7,
    name:   "Priya S.",
    role:   "Residential Client, Mississauga",
    rating: 5,
    text:   "Reliable service with excellent customer support. Scheduling was easy and the crew was friendly. Highly recommended for any household.",
  },
] as const;

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: "10+",  label: "Years in Business" },
  { value: "5k+",  label: "Happy Customers" },
  { value: "98%",  label: "On-Time Pickup Rate" },
  { value: "50%+", label: "Waste Diverted from Landfill" },
] as const;

// ─── Blog Categories ──────────────────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  { slug: "recycling-tips",          label: "Recycling Tips" },
  { slug: "waste-reduction",         label: "Waste Reduction" },
  { slug: "community-cleanup",       label: "Community Cleanup" },
  { slug: "environmental-awareness", label: "Environmental Awareness" },
  { slug: "seasonal-tips",           label: "Seasonal Tips" },
] as const;

// ─── Contact rows (icons mapped in contact page) ─────────────────────────────
export const CONTACT_INFO = [
  { kind: "phone",    label: "Phone",    value: BUSINESS.phone,        href: `tel:${BUSINESS.phoneRaw}` },
  { kind: "whatsapp", label: "WhatsApp", value: BUSINESS.phone,        href: BUSINESS.social.whatsapp },
  { kind: "email",    label: "Email",    value: BUSINESS.email,        href: `mailto:${BUSINESS.email}` },
  { kind: "address",  label: "Address",  value: BUSINESS.address.full, href: "https://maps.google.com/?q=2246+Prestonvale+Road+Courtice+Ontario" },
  { kind: "hours",    label: "Hours",    value: BUSINESS.hours.weekdays, href: null },
] as const;
