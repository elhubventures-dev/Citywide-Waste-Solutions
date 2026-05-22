import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WHO_WE_ARE, SERVICE_PILLARS, CLIENT_TYPES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { slideInLeft, slideInRight } from "@/lib/motion-presets";

export function WhoWeAreSection() {
  return (
    <section className="section bg-background" aria-labelledby="who-we-are-heading">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <Reveal variants={slideInLeft} className="space-y-6">
            <SectionHeader
              eyebrow={WHO_WE_ARE.eyebrow}
              title={WHO_WE_ARE.title}
              id="who-we-are-heading"
            />
            <p className="text-lg font-semibold text-green-600">{WHO_WE_ARE.sustainability}</p>
            <p className="text-muted-foreground leading-relaxed">{WHO_WE_ARE.intro}</p>
            <p className="text-muted-foreground leading-relaxed">{WHO_WE_ARE.mission}</p>
            <Button asChild variant="primary" size="lg">
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal variants={slideInRight} className="space-y-6">
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {SERVICE_PILLARS.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <Link
                    href={pillar.href}
                    className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover"
                  >
                    <span className="text-3xl mb-3" aria-hidden="true">{pillar.icon}</span>
                    <h3 className="font-bold text-foreground mb-2">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{pillar.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                      Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="rounded-2xl border border-border bg-section-alt p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Who We Serve
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {CLIENT_TYPES.map((client) => (
                  <li key={client} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
