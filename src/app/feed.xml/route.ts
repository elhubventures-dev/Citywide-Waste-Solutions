import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/client";
import { allBlogPostsQuery } from "@/sanity/lib/queries";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { fallbackBlogPosts } from "@/lib/fallback-blog-posts";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export async function GET() {
  const sanityPosts = await sanityFetch<any[]>(allBlogPostsQuery).catch(() => []);
  const posts = sanityPosts.length > 0 ? sanityPosts : fallbackBlogPosts;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;

  const items = posts
    .slice(0, 20)
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ""}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.categories?.map((c: any) => `<category><![CDATA[${c.label}]]></category>`).join("\n      ") ?? ""}
      ${post.author?.name ? `<author>${post.author.name}</author>` : ""}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BUSINESS.name} — Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Recycling tips, waste reduction guides, and community news from Ontario's trusted waste management partner.</description>
    <language>en-CA</language>
    <managingEditor>${BUSINESS.email} (${BUSINESS.name})</managingEditor>
    <webMaster>${BUSINESS.email}</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>${BUSINESS.name}</title>
      <link>${siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
