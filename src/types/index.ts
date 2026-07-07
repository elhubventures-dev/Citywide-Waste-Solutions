import { LucideIcon } from "lucide-react";

// ─── Common ───────────────────────────────────────────────────────────────────

export type ColorVariant = "green" | "blue" | "earth" | "gray";

export interface MetaProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
  icon?: LucideIcon;
  external?: boolean;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  color: ColorVariant;
  price: string;
  features: readonly string[];
  longDesc?: string;
  faqs?: FAQ[];
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// ─── Service Areas ────────────────────────────────────────────────────────────

export interface ServiceArea {
  slug: string;
  name: string;
  desc: string;
  pop: string;
  coords: { lat: number; lng: number };
  image?: string;
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  featured: boolean;
  color: ColorVariant;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar?: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: any; // Sanity portable text
  coverImage: SanityImage;
  author: Author;
  categories: BlogCategory[];
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
}

export interface Author {
  _id: string;
  name: string;
  bio?: string;
  avatar?: SanityImage;
}

export interface BlogCategory {
  _id: string;
  slug: string;
  label: string;
}

// ─── Sanity ───────────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  city: string;
  pickupFrequency?: string;
  message?: string;
  smsOptIn: boolean;
  recaptchaToken?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

export interface MovingQuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  moveDate: string;
  fromCity: string;
  toCity: string;
  homeSize: string;
  message?: string;
  smsOptIn: boolean;
  recaptchaToken?: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

export interface InvoicePaymentData {
  invoiceNumber: string;
  email: string;
  amount?: number; // in cents
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  invoiceId: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type UserRole = "owner" | "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  type: "quote" | "contact" | "newsletter";
  data: QuoteFormData | ContactFormData | NewsletterFormData;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  ipAddress?: string;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}
