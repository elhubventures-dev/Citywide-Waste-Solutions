"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Star, ArrowRight } from "lucide-react";
import { MOVING_PRICING_TIERS } from "@/lib/moving/constants";
import { relocateHref } from "@/lib/moving/paths";
import { cn } from "@/lib/utils";
import { MotionSection } from "@/components/motion/motion-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function MovingPricingSection({ showHeader = true }: { showHeader?: boolean }) {
  const [contactHref, setContactHref] = useState(relocateHref("/contact#quote"));

  useEffect(() => {
    setContactHref(relocateHref("/contact#quote", window.location.host));
  }, []);

  return (
    <MotionSection className="bg-section-gradient" animate={!showHeader}>
      {showHeader && (
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent, No-Surprise Rates"
          subtitle="Every move is unique. Choose a package below or request a custom quote — we'll give you an exact price before moving day."
          centered
          className="mb-12"
        />
      )}

      <Stagger className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {MOVING_PRICING_TIERS.map((tier) => (
          <StaggerItem key={tier.id}>
            <div
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
                tier.featured ? "border-2 border-green-500 shadow-green" : "border-border"
              )}
            >
              {tier.featured && (
                <div className="absolute right-4 top-4">
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    <Star className="h-3 w-3 fill-amber-400" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className={cn("p-6", tier.featured ? "bg-green-500 text-white" : "bg-muted/30")}>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    tier.featured ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  {tier.description}
                </p>
                <p
                  className={cn(
                    "mt-4 text-sm font-semibold",
                    tier.featured ? "text-green-100" : "text-green-600"
                  )}
                >
                  {tier.priceNote}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-3 p-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="p-6 pt-0">
                <Link
                  href={contactHref}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors",
                    tier.featured
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border-2 border-green-500 text-green-600 hover:bg-green-50"
                  )}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Final pricing depends on distance, crew hours, packing needs, and access. All quotes are
        provided in writing before your move.
      </p>
    </MotionSection>
  );
}
