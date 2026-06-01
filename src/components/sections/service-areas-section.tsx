import Link from "next/link";
import { MapPin, ArrowRight, Users } from "lucide-react";
import { SERVICE_AREAS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { slideInLeft, slideInRight } from "@/lib/motion-presets";

export function ServiceAreasSection() {
  return (
    <section className="section bg-section-alt" aria-labelledby="areas-heading">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <Reveal variants={slideInLeft} className="space-y-8">
            <SectionHeader
              eyebrow="Where We Serve"
              title="Waste Collection Across the GTA & Durham"
              subtitle="We cover five cities across Ontario — each with local knowledge, local crews, and local care."
              id="areas-heading"
            />
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {SERVICE_AREAS.map((area) => (
                <StaggerItem key={area.slug}>
                  <Link
                    href={`/service-areas/${area.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover dark:hover:border-green-800"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white dark:bg-green-950/40">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground transition-colors group-hover:text-green-600">
                        {area.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        Pop. {area.pop}
                      </div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 self-center text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            <Link
              href="/service-areas"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              View all service areas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal variants={slideInRight} className="relative">
            <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2872.1234567890!2d-78.7667!3d43.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDU1JzAwLjEiTiA3OMKwNDYnMDAuMSJX!5e0!3m2!1sen!2sca!4v1234567890"
                width="100%"
                height="480"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Citywide Waste Solutions service area map"
                className="w-full"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-950/95">
              <div>
                <div className="text-sm font-semibold text-foreground">Prestonvale Road</div>
                <div className="text-xs text-muted-foreground">
                  Courtice, Ontario L1E 3H8 — Our home base
                </div>
              </div>
              <Link
                href="/contact"
                className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-600"
              >
                Get Directions
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
