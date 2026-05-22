import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SERVICES, BUSINESS, SITE_URL } from "@/lib/constants";
import { getServiceIcon } from "@/lib/service-icons";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Our Services | Waste Collection & Recycling in Ontario",
  description:
    "Explore Citywide Waste Solutions services — residential pickup, commercial waste management, recycling, dumpster rental, junk removal, and construction debris removal across Ontario.",
  alternates: { canonical: `${SITE_URL}/services` },
};

const colorMap = {
  green: { iconBg: "bg-green-100 dark:bg-green-950/40", iconText: "text-green-600", badge: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400", hover: "hover:border-green-200 dark:hover:border-green-800" },
  blue:  { iconBg: "bg-blue-100 dark:bg-blue-950/40", iconText: "text-blue-600", badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400", hover: "hover:border-blue-200 dark:hover:border-blue-800" },
  earth: { iconBg: "bg-earth-100 dark:bg-earth-950/40", iconText: "text-earth-600", badge: "bg-earth-50 text-earth-700 dark:bg-earth-950/30 dark:text-earth-400", hover: "hover:border-earth-200 dark:hover:border-earth-800" },
} as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Complete Waste Solutions for Every Need"
        description={`${BUSINESS.name} delivers residential, commercial, and specialty waste services across the GTA and Durham — on schedule, on budget, and built around responsible disposal.`}
        size="large"
      />

      <MotionSection className="bg-background">
          <SectionHeader
            eyebrow="What We Offer"
            title="Choose the Right Service for Your Property or Project"
            subtitle="Select a service below to learn more, see pricing guidance, and request a free quote."
            className="mb-12"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = getServiceIcon(service.slug);
              const colors = colorMap[service.color];

              return (
                <StaggerItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300",
                    "hover:shadow-card-hover hover:-translate-y-1.5",
                    colors.hover
                  )}
                >
                  <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl", colors.iconBg)}>
                    <Icon className={cn("h-6 w-6", colors.iconText)} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {service.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", colors.badge)}>
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="mt-14 text-center">
            <Button asChild size="lg" variant="primary">
              <Link href="/contact#quote">
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
      </MotionSection>
    </>
  );
}
