import type { Metadata } from "next";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";
import { InvoicePaymentForm } from "@/components/forms/invoice-payment-form";
import { PageHero } from "@/components/motion/page-hero";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pay Invoice | Secure Online Payment",
  description: `Pay your ${BUSINESS.name} invoice securely online via Interac e-Transfer.`,
  robots: { index: false }, // don't index payment page
};

const ACCEPTED = [
  { label: "Interac e-Transfer" },
];

export default function PayPage() {
  return (
    <>
      <PageHero
        centered
        eyebrow="Payments"
        title="Pay Your Invoice"
        description="Enter your invoice number and email to securely pay your balance online."
      >
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <Lock className="h-3.5 w-3.5 text-green-300" />
            SSL Encrypted
          </div>
          <div className="h-3 w-px bg-white/25" />
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-green-300" />
            PCI Compliant
          </div>
          <div className="h-3 w-px bg-white/25" />
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-green-300" />
            Secured by Stripe
          </div>
        </div>
      </PageHero>

      <section className="section-sm min-h-[50vh] bg-background">
        <div className="container -mt-4 pb-16">
          <div className="mx-auto flex flex-col items-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/40">
              <CreditCard className="h-7 w-7 text-green-600" />
            </div>

            <div className="w-full">
              <InvoicePaymentForm />
            </div>

            <div className="mt-6 text-center">
              <p className="mb-2 text-xs text-muted-foreground">We accept</p>
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
    </>
  );
}
