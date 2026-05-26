/** Core business data — no React/icon imports (safe for server & client). */
export const SITE_URL = "https://citywidewastesolutions.ca";

export const BUSINESS = {
  name:       "Citywide Waste Solutions",
  legalName: "CITYWIDE WASTE SOLUTIONS",
  shortName:  "Citywide",
  tagline:    "Cleaner City. Better Tomorrow.",
  siteUrl:    SITE_URL,
  owner:      "Walter Quelleng",
  businessNumber: "716988035TZ0002",
  bin:        "1001615565",
  naics: {
    code:  "562210",
    label: "Waste Treatment and Disposal",
    full:  "562210 — Waste Treatment and Disposal",
  },
  phone:      "(416) 558-6718",
  phoneRaw:   "+14165586718",
  email:      "wastesolutions80@gmail.com",
  address: {
    street: "2246 Prestonvale Road",
    city:   "Courtice",
    province: "Ontario",
    postal: "L1E 3H8",
    country: "Canada",
    full:   "2246 Prestonvale Road, Courtice, Ontario L1E 3H8, Canada",
  },
  hours: {
    weekdays:  "Mon – Fri: 7:00 AM – 6:00 PM",
    saturday:  "Saturday: 8:00 AM – 2:00 PM",
    sunday:    "Sunday: Closed",
  },
  social: {
    facebook:  "https://www.facebook.com/citywidewastesolutions",
    instagram: "https://www.instagram.com/citywidewastesolutions",
    linkedin:  "https://www.linkedin.com/company/citywide-waste-solutions",
    whatsapp:  "https://wa.me/14165586718",
  },
  coords: { lat: 43.9167, lng: -78.7667 },
} as const;
