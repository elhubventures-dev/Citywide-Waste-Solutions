"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/site-images";

type LogoVariant = "header" | "light" | "dark" | "footer" | "on-green";

const LOGO_SRC: Record<LogoVariant, { src: string; width: number; height: number }> = {
  header:     { src: SITE_IMAGES.logos.header,   width: 300, height: 78 },
  light:      { src: SITE_IMAGES.logos.light,    width: 280, height: 72 },
  dark:       { src: SITE_IMAGES.logos.dark,     width: 280, height: 72 },
  footer:     { src: SITE_IMAGES.logos.footer,   width: 300, height: 78 },
  "on-green": { src: SITE_IMAGES.logos.onGreen, width: 260, height: 68 },
};

const LOGO_SIZE_CLASS = {
  sm: "h-10 w-auto sm:h-11",
  md: "h-12 w-auto sm:h-14",
  lg: "h-14 w-auto sm:h-16",
  xl: "h-20 w-auto sm:h-24 md:h-28",
} as const;

interface LogoProps {
  variant?: LogoVariant;
  size?: keyof typeof LOGO_SIZE_CLASS;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "light",
  size = "md",
  className,
  priority = false,
}: LogoProps) {
  const { src, width, height } = LOGO_SRC[variant];

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Citywide Waste Solutions — Home"
    >
      <Image
        src={src}
        alt="Citywide Waste Solutions"
        width={width}
        height={height}
        priority={priority}
        className={LOGO_SIZE_CLASS[size]}
      />
    </Link>
  );
}
