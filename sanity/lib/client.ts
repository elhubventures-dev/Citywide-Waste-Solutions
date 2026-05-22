import { createClient }  from "@sanity/client";
import imageUrlBuilder   from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

// ─── Read client (used in Server Components) ─────────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

// ─── Write client (used in Studio / webhooks) ─────────────────────────────────
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn:  false,
  token:   process.env.SANITY_API_TOKEN,
});

// ─── Image URL builder ────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── Typed fetch helper ───────────────────────────────────────────────────────
export async function sanityFetch<T = unknown>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
      tags,
    },
  });
}
