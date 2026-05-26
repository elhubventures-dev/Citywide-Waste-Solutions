"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { heroItem, heroStagger } from "@/lib/motion-presets";
import { ParallaxOrbs } from "@/components/motion/parallax";
import { PageHeroBackground } from "@/components/motion/page-hero-background";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "large";
  centered?: boolean;
  /** Optional alternate background (defaults to page banner truck) */
  backgroundImage?: string;
  /** Faint image layered on top of the page banner (e.g. blog cover) */
  overlayImageSrc?: string | null;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  size = "default",
  centered = false,
  backgroundImage,
  overlayImageSrc,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        size === "large" ? "py-20 lg:py-28" : "py-16 lg:py-24",
        className
      )}
    >
      <PageHeroBackground imageSrc={backgroundImage} priority />
      {overlayImageSrc && (
        <div className="absolute inset-0 z-[1]" aria-hidden>
          <Image
            src={overlayImageSrc}
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-overlay"
            sizes="100vw"
          />
        </div>
      )}
      <ParallaxOrbs />
      <div
        className={cn(
          "container relative z-10",
          centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"
        )}
      >
        <motion.div
          className="space-y-5"
          variants={reduceMotion ? undefined : heroStagger}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
        >
          <motion.span
            variants={reduceMotion ? undefined : heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm"
          >
            {eyebrow}
          </motion.span>
          <motion.h1
            variants={reduceMotion ? undefined : heroItem}
            className={cn(
              "text-balance font-bold text-white drop-shadow-sm",
              size === "large" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-4xl sm:text-5xl"
            )}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={reduceMotion ? undefined : heroItem}
              className="max-w-2xl text-lg leading-relaxed text-white/85 drop-shadow-sm sm:text-xl"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div variants={reduceMotion ? undefined : heroItem}>{children}</motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
