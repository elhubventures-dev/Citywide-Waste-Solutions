"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer, VIEWPORT } from "@/lib/motion-presets";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "article" | "li";
}

export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeInUp,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={VIEWPORT}
      variants={reduceMotion ? undefined : variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={VIEWPORT}
      variants={reduceMotion ? undefined : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={reduceMotion ? undefined : fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
