// ─── Invoice Constants ───────────────────────────────────────────────────────
// Citywide Waste Solutions — real services, brand defaults, status config

import type { InvoiceClient, InvoiceMeta, InvoiceStatus, ServiceLibraryItem } from "@/types/invoice";

// ─── Service Library (seeded from branding.md — real Citywide services) ──────

export const SERVICE_LIBRARY: ServiceLibraryItem[] = [
  // Waste Services
  { name: "Residential Waste Collection", unit: "pickup", price: 45, category: "waste" },
  { name: "Commercial Waste Management", unit: "month", price: 380, category: "waste" },
  { name: "Recycling Services", unit: "pickup", price: 35, category: "waste" },
  { name: "Dumpster & Bin Rental (14yd)", unit: "rental", price: 425, category: "waste" },
  { name: "Dumpster & Bin Rental (20yd)", unit: "rental", price: 525, category: "waste" },
  { name: "Dumpster & Bin Rental (30yd)", unit: "rental", price: 650, category: "waste" },
  { name: "Junk Removal", unit: "job", price: 250, category: "waste" },
  { name: "Construction Waste Removal", unit: "load", price: 320, category: "waste" },
  { name: "Hazardous Materials Pickup", unit: "job", price: 180, category: "waste" },

  // Moving Services (Citywide Moving Solutions)
  { name: "Residential Moving", unit: "hour", price: 120, category: "moving" },
  { name: "Commercial Moving", unit: "hour", price: 150, category: "moving" },
  { name: "Packing", unit: "hour", price: 55, category: "moving" },
  { name: "Unpacking", unit: "hour", price: 55, category: "moving" },
  { name: "Furniture Assembly", unit: "item", price: 40, category: "moving" },
  { name: "Furniture Disassembly", unit: "item", price: 35, category: "moving" },
  { name: "Office Relocation", unit: "job", price: 900, category: "moving" },
  { name: "Loading / Unloading", unit: "hour", price: 80, category: "moving" },
  { name: "Storage Services", unit: "month", price: 150, category: "moving" },
  { name: "Vehicle / Heavy Equipment Moving", unit: "job", price: 500, category: "moving" },
];

// ─── Invoice Status Config ───────────────────────────────────────────────────

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "Draft",
  "Pending",
  "Sent",
  "Viewed",
  "Partially Paid",
  "Paid",
  "Overdue",
  "Cancelled",
  "Refunded",
];

/** Tailwind color classes for each status */
export const STATUS_COLORS: Record<InvoiceStatus, { bg: string; text: string; dot: string }> = {
  Draft:          { bg: "bg-gray-100 dark:bg-gray-800",    text: "text-gray-600 dark:text-gray-400",    dot: "bg-gray-400" },
  Pending:        { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400",  dot: "bg-amber-500" },
  Sent:           { bg: "bg-blue-50 dark:bg-blue-900/20",   text: "text-blue-700 dark:text-blue-400",    dot: "bg-blue-500" },
  Viewed:         { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-400", dot: "bg-indigo-500" },
  "Partially Paid": { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-400",   dot: "bg-teal-500" },
  Paid:           { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400",  dot: "bg-green-500" },
  Overdue:        { bg: "bg-red-50 dark:bg-red-900/20",     text: "text-red-700 dark:text-red-400",      dot: "bg-red-500" },
  Cancelled:      { bg: "bg-gray-100 dark:bg-gray-800",     text: "text-gray-500 dark:text-gray-500",    dot: "bg-gray-400" },
  Refunded:       { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
};

// ─── Payment Terms Presets ───────────────────────────────────────────────────

export const PAYMENT_TERMS = [
  "Due on receipt",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Custom",
] as const;

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_TAX_RATE = 13; // Ontario HST

export const DEFAULT_CURRENCY = "CAD";

export const CURRENCY_OPTIONS = ["CAD", "USD"] as const;

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CW-${year}-${random}`;
}

/** Default empty client */
export function defaultClient(): InvoiceClient {
  return {
    company: "",
    name: "",
    phone: "",
    email: "",
    serviceAddress: "",
    billingAddress: "",
    city: "",
    province: "ON",
    country: "Canada",
    zip: "",
    taxNumber: "",
    notes: "",
  };
}

/** Default invoice metadata */
export function defaultMeta(): InvoiceMeta {
  return {
    invoiceNo: generateInvoiceNumber(),
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    currency: DEFAULT_CURRENCY,
    terms: "Due on receipt",
    status: "Draft",
    deposit: 0,
    amountPaid: 0,
    brand: "waste",
    type: "INVOICE",
  };
}

// ─── Company Info (for invoice header/footer) ────────────────────────────────

export const COMPANY_INFO = {
  name: "Citywide Waste Solutions",
  sisterBrand: "Citywide Moving Solutions",
  tagline: "Cleaner City. Better Tomorrow.",
  address: "Prestonvale Road, Courtice, Ontario L1E 3H8, Canada",
  phone: "437-580-6054",
  email: "wastesolutions80@gmail.com",
  website: "www.citywidewastesolutions.com",
  whatsapp: "https://wa.me/14375806054",
  businessNumbers: {
    bn: "716988035TZ0002",
    bin: "1001615565",
    naics: "562210",
  },
  hours: "Mon–Fri 7:00 AM–6:00 PM, Sat 8:00 AM–2:00 PM",
  serviceAreas: "Durham, Clarington, Toronto, Scarborough, Vaughan",
  socials: {
    facebook: "facebook.com/citywidewastesolutions",
    instagram: "instagram.com/citywidewastesolutions",
    linkedin: "linkedin.com/company/citywide-waste-solutions",
  },
} as const;

// ─── Local Storage Key ───────────────────────────────────────────────────────

export const DRAFTS_STORAGE_KEY = "citywide-invoice-drafts";
