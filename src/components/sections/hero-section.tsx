"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Leaf, Clock3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/business";
import { SITE_IMAGES } from "@/lib/site-images";
import { heroStagger, heroItem } from "@/lib/motion-presets";
import { ParallaxOrbs, ParallaxImageWrap } from "@/components/motion/parallax";
import { StatsGrid } from "@/components/motion/count-up";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Fully Insured" },
  { icon: Leaf,        label: "Eco-Certified" },
  { icon: Clock3,      label: "On-Time Guarantee" },
  { icon: Star,        label: "5-Star Rated" },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-[85vh] overflow-hidden bg-hero-gradient"
      aria-label="Hero"
    >
      <div className="absolute inset-0 bg-dots opacity-[0.06]" style={{ backgroundSize: "28px 28px" }} />
      <ParallaxOrbs />

      <div className="container relative z-10 pt-6 pb-28 sm:pt-8 lg:pt-10 lg:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            className="space-y-5 sm:space-y-6"
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "show"}
          >
            <motion.div className="space-y-2" variants={reduceMotion ? undefined : heroItem}>
              <span className="block text-sm font-semibold uppercase tracking-widest text-white/70">
                Welcome to {BUSINESS.name}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-green-200 animate-pulse" />
                {BUSINESS.tagline}
              </span>
            </motion.div>

            <motion.h1
              variants={reduceMotion ? undefined : heroItem}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl text-balance"
            >
              Sustainable Waste Solutions for a{" "}
              <span className="text-green-200">Greener</span>{" "}
              <span className="text-blue-200">City</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : heroItem}
              className="max-w-xl text-lg leading-relaxed text-white/75"
            >
              Proudly serving Ontario with reliable, affordable, and environmentally responsible
              waste management — Vaughan, Toronto, Brampton, Mississauga & Courtice.
            </motion.p>

            <motion.div variants={reduceMotion ? undefined : heroItem} className="flex flex-wrap gap-4">
              <Button asChild size="xl" className="bg-white text-green-700 hover:bg-green-50 shadow-2xl">
                <Link href="/contact#quote">
                  Get Free Quote
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline-white" size="xl">
                <Link href="/services">View Services</Link>
              </Button>
            </motion.div>

            <motion.a
              variants={reduceMotion ? undefined : heroItem}
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Phone className="h-4 w-4" />
              </div>
              Call us: {BUSINESS.phone}
            </motion.a>

            <motion.div variants={reduceMotion ? undefined : heroItem} className="flex flex-wrap gap-3 pt-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm transition-transform hover:scale-105"
                >
                  <Icon className="h-3.5 w-3.5 text-green-200" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Mobile hero image */}
          <motion.div
            className="relative md:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 shadow-xl">
              <Image
                src={SITE_IMAGES.hero.main}
                alt=""
                fill
                priority
                className="object-cover object-[62%_center]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/50 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            className="relative hidden md:block"
            initial={reduceMotion ? false : { opacity: 0, x: 40, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ParallaxImageWrap className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-2xl ring-1 ring-white/10 lg:aspect-[4/3]">
              <motion.div
                className="relative h-full min-h-[300px] w-full"
                whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <Image
                  src={SITE_IMAGES.hero.main}
                  alt="Citywide Waste Solutions branded service van in Toronto"
                  fill
                  priority
                  className="object-cover object-[62%_center] scale-[1.02]"
                  sizes="(max-width: 768px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-950/50 via-green-950/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-transparent to-white/5" />
              </motion.div>
            </ParallaxImageWrap>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container py-4">
          <StatsGrid variant="hero" />
        </div>
      </motion.div>
    </section>
  );
}
