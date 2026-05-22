import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://citywidewastesolutions.ca";

  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  [
          "/admin/",
          "/api/",
          "/studio/",
          "/_next/",
          "/pay/success",
        ],
      },
      {
        // Block AI training scrapers
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow:  "/",
      },
    ],
    sitemap:  `${siteUrl}/sitemap.xml`,
    host:     siteUrl,
  };
}
