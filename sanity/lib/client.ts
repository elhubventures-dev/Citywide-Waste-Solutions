import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";
export const isSanityConfigured = Boolean(projectId);

// ─── Read client (used in Server Components) ─────────────────────────────────
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
    })
  : null;

// ─── Write client (used in Studio / webhooks) ─────────────────────────────────
export const sanityWriteClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    })
  : null;

// ─── Image URL builder ────────────────────────────────────────────────────────
const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required to build Sanity image URLs.");
  }

  return builder.image(source);
}

// ─── Typed fetch helper ───────────────────────────────────────────────────────
export async function sanityFetch<T = unknown>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  if (!sanityClient) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required to fetch Sanity content.");
  }

  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
      tags,
    },
  });
}
