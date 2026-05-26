"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";

interface PageHeroBackgroundProps {
  /** Override default page-banner truck image */
  imageSrc?: string;
  priority?: boolean;
}

/** Faded photo + dark overlay — keeps text readable on inner-page heroes */
export function PageHeroBackground({
  imageSrc = SITE_IMAGES.hero.pageBanner,
  priority = false,
}: PageHeroBackgroundProps) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={priority}
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Dark base so bright areas of the photo don't wash out text */}
      <div className="absolute inset-0 bg-green-950/60" />
      <div className="bg-black/22 absolute inset-0" />
      {/* Brand tint + extra weight on the left where headings sit */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-950/65 to-green-900/50" />
      <div className="from-green-950/32 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      <div
        className="bg-dots absolute inset-0 opacity-[0.04]"
        style={{ backgroundSize: "24px 24px" }}
      />
    </div>
  );
}
