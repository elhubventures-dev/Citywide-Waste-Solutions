"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // for dark backgrounds
  id?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <div
          className="flex items-center gap-2"
          style={centered ? { justifyContent: "center" } : {}}
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]",
              light ? "text-green-200" : "text-green-600"
            )}
          >
            <span className="h-px w-6 bg-current" />
            {eyebrow}
            <span className="h-px w-6 bg-current" />
          </span>
        </div>
      )}

      <h2
        id={id}
        className={cn(
          "text-balance font-bold tracking-tight",
          centered ? "text-3xl sm:text-4xl lg:text-5xl" : "text-3xl sm:text-4xl",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-lg leading-relaxed",
            centered && "mx-auto max-w-2xl",
            light ? "text-white/75" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
