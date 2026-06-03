import type { Metadata } from "next";

import { BUSINESS, SITE_URL } from "./business";

const SITE_NAME = BUSINESS.name;

export { SITE_URL };

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image = "/og-image.jpg",
  noIndex = false,
  type = "website",
  publishedAt,
  author,
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_CA",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedAt
        ? { publishedTime: publishedAt, authors: author ? [author] : undefined }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ─── Page-specific metadata presets ──────────────────────────────────────────

export const homeMetadata: Metadata = buildMetadata({
  title: `${SITE_NAME} | Reliable Waste Collection in Ontario`,
  description:
    "Professional waste collection, recycling, junk removal & dumpster rental across Ontario — Durham, Scarborough, Vaughan & Toronto. Get a free quote today.",
  path: "/",
});

export const servicesMetadata: Metadata = buildMetadata({
  title: "Waste Management Services | Ontario",
  description:
    "Residential, commercial, recycling, dumpster rental, junk removal, and construction waste services across Ontario. Transparent pricing, reliable crews.",
  path: "/services",
});

export const areasMetadata: Metadata = buildMetadata({
  title: "Service Areas | Ontario Waste Collection",
  description:
    "We serve Durham, Scarborough, Vaughan, and Toronto. Local crews, on-time pickups, and eco-conscious disposal.",
  path: "/service-areas",
});

// ─── JSON-LD schema builders ─────────────────────────────────────────────────

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, href }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE_URL}${href}`,
    })),
  };
}

export function buildServiceSchema(
  name: string,
  description: string,
  slug: string,
  price?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}/services/${slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: BUSINESS.phoneRaw,
      email: BUSINESS.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        addressRegion: "ON",
        postalCode: BUSINESS.address.postal,
        addressCountry: "CA",
      },
    },
    areaServed: [
      { "@type": "City", name: "Vaughan", addressRegion: "ON" },
      { "@type": "City", name: "Toronto", addressRegion: "ON" },
      { "@type": "City", name: "Clarington", addressRegion: "ON" },
      ],
    ...(price ? { offers: { "@type": "Offer", price, priceCurrency: "CAD" } } : {}),
  };
}
