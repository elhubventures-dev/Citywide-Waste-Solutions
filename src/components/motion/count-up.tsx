"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STATS } from "@/lib/constants";

export type ParsedStat = {
  target: number;
  prefix: string;
  suffix: string;
  decimals: number;
};

export function parseStatValue(raw: string): ParsedStat {
  const match = raw.trim().match(/^([^\d]*)(\d+(?:\.\d+)?)(k)?(.*)$/i);
  if (!match) {
    return { target: 0, prefix: "", suffix: raw, decimals: 0 };
  }
  const [, prefix = "", num, k, rest = ""] = match;
  return {
    target: parseFloat(num),
    prefix,
    suffix: `${k ? "k" : ""}${rest}`,
    decimals: num.includes(".") ? 1 : 0,
  };
}

function formatStat(n: number, parsed: ParsedStat): string {
  const rounded =
    parsed.decimals > 0 ? n.toFixed(parsed.decimals) : String(Math.round(n));
  return `${parsed.prefix}${rounded}${parsed.suffix}`;
}

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

export function CountUp({ value, className, duration = 1.4 }: CountUpProps) {
  const parsed = parseStatValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? parsed.target : 0);

  useEffect(() => {
    if (reduceMotion || !inView) {
      if (reduceMotion) setDisplay(parsed.target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const ms = duration * 1000;

    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(parsed.target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, parsed.target, duration]);

  return (
    <span ref={ref} className={className}>
      {formatStat(display, parsed)}
    </span>
  );
}

interface StatsGridProps {
  stats?: readonly { value: string; label: string }[];
  className?: string;
  valueClassName?: string;
  variant?: "hero" | "card";
}

export function StatsGrid({
  stats = STATS,
  className,
  valueClassName,
  variant = "card",
}: StatsGridProps) {
  if (variant === "hero") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-8 sm:justify-between", className)}>
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <CountUp
              value={value}
              className={cn("text-2xl font-bold text-white", valueClassName)}
            />
            <div className="text-xs text-white/60">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-5 shadow-card text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <CountUp
            value={value}
            className={cn("text-3xl font-bold text-green-600", valueClassName)}
          />
          <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        </div>
      ))}
    </div>
  );
}
