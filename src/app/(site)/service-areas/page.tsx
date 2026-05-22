import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { SERVICE_AREAS, SITE_URL } from "@/lib/constants";
import { areasMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  ...areasMetadata,
  alternates: { canonical: `${SITE_URL}/service-areas` },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Areas"
        title="Waste Collection Across the GTA & Durham"
        description="Local crews, on-time pickups, and eco-conscious disposal in every community we serve."
        size="large"
      />

      <MotionSection className="bg-background">
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SERVICE_AREAS.map((area) => (
            <StaggerItem key={area.slug}>
              <Link
                href={`/service-areas/${area.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white dark:bg-green-950/40">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-green-600 transition-colors">
                    {area.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{area.desc}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Pop. {area.pop}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 text-center">
          <Button asChild variant="primary" size="lg">
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
