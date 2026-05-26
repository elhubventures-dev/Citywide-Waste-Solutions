"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { heroItem, heroStagger } from "@/lib/motion-presets";
import { ParallaxOrbs } from "@/components/motion/parallax";
import { PageHeroBackground } from "@/components/motion/page-hero-background";
import { getServiceIcon } from "@/lib/service-icons";

interface ServicePageHeroProps {
  title: string;
  description: string;
  slug: string;
  heroSrc?: string | null;
}

export function ServicePageHero({ title, description, slug, heroSrc }: ServicePageHeroProps) {
  const reduceMotion = useReducedMotion();
  const Icon = getServiceIcon(slug);

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <PageHeroBackground priority />
      <ParallaxOrbs />
      {heroSrc && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={reduceMotion ? false : { scale: 1.05 }}
          animate={reduceMotion ? undefined : { scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <Image
            src={heroSrc}
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-overlay"
            sizes="100vw"
          />
        </motion.div>
      )}
      <div className="container relative z-10">
        <motion.div
          className="max-w-2xl space-y-5"
          variants={reduceMotion ? undefined : heroStagger}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
        >
          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm"
          >
            <Icon className="h-7 w-7 text-white" />
          </motion.div>
          <div>
            <motion.span
              variants={reduceMotion ? undefined : heroItem}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-200 backdrop-blur-sm"
            >
              Our Services
            </motion.span>
            <motion.h1
              variants={reduceMotion ? undefined : heroItem}
              className="mt-2 text-balance text-4xl font-bold text-white drop-shadow-sm sm:text-5xl"
            >
              {title}
            </motion.h1>
          </div>
          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="text-lg leading-relaxed text-white/85 drop-shadow-sm"
          >
            {description}
          </motion.p>
          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link
              href="#quote"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
            >
              Get Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 bg-black/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {BUSINESS.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
