import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SPECIALIZED_SOLUTIONS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export function SpecializedSolutionsSection() {
  return (
    <section className="section bg-section-alt" aria-labelledby="specialized-heading">
      <div className="container">
        <Reveal className="mb-12">
          <SectionHeader
            eyebrow="Specialized Solutions"
            title="Targeted Waste & Recycling Programs"
            subtitle="Focused services for household waste, construction debris, wood recycling, and multi-material recovery — all handled by the same trusted Citywide team."
            centered
            id="specialized-heading"
          />
        </Reveal>
        <Stagger className="grid gap-6 sm:grid-cols-2">
          {SPECIALIZED_SOLUTIONS.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
                >
                  Read more{" "}
                  <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-0.5" />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
