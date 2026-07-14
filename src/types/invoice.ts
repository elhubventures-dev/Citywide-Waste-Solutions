// ─── Invoice Module Types ────────────────────────────────────────────────────
// Citywide Waste Solutions — Phase 1 (front-end only, localStorage drafts)

/** Invoice status lifecycle */
export type InvoiceStatus =
  | "Draft"
  | "Pending"
  | "Sent"
  | "Viewed"
  | "Partially Paid"
  | "Paid"
  | "Overdue"
  | "Cancelled"
  | "Refunded";

/** A single service from the reusable library */
export interface ServiceLibraryItem {
  name: string;
  unit: string;
  price: number; // in dollars (CAD)
  category: "waste" | "moving";
}

/** Client information for an invoice */
export interface InvoiceClient {
  company: string;
  name: string;
  phone: string;
  email: string;
  serviceAddress: string;
  billingAddress: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  taxNumber: string;
  notes: string;
}

/** Invoice metadata */
export interface InvoiceMeta {
  invoiceNo: string;
  issueDate: string; // ISO date string (YYYY-MM-DD)
  dueDate: string;
  currency: string;
  terms: string;
  status: InvoiceStatus;
  deposit: number;
  amountPaid: number;
  /** Which brand this invoice is for */
  brand: "waste" | "moving";
}

/** A single line item row on an invoice */
export interface InvoiceRow {
  id: string;
  service: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
  discount: number; // percentage
  tax: number; // percentage (Ontario HST = 13)
}

/** Computed totals for display */
export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  balanceDue: number;
}

/** A full invoice draft stored in localStorage */
export interface InvoiceDraft {
  id: string;
  client: InvoiceClient;
  meta: InvoiceMeta;
  rows: InvoiceRow[];
  createdAt: string;
  updatedAt: string;
}
