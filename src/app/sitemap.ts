import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { allBlogSlugsQuery } from "@/sanity/lib/queries";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { fallbackBlogPosts } from "@/lib/fallback-blog-posts";

import { SITE_URL } from "@/lib/business";

const BASE = SITE_URL;
const NOW = new Date().toISOString();

// Priority and changefreq guide:
//   Homepage           1.0  daily
//   Service pages      0.9  monthly
//   City pages         0.9  monthly
//   Pricing / About    0.8  monthly
//   Blog posts         0.7  weekly
//   Blog index         0.8  daily
//   Contact            0.6  yearly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: NOW, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/recycling`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: NOW, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/service-areas`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── Service pages ──────────────────────────────────────────────────────
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // ── Service area pages ─────────────────────────────────────────────────
  const areaPages: MetadataRoute.Sitemap = SERVICE_AREAS.map((a) => ({
    url: `${BASE}/service-areas/${a.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // ── Blog posts (from Sanity) ───────────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await sanityFetch<string[]>(allBlogSlugsQuery);
    const allSlugs = Array.from(new Set([...slugs, ...fallbackBlogPosts.map((post) => post.slug)]));
    blogPages = allSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    blogPages = fallbackBlogPosts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  return [...staticPages, ...servicePages, ...areaPages, ...blogPages];
}
