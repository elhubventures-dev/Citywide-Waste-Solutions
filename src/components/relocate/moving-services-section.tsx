"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Building2,
  MapPin,
  Package,
  Truck,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { MOVING_SERVICES } from "@/lib/moving/constants";
import { relocateHref } from "@/lib/moving/paths";
import { SectionHeader } from "@/components/ui/section-header";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const ICONS = {
  home: Home,
  building: Building2,
  map: MapPin,
  box: Package,
  truck: Truck,
  wrench: Wrench,
} as const;

interface MovingServicesSectionProps {
  showAll?: boolean;
  className?: string;
}

export function MovingServicesSection({ showAll = false, className }: MovingServicesSectionProps) {
  const services = showAll ? MOVING_SERVICES : MOVING_SERVICES.slice(0, 4);
  const [servicesHref, setServicesHref] = useState(relocateHref("/services"));

  useEffect(() => {
    setServicesHref(relocateHref("/services", window.location.host));
  }, []);

  return (
    <MotionSection className={cn("bg-background", className)} id="services">
      <SectionHeader
        eyebrow="Our Services"
        title="Complete Moving Solutions"
        subtitle="From apartments to offices — local or long-distance — we have the crew, trucks, and expertise for a smooth move."
        centered
        className="mb-12"
      />

      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <StaggerItem key={service.slug}>
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover dark:hover:border-green-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white dark:bg-green-950/40">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{service.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="space-y-1.5">
                  {service.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {!showAll && (
        <div className="mt-10 text-center">
          <Link
            href={servicesHref}
            className="inline-flex items-center gap-2 font-semibold text-green-600 transition-colors hover:text-green-700"
          >
            View all moving services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </MotionSection>
  );
}
