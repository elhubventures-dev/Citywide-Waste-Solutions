"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/constants";
import { getServiceIcon } from "@/lib/service-icons";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const colorMap = {
  green: {
    iconBg:   "bg-green-100 dark:bg-green-950/40",
    iconText: "text-green-600",
    badge:    "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    hover:    "hover:border-green-200 hover:shadow-green/10 dark:hover:border-green-800",
    accent:   "bg-green-500",
  },
  blue: {
    iconBg:   "bg-blue-100 dark:bg-blue-950/40",
    iconText: "text-blue-600",
    badge:    "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    hover:    "hover:border-blue-200 hover:shadow-blue/10 dark:hover:border-blue-800",
    accent:   "bg-blue-500",
  },
  earth: {
    iconBg:   "bg-earth-100 dark:bg-earth-950/40",
    iconText: "text-earth-600",
    badge:    "bg-earth-50 text-earth-700 dark:bg-earth-950/30 dark:text-earth-400",
    hover:    "hover:border-earth-200 dark:hover:border-earth-800",
    accent:   "bg-earth-500",
  },
} as const;

export function ServicesSection() {
  return (
    <section className="section bg-background" aria-labelledby="services-heading">
      <div className="container">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-14">
          <SectionHeader
            eyebrow="Our Core Services"
            title="Comprehensive Waste Solutions for a Cleaner Tomorrow"
            subtitle="Residential collection, commercial programs, recycling, bin rental, junk removal, and construction debris — tailored to every project."
            id="services-heading"
          />
          <Button asChild variant="outline" size="md" className="shrink-0 hidden sm:inline-flex">
            <Link href="/contact#quote">
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon   = getServiceIcon(service.slug);
            const colors = colorMap[service.color];

            return (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border bg-card p-6",
                    "shadow-card transition-all duration-300",
                    "hover:shadow-card-hover hover:-translate-y-1.5",
                    colors.hover
                  )}
                >
                  <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl", colors.iconBg)}>
                    <Icon className={cn("h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", colors.iconText)} />
                  </div>

                  <div className="flex-1 space-y-2.5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-green-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

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
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-10 text-center sm:hidden">
          <Button asChild variant="primary" size="lg">
            <Link href="/contact#quote">Get a Free Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
