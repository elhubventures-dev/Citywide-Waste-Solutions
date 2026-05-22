"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion-presets";
import { ParallaxLayer } from "@/components/motion/parallax";

export function CtaBannerSection() {
  return (
    <section
      className="relative overflow-hidden py-20"
      aria-labelledby="cta-heading"
    >
      <ParallaxLayer speed={40} className="absolute inset-0">
        <Image
          src={SITE_IMAGES.hero.pageBanner}
          alt=""
          fill
          className="object-cover scale-105"
          sizes="100vw"
          aria-hidden
        />
      </ParallaxLayer>
      <div className="absolute inset-0 bg-green-950/75" />
      <div className="absolute inset-0 bg-dots opacity-[0.07]" style={{ backgroundSize: "24px 24px" }} />

      <div className="container relative z-10 text-center">
        <motion.div
          className="mx-auto max-w-2xl space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90"
          >
            Ready to get started?
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            id="cta-heading"
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl text-balance"
          >
            Get Your Free Quote in Under 2 Minutes
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-white/70">
            No contracts required to start. Transparent pricing — residential from $30/month,
            junk removal from $80, dumpster rental from $150/day.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="xl"
              className="bg-white text-green-700 hover:bg-green-50 shadow-2xl"
            >
              <Link href="/contact#quote">
                Request Free Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline-white" size="xl">
              <a href={`tel:${BUSINESS.phoneRaw}`}>
                <Phone className="h-5 w-5" />
                {BUSINESS.phone}
              </a>
            </Button>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-sm text-white/50">
            No spam. No commitment. We respond within 2 business hours.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
