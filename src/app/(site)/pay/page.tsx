import type { Metadata } from "next";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";
import { InvoicePaymentForm } from "@/components/forms/invoice-payment-form";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pay Invoice | Secure Online Payment",
  description:
    `Pay your ${BUSINESS.name} invoice securely online. Accepts Visa, Mastercard, Apple Pay, and Google Pay.`,
  robots: { index: false }, // don't index payment page
};

const ACCEPTED = [
  { label: "Visa / Mastercard" },
  { label: "American Express" },
  { label: "Apple Pay" },
  { label: "Google Pay" },
];

export default function PayPage() {
  return (
    <section className="section-sm bg-background min-h-[80vh] flex items-start">
      <div className="container py-16">
        <div className="mx-auto max-w-lg">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/40">
              <CreditCard className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Pay Your Invoice</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your invoice number and email to securely pay your balance online.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-green-500" />
              SSL Encrypted
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              PCI Compliant
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              Secured by Stripe
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <InvoicePaymentForm />
          </div>

          {/* Accepted payments */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">We accept</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {ACCEPTED.map(({ label }) => (
                <span
                  key={label}
                  className="rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Help text */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help finding your invoice number?{" "}
            <a href={`mailto:${BUSINESS.email}`} className="text-green-600 hover:underline">
              Email us
            </a>{" "}
            or call{" "}
            <a href={`tel:${BUSINESS.phoneRaw}`} className="text-green-600 hover:underline">
              {BUSINESS.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
