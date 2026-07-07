import { MOVING_BUSINESS } from "./business";

// ─── Navigation ───────────────────────────────────────────────────────────────

export const MOVING_NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const MOVING_NAV_CTA = {
  label: "Get Free Quote",
  href: "/contact#quote",
} as const;

export const MOVING_HEADER_CTA = {
  label: "Moving Services",
  href: MOVING_BUSINESS.siteUrl,
} as const;

export const MAIN_SITE_HEADER_CTA = {
  label: "Waste Solutions",
  href: MOVING_BUSINESS.mainSiteUrl,
} as const;

export const MOVING_PHONE_CTA = {
  label: "Call Today",
  href: `tel:${MOVING_BUSINESS.phoneRaw}`,
  display: MOVING_BUSINESS.phone,
} as const;

// ─── Service areas ─────────────────────────────────────────────────────────────

export const MOVING_SERVICE_AREAS = [
  "Durham",
  "Clarington",
  "Toronto",
  "Scarborough",
  "Vaughan",
] as const;

export const MOVING_SERVICE_AREAS_LINE = MOVING_SERVICE_AREAS.join(" · ");

export const MOVING_SERVICE_AREAS_HEADLINE = `Serving ${MOVING_SERVICE_AREAS_LINE}`;

export const MOVING_SERVICE_AREAS_SHORT = `${MOVING_SERVICE_AREAS.slice(0, -1).join(", ")} & ${MOVING_SERVICE_AREAS.at(-1)}`;

// ─── Service highlights (homepage strip) ──────────────────────────────────────

export const MOVING_SERVICE_STRIP = [
  "Residential",
  "Commercial",
  "Long-Distance",
  "Packing",
  "Loading",
  "Unloading",
  "Furniture Assembly",
] as const;

export const MOVING_VALUE_STRIP = ["Reliable", "Affordable", "Insured"] as const;

// ─── Services ─────────────────────────────────────────────────────────────────

export const MOVING_SERVICES = [
  {
    slug: "residential-moves",
    title: "Residential Moves",
    shortTitle: "Residential",
    description:
      "From studio apartments to full-family homes — careful packing, loading, and delivery with a team that treats your belongings like their own.",
    icon: "home",
    features: [
      "Apartments, condos & houses",
      "Furniture protection included",
      "Flexible scheduling",
      "Local & regional coverage",
    ],
  },
  {
    slug: "commercial-moves",
    title: "Commercial Moves",
    shortTitle: "Commercial",
    description:
      "Minimize downtime with efficient office and retail relocations. We coordinate moves around your business hours and handle equipment with care.",
    icon: "building",
    features: [
      "Office & retail relocations",
      "After-hours availability",
      "Equipment & desk moves",
      "Minimal business disruption",
    ],
  },
  {
    slug: "long-distance-moves",
    title: "Long-Distance Moves",
    shortTitle: "Long-Distance",
    description:
      "Moving across Ontario or beyond? We plan every leg of the journey so your items arrive safely, on schedule, and fully accounted for.",
    icon: "map",
    features: [
      "Ontario & inter-provincial",
      "Tracked shipments",
      "Coordinated delivery windows",
      "Full inventory support",
    ],
  },
  {
    slug: "packing-unpacking",
    title: "Packing & Unpacking",
    shortTitle: "Packing",
    description:
      "Full packing services using quality materials — or help with specific rooms. We label, protect, and unpack so you can settle in faster.",
    icon: "box",
    features: [
      "Full-home packing",
      "Fragile item specialists",
      "Unpack & placement help",
      "Supplies available on request",
    ],
  },
  {
    slug: "loading-unloading",
    title: "Loading & Unloading",
    shortTitle: "Load / Unload",
    description:
      "Already have a truck or container? Our crew handles the heavy lifting — efficient loading, secure strapping, and careful unloading at destination.",
    icon: "truck",
    features: [
      "Rental truck assistance",
      "POD & container loading",
      "Furniture-only jobs",
      "Same-day crew availability",
    ],
  },
  {
    slug: "furniture-assembly",
    title: "Furniture Assembly",
    shortTitle: "Assembly",
    description:
      "Disassembly before the move and professional reassembly at your new location. Beds, desks, shelving, and modular office furniture.",
    icon: "wrench",
    features: [
      "Disassembly & reassembly",
      "IKEA & flat-pack specialists",
      "Office workstation setup",
      "Tools & hardware included",
    ],
  },
] as const;

// ─── We Move With Care checklist ──────────────────────────────────────────────

export const MOVING_CARE_ITEMS = [
  "Local & Long-Distance Moves",
  "Packing & Unpacking Services",
  "Furniture Disassembly & Assembly",
  "Office Relocation",
  "Same-Day Service (Subject to Availability)",
] as const;

// ─── Why Choose Us ──────────────────────────────────────────────────────────────

export const MOVING_WHY_CHOOSE = [
  {
    title: "Experienced & Professional Team",
    description: "Trained movers who handle your belongings with care on every job.",
  },
  {
    title: "Reliable & On Time",
    description: "We respect your schedule and communicate clearly from quote to delivery.",
  },
  {
    title: "Affordable Pricing",
    description: "Competitive rates with transparent quotes — no surprise fees on moving day.",
  },
  {
    title: "Fully Insured",
    description: "Your items are protected throughout loading, transit, and unloading.",
  },
  {
    title: "Customer Satisfaction",
    description: "Your peace of mind is our priority — before, during, and after the move.",
  },
] as const;

// ─── Process steps ──────────────────────────────────────────────────────────────

export const MOVING_PROCESS = [
  {
    step: "01",
    title: "Request a Quote",
    description: "Tell us about your move online or by phone. We respond quickly with a clear estimate.",
  },
  {
    step: "02",
    title: "Schedule Your Move",
    description: "Pick a date and time that works. We confirm crew size, truck, and any packing needs.",
  },
  {
    step: "03",
    title: "We Pack & Load",
    description: "Our team arrives on time, protects your items, and loads everything securely.",
  },
  {
    step: "04",
    title: "Deliver & Settle In",
    description: "We unload, place furniture where you need it, and handle assembly if requested.",
  },
] as const;

// ─── Pricing tiers ────────────────────────────────────────────────────────────

export const MOVING_PRICING_TIERS = [
  {
    id: "local",
    name: "Local Move",
    description: "Ideal for moves within Durham, Clarington, Toronto, Scarborough, and Vaughan.",
    priceNote: "Starting from custom quote",
    features: [
      "Hourly or flat-rate options",
      "Truck & professional crew",
      "Furniture padding & blankets",
      "Basic disassembly included",
      "Same-week availability",
    ],
    cta: "Get Local Quote",
    featured: false,
  },
  {
    id: "full-service",
    name: "Full-Service Move",
    description: "Our most popular package — packing, loading, transport, and setup.",
    priceNote: "Best value for stress-free moves",
    features: [
      "Full packing & labeling",
      "Loading, transport & unloading",
      "Furniture disassembly & assembly",
      "Dedicated move coordinator",
      "Fully insured service",
    ],
    cta: "Book Full Service",
    featured: true,
  },
  {
    id: "commercial",
    name: "Commercial Move",
    description: "Office and business relocations with minimal downtime.",
    priceNote: "Tailored to your floor plan",
    features: [
      "After-hours & weekend moves",
      "IT & workstation handling",
      "Cubicle & desk relocation",
      "Multi-floor coordination",
      "Post-move cleanup option",
    ],
    cta: "Request Business Quote",
    featured: false,
  },
] as const;

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const MOVING_FAQS = [
  {
    question: "How far in advance should I book my move?",
    answer:
      "We recommend booking at least 2–3 weeks ahead for local moves and 4–6 weeks for long-distance or end-of-month dates. Same-day service may be available — call us to check crew availability.",
  },
  {
    question: "Do you provide packing materials?",
    answer:
      "Yes. We can supply boxes, tape, bubble wrap, and wardrobe cartons. Full packing services are available, or we can deliver supplies for you to pack yourself.",
  },
  {
    question: "Are my belongings insured during the move?",
    answer:
      "Yes. Citywide Moving Solutions is fully insured. Your items are protected from loading through delivery. Ask us about coverage details when you request your quote.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing depends on move size, distance, crew hours, packing needs, and access (stairs, elevators, parking). We provide a transparent written quote before any work begins — no hidden fees.",
  },
  {
    question: "Do you move pianos, safes, or specialty items?",
    answer:
      "We handle many specialty items including large furniture and appliances. For pianos, safes, or unusually heavy pieces, mention them when requesting a quote so we can assign the right equipment and crew.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve Durham, Clarington, Toronto, Scarborough, Vaughan, and surrounding Ontario communities. Long-distance moves across Ontario and beyond are also available.",
  },
  {
    question: "Can you help with office relocations?",
    answer:
      "Absolutely. We specialize in commercial moves with flexible scheduling — including evenings and weekends — to keep your business running with minimal disruption.",
  },
  {
    question: "What should I do to prepare for moving day?",
    answer:
      "Reserve parking for our truck if possible, disconnect appliances ahead of time, and set aside valuables and important documents to move yourself. Our team will handle the rest.",
  },
] as const;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const MOVING_TESTIMONIALS = [
  {
    id: 1,
    name: "Jennifer L.",
    role: "Homeowner, Vaughan",
    rating: 5,
    text: "Citywide made our family move completely stress-free. The crew was professional, careful with our furniture, and finished ahead of schedule.",
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Office Manager, Toronto",
    rating: 5,
    text: "We relocated our entire office over a weekend. Everything was labeled, moved, and set up by Monday morning. Couldn't ask for better service.",
  },
  {
    id: 3,
    name: "Priya K.",
    role: "Condo Resident, Scarborough",
    rating: 5,
    text: "From quote to delivery, communication was excellent. They handled our elevator booking and protected every piece. Highly recommend.",
  },
] as const;

// ─── Stats ────────────────────────────────────────────────────────────────────

export const MOVING_STATS = [
  { value: "500+", label: "Moves Completed" },
  { value: "98%", label: "On-Time Arrival" },
  { value: "5★", label: "Customer Rating" },
  { value: "10+", label: "Years Experience" },
] as const;

// ─── Contact info rows ────────────────────────────────────────────────────────

export const MOVING_CONTACT_INFO = [
  {
    kind: "phone" as const,
    label: "Phone",
    value: MOVING_BUSINESS.phone,
    href: `tel:${MOVING_BUSINESS.phoneRaw}`,
  },
  {
    kind: "whatsapp" as const,
    label: "WhatsApp",
    value: MOVING_BUSINESS.phone,
    href: MOVING_BUSINESS.social.whatsapp,
  },
  {
    kind: "email" as const,
    label: "Email",
    value: MOVING_BUSINESS.email,
    href: `mailto:${MOVING_BUSINESS.email}`,
  },
  {
    kind: "hours" as const,
    label: "Hours",
    value: MOVING_BUSINESS.hours.weekdays,
    href: null,
  },
] as const;

// ─── Main site homepage promo ───────────────────────────────────────────────────

export const MOVING_HOMEPAGE_PROMO = {
  eyebrow: "Citywide Moving Solutions",
  title: "Moving Services From the Team You Already Trust",
  intro:
    "Citywide Moving Solutions is part of Citywide Waste & Moving Solutions — the same professional, reliable crew serving homes and businesses across the GTA and Durham Region. Whether you're relocating locally or need full-service packing and delivery, we handle every move with the same care and accountability you expect from Citywide.",
  highlights: [
    "Residential & commercial moves",
    "Local and long-distance service",
    "Packing, loading, and furniture assembly",
    "Fully insured — reliable, affordable, on time",
  ],
  cta: "Visit Citywide Moving Solutions",
} as const;
