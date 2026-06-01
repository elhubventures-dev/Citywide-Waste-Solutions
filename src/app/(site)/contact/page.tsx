import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeader } from "@/components/ui/section-header";
import { BUSINESS, CONTACT_INFO } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const CONTACT_ICONS = {
  phone: Phone,
  whatsapp: WhatsAppIcon,
  email: Mail,
  address: MapPin,
  hours: Clock,
} as const;

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Quote",
  description: `Get in touch with ${BUSINESS.name}. Request a free quote, schedule a pickup, or ask us anything. Serving Durham, Scarborough, Vaughan & Toronto.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk Waste Solutions"
        description="We're here to help with all your waste management needs — quotes, scheduling, recycling questions, and more. We respond within 2 business hours."
      />

      <MotionSection className="bg-background" id="quote" animate={false}>
        <div className="grid gap-16 lg:grid-cols-5">
          {/* ── Left: Info ─────────────────────────────────────────── */}
          <div className="space-y-10 lg:col-span-2">
            {/* Business details */}
            <div className="space-y-6">
              <SectionHeader
                eyebrow="Get in Touch"
                title="We're Ready to Help"
                subtitle="Reach out by form, phone, or email — whichever is easiest."
              />

              <Stagger className="space-y-4">
                {CONTACT_INFO.map(({ kind, label, value, href }) => {
                  const Icon = CONTACT_ICONS[kind];
                  return (
                    <StaggerItem key={label}>
                      <li className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950/40">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              target={href.startsWith("http") ? "_blank" : undefined}
                              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="text-sm font-medium text-foreground transition-colors hover:text-green-600"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-foreground">{value}</p>
                          )}
                        </div>
                      </li>
                    </StaggerItem>
                  );
                })}
              </Stagger>

              {/* Registered business details */}
              <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-card">
                <p className="mb-2 font-semibold text-foreground">Registered Business</p>
                <dl className="space-y-1.5 text-muted-foreground">
                  <div>
                    <dt className="text-xs uppercase tracking-wide">Owner</dt>
                    <dd className="font-medium text-foreground">{BUSINESS.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide">Legal Name</dt>
                    <dd className="font-medium text-foreground">{BUSINESS.legalName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide">Business Number</dt>
                    <dd className="font-medium text-foreground">{BUSINESS.businessNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide">BIN</dt>
                    <dd className="font-medium text-foreground">{BUSINESS.bin}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide">NAICS</dt>
                    <dd className="font-medium text-foreground">{BUSINESS.naics.full}</dd>
                  </div>
                </dl>
              </div>

              {/* Hours detail */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-green-500" />
                  Business Hours
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-foreground">7:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-foreground">8:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2872.1234567890!2d-78.7667!3d43.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDU1JzAwLjEiTiA3OMKwNDYnMDAuMSJX!5e0!3m2!1sen!2sca!4v1234567890"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${BUSINESS.name} location map`}
              />
            </div>

            {/* Pay invoice CTA */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <p className="mb-1 text-sm font-semibold text-blue-800 dark:text-blue-200">
                Have an invoice to pay?
              </p>
              <p className="mb-3 text-xs text-blue-700 dark:text-blue-300">
                Pay securely online with card, Apple Pay, or Google Pay.
              </p>
              <Link
                href="/pay"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300"
              >
                Pay Invoice Online
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── Right: Forms ──────────────────────────────────────── */}
          <div className="space-y-10 lg:col-span-3">
            {/* Quote form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Request a Free Quote</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Fill in the form below and we'll get back to you with transparent pricing.
                </p>
              </div>
              <QuoteForm />
            </div>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="mx-4 bg-background px-2 text-xs font-medium text-muted-foreground">
                or send a general message
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <div className="mb-6 flex items-start gap-3">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">General Enquiry</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Questions, feedback, or anything else — we're listening.
                  </p>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
