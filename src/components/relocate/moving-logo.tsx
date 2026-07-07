"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { relocateHref } from "@/lib/moving/paths";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/site-images";
import { MOVING_BUSINESS } from "@/lib/moving/business";

interface RelocateLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  path: string;
  href?: string;
}

/** Link that resolves correctly on relocate subdomain and /relocate preview paths. */
export function RelocateLink({ path, href, className, children, ...props }: RelocateLinkProps) {
  const [resolved, setResolved] = useState(href ?? relocateHref(path));

  useEffect(() => {
    setResolved(href ?? relocateHref(path, window.location.host));
  }, [path, href]);

  return (
    <Link href={resolved} className={className} {...props}>
      {children}
    </Link>
  );
}

interface MovingLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  variant?: "light" | "dark";
}

export function MovingLogo({ size = "md", className, priority = false, variant = "light" }: MovingLogoProps) {
  const sizeClass = {
    sm: "h-9 w-auto",
    md: "h-11 w-auto sm:h-12",
    lg: "h-14 w-auto sm:h-16",
  }[size];

  return (
    <RelocateLink
      path="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label={`${MOVING_BUSINESS.name} — Home`}
    >
      <Image
        src={variant === "dark" ? SITE_IMAGES.logos.dark : SITE_IMAGES.logos.header}
        alt={MOVING_BUSINESS.name}
        width={280}
        height={72}
        priority={priority}
        className={cn(sizeClass, "shrink-0")}
      />
      <div className="hidden min-w-0 flex-col leading-tight sm:flex">
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            variant === "dark" ? "text-brand-green" : "text-green-200"
          )}
        >
          Moving Solutions
        </span>
        <span
          className={cn(
            "truncate text-xs font-medium",
            variant === "dark" ? "text-muted-foreground" : "text-white/70"
          )}
        >
          {MOVING_BUSINESS.tagline}
        </span>
      </div>
    </RelocateLink>
  );
}
