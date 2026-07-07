"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Star } from "lucide-react";
import { MOVING_NAV_CTA, MOVING_PHONE_CTA, MOVING_TESTIMONIALS } from "@/lib/moving/constants";
import { relocateHref } from "@/lib/moving/paths";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion-presets";

export function MovingCtaSection() {
  const [quoteHref, setQuoteHref] = useState(relocateHref(MOVING_NAV_CTA.href));

  useEffect(() => {
    setQuoteHref(relocateHref(MOVING_NAV_CTA.href, window.location.host));
  }, []);

  return (
    <section className="relative overflow-hidden bg-green-600 py-20" aria-labelledby="moving-cta">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="container relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl space-y-6"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90"
          >
            Ready to move?
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            id="moving-cta"
            className="text-balance text-3xl font-bold text-white sm:text-4xl"
          >
            Get Your Free Moving Quote Today
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-white/80">
            Tell us about your move and we&apos;ll respond within 2 business hours with a clear,
            no-obligation estimate.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Button asChild size="xl" className="bg-white text-green-700 hover:bg-green-50">
              <Link href={quoteHref}>
                Request Free Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline-white" size="xl">
              <a href={MOVING_PHONE_CTA.href}>
                <Phone className="h-5 w-5" />
                {MOVING_PHONE_CTA.display}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function MovingTestimonialsSection() {
  return (
    <MotionSection className="bg-background">
      <SectionHeader
        eyebrow="Testimonials"
        title="Trusted by Homeowners & Businesses"
        subtitle="Real feedback from customers who chose Citywide for their move."
        centered
        className="mb-12"
      />
      <Stagger className="grid gap-6 md:grid-cols-3">
        {MOVING_TESTIMONIALS.map((t) => (
          <StaggerItem key={t.id}>
            <blockquote className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 border-t border-border pt-4">
                <cite className="not-italic">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </cite>
              </footer>
            </blockquote>
          </StaggerItem>
        ))}
      </Stagger>
    </MotionSection>
  );
}
