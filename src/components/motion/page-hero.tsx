"use client";

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
      <ParallaxOrbs />
      <div
        className={cn(
          "container relative z-10",
          centered ? "max-w-2xl mx-auto text-center" : "max-w-3xl"
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
              "font-bold text-white text-balance drop-shadow-sm",
              size === "large"
                ? "text-4xl sm:text-5xl lg:text-6xl"
                : "text-4xl sm:text-5xl"
            )}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={reduceMotion ? undefined : heroItem}
              className="max-w-2xl text-lg text-white/85 leading-relaxed sm:text-xl drop-shadow-sm"
            >
              {description}
            </motion.p>
          )}
          {children && (
            <motion.div variants={reduceMotion ? undefined : heroItem}>
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
