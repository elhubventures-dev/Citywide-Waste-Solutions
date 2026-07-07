"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, BadgeDollarSign, Clock3 } from "lucide-react";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import {
  MOVING_SERVICE_STRIP,
  MOVING_VALUE_STRIP,
  MOVING_NAV_CTA,
  MOVING_PHONE_CTA,
  MOVING_SERVICE_AREAS_LINE,
} from "@/lib/moving/constants";
import { MOVING_IMAGES } from "@/lib/moving/images";
import { relocateHref } from "@/lib/moving/paths";
import { heroStagger, heroItem } from "@/lib/motion-presets";
import { Button } from "@/components/ui/button";

function MovingServicesTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-white/90 sm:text-sm">
        {MOVING_SERVICE_STRIP.map((item, i) => (
          <span key={item} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/30">•</span>}
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-4">
      <div
        className="flex w-max animate-ticker-rtl items-center [animation-duration:55s] motion-reduce:animate-none"
        aria-label="Moving services offered"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-6 px-10"
            aria-hidden={copy === 1}
          >
            {MOVING_SERVICE_STRIP.map((item, i) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-6 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/90 sm:text-sm"
              >
                {i > 0 && <span className="text-white/30">•</span>}
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovingHeroSection() {
  const reduceMotion = useReducedMotion();
  const [quoteHref, setQuoteHref] = useState(relocateHref(MOVING_NAV_CTA.href));

  useEffect(() => {
    setQuoteHref(relocateHref(MOVING_NAV_CTA.href, window.location.host));
  }, []);

  return (
    <section className="relative overflow-hidden bg-blue-gradient text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(46,155,74,0.25),transparent_55%)]" />
      <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="container relative z-10 grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={heroStagger}
          className="space-y-6"
        >
          <motion.div variants={heroItem}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-300">
              {MOVING_BUSINESS.name}
            </span>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="text-balance text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {MOVING_BUSINESS.headline}
          </motion.h1>

          <motion.p variants={heroItem} className="text-lg font-semibold text-brand-green">
            {MOVING_BUSINESS.tagline}
          </motion.p>

          <motion.p variants={heroItem} className="max-w-lg text-base leading-relaxed text-white/80">
            Professional, reliable, and affordable moving services for your home or business. We
            handle every move with care — from packing and loading to delivery and setup.
          </motion.p>

          <motion.div variants={heroItem} className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="xl" variant="primary">
              <Link href={quoteHref}>
                Get Free Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline-invert" size="xl">
              <a href={MOVING_PHONE_CTA.href}>
                <Phone className="h-5 w-5" />
                {MOVING_PHONE_CTA.display}
              </a>
            </Button>
          </motion.div>

          <motion.ul variants={heroItem} className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm text-white/70">
            {MOVING_VALUE_STRIP.map((v) => (
              <li key={v} className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                {v}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
            <Image
              src={MOVING_IMAGES.hero}
              alt="Citywide branded moving van with Toronto skyline"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-4 max-w-[17rem] rounded-xl bg-brand-green px-5 py-3 shadow-green sm:-bottom-6 sm:-left-6 sm:max-w-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-green-100">Serving</p>
            <p className="text-xs font-bold leading-snug text-white sm:text-sm">
              {MOVING_SERVICE_AREAS_LINE}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Service strip */}
      <div className="relative border-t border-white/10 bg-brand-navy/50 backdrop-blur-sm">
        <MovingServicesTicker reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

export function MovingPhoneBanner() {
  return (
    <div className="relative overflow-hidden bg-brand-green py-5">
      <div className="absolute inset-0 -skew-y-1 bg-green-600" aria-hidden />
      <div className="container relative flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
        <Phone className="h-6 w-6 text-white" />
        <p className="text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
          Call Today for a Free Quote!
        </p>
        <a
          href={MOVING_PHONE_CTA.href}
          className="rounded-lg bg-white px-6 py-2.5 text-lg font-bold text-brand-green shadow-md transition-colors hover:bg-green-50"
        >
          {MOVING_PHONE_CTA.display}
        </a>
      </div>
    </div>
  );
}

export function MovingStatsBar() {
  const stats = [
    { icon: ShieldCheck, label: "Fully Insured" },
    { icon: BadgeDollarSign, label: "Affordable Rates" },
    { icon: Clock3, label: "On-Time Service" },
  ];

  return (
    <div className="border-b border-border bg-green-50 dark:bg-green-950/20">
      <div className="container grid gap-4 py-8 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-white">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
