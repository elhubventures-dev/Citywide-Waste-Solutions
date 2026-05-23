"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Building2,
  Recycle,
  Leaf,
  Sparkles,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  BadgeDollarSign,
  Clock3,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { heroStagger, heroItem } from "@/lib/motion-presets";

const SERVICE_TILES = [
  { label: "Residential Services", href: "/services/residential-waste-collection", icon: Home },
  { label: "Commercial Services", href: "/services/commercial-waste-management", icon: Building2 },
  { label: "Recycling Solutions", href: "/services/recycling-services", icon: Recycle },
  { label: "Organic Waste Management", href: "/recycling", icon: Leaf },
  { label: "Special Cleanup Services", href: "/services/junk-removal", icon: Sparkles },
] as const;

const FEATURE_STRIP = [
  { icon: ShieldCheck, label: "Reliable Service You Can Count On" },
  { icon: Leaf, label: "Eco-Friendly Practices" },
  { icon: BadgeDollarSign, label: "Affordable Pricing" },
  { icon: Clock3, label: "On-Time Every Time" },
  { icon: MapPin, label: "Proudly Serving Toronto & GTA" },
] as const;

function HeroFeatureTicker({ reduceMotion }: { reduceMotion: boolean | null }) {
  const items = [...FEATURE_STRIP, ...FEATURE_STRIP];

  if (reduceMotion) {
    return (
      <div className="relative flex justify-center px-4 pb-5 pt-3 sm:pb-6 sm:pt-4">
        <ul className="flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {FEATURE_STRIP.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <Icon className="h-4 w-4 text-green-100" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold leading-snug sm:text-xs">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden pb-5 pt-3 sm:pb-6 sm:pt-4">
      <ul
        className="flex w-max animate-ticker-rtl items-center gap-10 px-6 sm:gap-14 sm:px-10"
        aria-label="Why choose Citywide Waste Solutions"
      >
        {items.map(({ icon: Icon, label }, index) => (
          <li
            key={`${label}-${index}`}
            className="flex shrink-0 items-center justify-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
              <Icon className="h-4 w-4 text-green-100" strokeWidth={2} />
            </div>
            <span className="whitespace-nowrap text-[11px] font-semibold leading-snug sm:text-xs">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroWave() {
  return (
    <svg
      className="absolute -top-[1px] left-0 w-full h-10 sm:h-12 text-green-800"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,32 C240,8 480,48 720,24 C960,0 1200,40 1440,16 L1440,48 L0,48 Z"
      />
    </svg>
  );
}

function HeroTruckImage({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        "relative mx-auto aspect-[4/3] w-full max-w-lg sm:aspect-[5/4] lg:aspect-auto lg:mx-0 lg:h-[min(52vh,480px)] lg:max-w-none"
      }
    >
      <Image
        src={SITE_IMAGES.fleet.truck}
        alt="Citywide Waste Solutions branded truck serving the GTA"
        fill
        priority
        className="object-contain object-bottom drop-shadow-2xl"
        sizes="(max-width: 1024px) 90vw, 45vw"
      />
    </div>
  );
}

function HeroQuoteCard({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        "relative z-20 mx-auto max-w-md rounded-2xl border border-green-100 bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6"
      }
    >
      <div className="flex gap-4">
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700"
          aria-label={`Call ${BUSINESS.phone}`}
        >
          <Phone className="h-7 w-7" />
        </a>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-lg font-extrabold leading-tight text-slate-900">
            Get Your Free Quote Today!
          </h2>
          <p className="text-sm font-medium text-slate-600">Fast. Easy. No Obligation.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
        >
          <Phone className="h-4 w-4" />
          {BUSINESS.phone}
        </a>
        <a
          href={`mailto:${BUSINESS.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
        >
          <Mail className="h-4 w-4" />
          <span className="truncate">{BUSINESS.email}</span>
        </a>
        <a
          href={SITE_URL}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
        >
          <Globe className="h-4 w-4" />
          citywidewastesolutions.ca
        </a>
      </div>
      <Link
        href="/contact#quote"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-white py-2.5 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
      >
        Request Quote Online
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-sky-50" aria-label="Hero">
      {/* City skyline background */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={SITE_IMAGES.hero.main}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.97] via-white/80 to-white/25 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-sky-100/30" />
      </div>

      <div className="container relative z-10 pb-44 pt-6 sm:pb-48 sm:pt-8 lg:pb-52 lg:pt-10">
        <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-5 xl:gap-x-10">
          {/* Headline block */}
          <motion.div
            className="space-y-5 lg:col-span-7 lg:row-start-1"
            variants={reduceMotion ? undefined : heroStagger}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "show"}
          >
            <motion.p
              variants={reduceMotion ? undefined : heroItem}
              className="text-sm font-semibold text-green-700"
            >
              {BUSINESS.tagline}
            </motion.p>

            <motion.div variants={reduceMotion ? undefined : heroItem} className="max-w-md">
              <div className="-skew-x-2 rounded-lg bg-green-600 px-4 py-2 shadow-md sm:-skew-x-3">
                <p className="skew-x-2 font-serif text-base italic leading-snug text-white sm:skew-x-3 sm:text-lg">
                  Let&apos;s Build A Cleaner City Together!
                </p>
              </div>
            </motion.div>

            <motion.h1
              variants={reduceMotion ? undefined : heroItem}
              className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08] text-balance"
            >
              Reliable Waste Solutions For A{" "}
              <span className="text-green-600">Greener Tomorrow</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : heroItem}
              className="max-w-xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg"
            >
              From collection to recycling — we keep our city clean, safe and sustainable.
            </motion.p>
          </motion.div>

          {/* Service cards + desktop quote card (vertically centered together) */}
          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "show"}
            className="space-y-5 lg:col-span-12 lg:row-start-2 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:space-y-0 xl:gap-x-10"
          >
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {SERVICE_TILES.slice(0, 3).map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-green-100/80 bg-white/95 p-3 text-center shadow-md transition-all hover:-translate-y-0.5 hover:border-green-300 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <span className="text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
                      {label}
                    </span>
                  </Link>
                ))}
                <div className="col-span-3 grid grid-cols-6 gap-2.5 sm:gap-3">
                  {SERVICE_TILES.slice(3).map(({ label, href, icon: Icon }, index) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "group col-span-2 flex flex-col items-center gap-2 rounded-xl border border-green-100/80 bg-white/95 p-3 text-center shadow-md transition-all hover:-translate-y-0.5 hover:border-green-300 hover:shadow-lg",
                        index === 0 && "col-start-2"
                      )}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="relative hidden lg:col-span-5 lg:flex lg:justify-center"
              initial={reduceMotion ? false : { opacity: 0, x: 30 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroQuoteCard className="relative z-20 w-full max-w-sm rounded-2xl border border-green-100 bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6" />
            </motion.div>

            <div className="!mt-2 lg:hidden">
              <HeroTruckImage />
            </div>

            <div className="lg:hidden">
              <HeroQuoteCard className="relative z-20 mx-auto mt-4 max-w-md rounded-2xl border border-green-100 bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom feature strip — centered ticker, scrolls left to right */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-green-800 text-white">
        <HeroWave />
        <HeroFeatureTicker reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}
