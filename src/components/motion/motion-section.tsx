"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /** When false, only the outer section wrapper is rendered (no reveal). */
  animate?: boolean;
  containerClassName?: string;
}

export function MotionSection({
  children,
  className,
  id,
  delay = 0,
  animate = true,
  containerClassName,
}: MotionSectionProps) {
  return (
    <section id={id} className={cn("section", className)}>
      {animate ? (
        <Reveal delay={delay} className={cn("container", containerClassName)}>
          {children}
        </Reveal>
      ) : (
        <div className={cn("container", containerClassName)}>{children}</div>
      )}
    </section>
  );
}
