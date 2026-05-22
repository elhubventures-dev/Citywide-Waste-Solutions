"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

/** Vertical shift based on scroll through the element. */
export function ParallaxLayer({ children, className, speed = 24 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} className={cn("pointer-events-none", className)}>
      <motion.div style={reduceMotion ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Floating hero blobs with parallax + CSS float. */
export function ParallaxOrbs() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <>
      <ParallaxLayer
        speed={36}
        className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl animate-float"
      >
        <div className="h-full w-full rounded-full bg-white/5" />
      </ParallaxLayer>
      <ParallaxLayer
        speed={-28}
        className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-green-400/10 blur-3xl animate-float-slow"
      >
        <div className="h-full w-full rounded-full bg-green-400/10" />
      </ParallaxLayer>
    </>
  );
}

interface ParallaxImageWrapProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxImageWrap({ children, className, speed = 18 }: ParallaxImageWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 0.5, -speed * 0.5]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="h-full w-full"
        style={reduceMotion ? undefined : { y, scale: 1.04 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
