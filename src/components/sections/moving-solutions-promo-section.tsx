import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { MOVING_HOMEPAGE_PROMO } from "@/lib/moving/constants";
import { MOVING_IMAGES } from "@/lib/moving/images";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { slideInLeft, slideInRight } from "@/lib/motion-presets";

export function MovingSolutionsPromoSection() {
  return (
    <section
      className="section relative overflow-hidden bg-blue-gradient text-white"
      aria-labelledby="moving-promo-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(46,155,74,0.2),transparent_55%)]" />
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variants={slideInLeft} className="space-y-6">
            <SectionHeader
              eyebrow={MOVING_HOMEPAGE_PROMO.eyebrow}
              title={MOVING_HOMEPAGE_PROMO.title}
              subtitle={MOVING_HOMEPAGE_PROMO.intro}
              light
              id="moving-promo-heading"
            />

            <Stagger className="grid gap-3 sm:grid-cols-2">
              {MOVING_HOMEPAGE_PROMO.highlights.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex items-start gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <p className="text-sm font-medium text-green-200">{MOVING_BUSINESS.tagline}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="bg-green-500 text-white shadow-green hover:bg-green-600"
              >
                <a href={MOVING_BUSINESS.siteUrl}>
                  {MOVING_HOMEPAGE_PROMO.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline-white" size="lg">
                <Link href="/contact#quote">
                  Get a Waste Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal variants={slideInRight} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
              <Image
                src={MOVING_IMAGES.hero}
                alt="Citywide Moving Solutions branded van serving the Greater Toronto Area"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/10 to-transparent" />
            </div>

            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-5 py-4 shadow-xl backdrop-blur-md sm:-left-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500 text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-200">
                  {MOVING_BUSINESS.name}
                </p>
                <p className="text-sm font-semibold text-white">{MOVING_BUSINESS.headline}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
