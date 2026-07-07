import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { sanityFetch, urlFor } from "@/sanity/lib/client";
import { blogPostBySlugQuery, allBlogSlugsQuery, relatedPostsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/components/blog/portable-text";
import { PageHero } from "@/components/motion/page-hero";
import { formatDate } from "@/lib/utils";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { RELOCATE_SITE_URL } from "@/lib/moving/business";
import {
  fallbackBlogPosts,
  getFallbackBlogPost,
  getFallbackRelatedPosts,
} from "@/lib/fallback-blog-posts";

// ─── Static params for ISR ────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<string[]>(allBlogSlugsQuery);
    return Array.from(new Set([...slugs, ...fallbackBlogPosts.map((post) => post.slug)])).map(
      (slug) => ({ slug })
    );
  } catch {
    return fallbackBlogPosts.map((post) => ({ slug: post.slug }));
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const sanityPost = await sanityFetch<any>(blogPostBySlugQuery, { slug: params.slug }, [
    "blog",
  ]).catch(() => null);
  const post = sanityPost ?? getFallbackBlogPost(params.slug);

  if (!post) return { title: "Post Not Found" };

  const ogImage =
    post.localImage ??
    (post.seo?.ogImage?.asset
      ? urlFor(post.seo.ogImage).width(1200).height(630).url()
      : post.coverImage?.asset
        ? urlFor(post.coverImage).width(1200).height(630).url()
        : undefined);

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

// ─── Related post card (compact) ─────────────────────────────────────────────
function RelatedPostCard({ post }: { post: any }) {
  const src =
    post.localImage ??
    (post.coverImage?.asset ? urlFor(post.coverImage).width(400).height(225).url() : null);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:border-green-200 hover:shadow-card-hover"
    >
      {src && (
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image src={src} alt={post.title} fill className="object-cover" sizes="96px" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-green-600">
          {post.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const sanityPost = await sanityFetch<any>(blogPostBySlugQuery, { slug: params.slug }, [
    "blog",
  ]).catch(() => null);
  const post = sanityPost ?? getFallbackBlogPost(params.slug);

  if (!post) notFound();

  const categorySlugs = post.categories?.map((c: any) => c.slug) ?? [];
  const sanityRelated = sanityPost
    ? await sanityFetch<any[]>(
        relatedPostsQuery,
        { currentSlug: params.slug, categories: categorySlugs },
        ["blog"]
      ).catch(() => [])
    : [];
  const related =
    sanityRelated.length > 0 ? sanityRelated : getFallbackRelatedPosts(params.slug, categorySlugs);

  const isMovingPost = categorySlugs.includes("moving-services");

  const coverSrc =
    post.localImage ??
    (post.coverImage?.asset ? urlFor(post.coverImage).width(1200).height(630).url() : null);

  const avatarSrc = post.author?.avatar?.asset
    ? urlFor(post.author.avatar).width(80).height(80).url()
    : null;

  // JSON-LD Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: coverSrc ?? undefined,
    author: {
      "@type": "Person",
      name: post.author?.name ?? BUSINESS.name,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` },
    },
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageHero
        eyebrow={post.categories?.[0]?.label ?? "Blog"}
        title={post.title}
        description={post.excerpt}
        size="large"
        overlayImageSrc={coverSrc}
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/85">
          {post.author && (
            <div className="flex items-center gap-2.5">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={post.author.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          )}
        </div>
      </PageHero>

      {/* Article */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-green-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Categories */}
            {post.categories?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/blog?category=${cat.slug}`}
                    className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 transition-colors hover:bg-green-200 dark:bg-green-950/40 dark:text-green-300"
                  >
                    <Tag className="h-3 w-3" />
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Body content */}
            {post.body && <PortableText value={post.body} />}

            {/* Share */}
            <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
              <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              {[
                {
                  label: "Twitter/X",
                  href: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`,
                },
                {
                  label: "Facebook",
                  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`,
                },
                {
                  label: "LinkedIn",
                  href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`,
                },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-green-300 hover:text-green-600"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-8">
            {/* CTA box */}
            <div className="rounded-2xl bg-hero-gradient p-6 text-white">
              {isMovingPost ? (
                <>
                  <h3 className="mb-2 text-lg font-bold">Planning a Move?</h3>
                  <p className="mb-4 text-sm text-white/75">
                    Visit Citywide Moving Solutions for services, pricing, and a free quote.
                  </p>
                  <div className="space-y-3">
                    <a
                      href={RELOCATE_SITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
                    >
                      Visit Moving Website
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href={`${RELOCATE_SITE_URL}/contact#quote`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/80 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Get Free Moving Quote
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mb-2 text-lg font-bold">Need Waste Pickup?</h3>
                  <p className="mb-4 text-sm text-white/75">
                    Get a free quote tailored to your home or business.
                  </p>
                  <Link
                    href="/contact#quote"
                    className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
                  >
                    Get Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <RelatedPostCard key={r._id} post={r} />
                  ))}
                </div>
              </div>
            )}

            {/* Category links */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Browse Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/blog?category=${cat.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-green-300 hover:text-green-600"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
