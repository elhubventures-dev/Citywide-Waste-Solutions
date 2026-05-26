import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone, Star } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allPricingQuery, allGeneralFaqsQuery } from "@/sanity/lib/queries";
import { PRICING_TIERS, BUSINESS, SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Pricing | Transparent Waste Collection Rates",
  description:
    "Honest, upfront pricing for residential waste collection from $30/month, junk removal from $80, and dumpster rental from $150/day. No hidden fees. Serving Ontario.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

const COLOR_STYLES = {
  green: {
    header: "bg-green-500",
    badge: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
    check: "text-green-500",
    featured: "border-green-500 shadow-green",
    btn: "bg-green-500 text-white hover:bg-green-600",
    btnOutline: "border-2 border-green-500 text-green-600 hover:bg-green-50",
  },
  blue: {
    header: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    check: "text-blue-500",
    featured: "border-blue-500 shadow-blue",
    btn: "bg-blue-500 text-white hover:bg-blue-600",
    btnOutline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50",
  },
  earth: {
    header: "bg-earth-500",
    badge: "bg-earth-100 text-earth-700 dark:bg-earth-950/40 dark:text-earth-300",
    check: "text-earth-500",
    featured: "border-earth-500",
    btn: "bg-earth-500 text-white hover:bg-earth-600",
    btnOutline: "border-2 border-earth-500 text-earth-600 hover:bg-earth-50",
  },
} as const;

export default async function PricingPage() {
  const [sanityPricing, sanityFaqs] = await Promise.all([
    sanityFetch<any[]>(allPricingQuery, {}, ["pricing"]).catch(() => []),
    sanityFetch<any[]>(allGeneralFaqsQuery, {}, ["faqs"]).catch(() => []),
  ]);

  // Use Sanity data if available, fall back to constants
  const tiers =
    sanityPricing.length > 0
      ? sanityPricing.map((t) => ({
          ...t,
          features: t.features ?? [],
          featured: t.isFeatured ?? false,
          color: t.color ?? "green",
          cta: t.ctaLabel ?? "Get Started",
          href: t.ctaHref ?? "/contact#quote",
        }))
      : PRICING_TIERS;

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent, No-Surprise Pricing"
        description="Honest rates for every service. Get your free quote and we'll give you an exact number before any work begins — no hidden fees, ever."
        centered
      />

      <MotionSection className="bg-background">
        {/* Popular badge note */}
        <p className="mb-10 text-center text-sm text-muted-foreground">
          All prices in <strong>CAD</strong>. Custom quotes available for commercial and large-scale
          projects.
        </p>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
          {tiers.map((tier: any) => {
            const styles =
              COLOR_STYLES[tier.color as keyof typeof COLOR_STYLES] ?? COLOR_STYLES.green;
            return (
              <StaggerItem key={tier.id ?? tier.name}>
                <div
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover",
                    tier.featured || tier.isFeatured
                      ? `border-2 ${styles.featured}`
                      : "border-border"
                  )}
                >
                  {/* Featured ribbon */}
                  {(tier.featured || tier.isFeatured) && (
                    <div className="absolute right-4 top-4">
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        <Star className="h-3 w-3 fill-amber-400" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Color header stripe */}
                  <div className={cn("h-1.5 w-full", styles.header)} />

                  <div className="flex flex-1 flex-col space-y-5 p-6">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>

                    {/* Features */}
                    <ul className="flex-1 space-y-2">
                      {(tier.features ?? []).map((f: string) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", styles.check)} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={tier.href ?? tier.ctaHref ?? "/contact#quote"}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors",
                        tier.featured || tier.isFeatured ? styles.btn : styles.btnOutline
                      )}
                    >
                      {tier.cta ?? tier.ctaLabel ?? "Get Started"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Commercial CTA */}
        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center dark:border-blue-800 dark:bg-blue-950/20">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Need a Custom Commercial Quote?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Our commercial waste management plans are tailored to your business size, waste volume,
            and pickup frequency. Pricing scales with your needs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact#quote"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Request Commercial Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-section-alt" containerClassName="max-w-3xl mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Every Plan Includes</h2>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              emoji: "📱",
              title: "SMS Reminders",
              desc: "Day-before pickup notifications so you're never caught off guard.",
            },
            {
              emoji: "🌱",
              title: "Eco Disposal",
              desc: "We sort, recycle, and minimize landfill impact on every pickup.",
            },
            {
              emoji: "🛡️",
              title: "Fully Insured",
              desc: "Full liability coverage on every crew member and job.",
            },
          ].map(({ emoji, title, desc }) => (
            <StaggerItem key={title}>
              <div className="rounded-xl border border-border bg-card p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="mb-3 text-3xl">{emoji}</div>
                <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </MotionSection>

      {sanityFaqs.length > 0 && (
        <MotionSection className="bg-background" containerClassName="max-w-2xl mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Pricing FAQs</h2>
          <div className="space-y-3">
            {sanityFaqs.map((faq: any) => (
              <details
                key={faq._id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground transition-colors hover:text-green-600">
                  {faq.question}
                  <span className="text-lg text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-border px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </MotionSection>
      )}
    </>
  );
}
