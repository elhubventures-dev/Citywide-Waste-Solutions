"use client";

import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";

interface PageHeroBackgroundProps {
  /** Override default page-banner truck image */
  imageSrc?: string;
  priority?: boolean;
}

/** Faded photo + brand gradient — used behind inner-page hero text */
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
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />
      {/* Fade photo into brand colors */}
      <div className="absolute inset-0 bg-green-950/55" />
      <div className="absolute inset-0 bg-hero-gradient opacity-80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/75 to-blue-950/65" />
      <div
        className="absolute inset-0 bg-dots opacity-[0.07]"
        style={{ backgroundSize: "24px 24px" }}
      />
    </div>
  );
}
