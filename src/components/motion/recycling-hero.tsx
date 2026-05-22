"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { heroItem, heroStagger } from "@/lib/motion-presets";
import { ParallaxOrbs, ParallaxImageWrap } from "@/components/motion/parallax";
import { PageHeroBackground } from "@/components/motion/page-hero-background";
import { SITE_IMAGES } from "@/lib/site-images";

export function RecyclingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <PageHeroBackground priority />
      <ParallaxOrbs />
      <div className="container relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          className="max-w-2xl space-y-5"
          variants={reduceMotion ? undefined : heroStagger}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
        >
          <motion.span
            variants={reduceMotion ? undefined : heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90"
          >
            ♻️ Recycling Guide
          </motion.span>
          <motion.h1
            variants={reduceMotion ? undefined : heroItem}
            className="text-4xl font-bold text-white sm:text-5xl text-balance"
          >
            What Can Be Recycled in Ontario?
          </motion.h1>
          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="text-lg text-white/75 leading-relaxed"
          >
            Everything you need to know about recycling pickup in Ontario — what we accept,
            how to sort it, and when we collect it. Let&apos;s keep more out of the landfill, together.
          </motion.p>
          <motion.div variants={reduceMotion ? undefined : heroItem} className="flex flex-wrap gap-3">
            <Link
              href="#materials"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
            >
              View Accepted Materials <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/docs/recycling-guide.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <Download className="h-4 w-4" /> Download PDF Guide
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 32 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ParallaxImageWrap className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-white/15 shadow-2xl lg:max-w-none">
            <div className="relative h-full min-h-[280px] w-full">
              <Image
                src={SITE_IMAGES.fleet.bin}
                alt="Citywide Waste Solutions branded recycling bin"
                fill
                className="object-contain bg-white/95 p-6"
                sizes="(max-width: 1024px) 80vw, 40vw"
                priority
              />
            </div>
          </ParallaxImageWrap>
        </motion.div>
      </div>
    </section>
  );
}
