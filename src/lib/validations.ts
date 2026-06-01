import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(
    /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
    "Please enter a valid Canadian phone number"
  );

// ─── Quote Form ───────────────────────────────────────────────────────────────

export const quoteFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),

  email: z.string().email("Please enter a valid email address").max(254, "Email too long"),

  phone: phoneSchema,

  serviceType: z.enum(
    [
      "Residential Waste Collection",
      "Commercial Waste Management",
      "Recycling Services",
      "Dumpster & Bin Rental",
      "Junk Removal",
      "Construction Waste Removal",
    ],
    { errorMap: () => ({ message: "Please select a service type" }) }
  ),

  city: z.enum(["Durham", "Scarborough", "Vaughan", "Toronto", "Other"], {
    errorMap: () => ({ message: "Please select your city" }),
  }),

  pickupFrequency: z.enum(["Weekly", "Bi-Weekly", "Monthly", "One-Time", "Custom"]).optional(),

  message: z.string().max(1000, "Message must be under 1000 characters").optional(),

  smsOptIn: z.boolean().default(false),

  recaptchaToken: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(80, "Name too long"),

  email: z.string().email("Please enter a valid email address"),

  phone: phoneSchema.optional().or(z.literal("")),

  subject: z.string().min(3, "Subject must be at least 3 characters").max(120, "Subject too long"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),

  recaptchaToken: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(80).optional(),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

// ─── Invoice Payment ──────────────────────────────────────────────────────────

export const invoicePaymentSchema = z.object({
  invoiceNumber: z
    .string()
    .min(3, "Please enter a valid invoice number")
    .max(30, "Invoice number too long")
    .regex(/^[A-Z0-9\-]+$/i, "Invalid invoice number format"),

  email: z.string().email("Please enter the email address on the invoice"),
});

export type InvoicePaymentValues = z.infer<typeof invoicePaymentSchema>;
