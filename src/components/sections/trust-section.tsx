import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TRUST_POINTS, WHY_US_HIGHLIGHTS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { StatsGrid } from "@/components/motion/count-up";

export function TrustSection() {
  return (
    <section className="section bg-section-alt" aria-labelledby="trust-heading">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <Reveal>
              <SectionHeader
                eyebrow="Why Us"
                title="Why Choose Citywide Waste Solutions?"
                subtitle="Professional service, transparent pricing, and eco-conscious disposal — backed by over a decade of experience across the GTA and Durham Region."
                id="trust-heading"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatsGrid />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {WHY_US_HIGHLIGHTS.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <Button asChild variant="primary" size="lg">
                <Link href="/about">
                  Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
          <div className="space-y-4">
            <Stagger className="space-y-4">
              {TRUST_POINTS.map((point) => (
                <StaggerItem key={point.title}>
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-950/40">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
