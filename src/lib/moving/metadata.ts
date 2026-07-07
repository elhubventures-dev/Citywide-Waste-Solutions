import type { Metadata } from "next";
import { MOVING_BUSINESS, RELOCATE_SITE_URL } from "./business";

interface MovingMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function buildMovingMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
}: MovingMetaOptions): Metadata {
  const url = `${RELOCATE_SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${RELOCATE_SITE_URL}${image}`;

  return {
    title,
    description,
    metadataBase: new URL(RELOCATE_SITE_URL),
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: MOVING_BUSINESS.name,
      title,
      description,
      locale: "en_CA",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
