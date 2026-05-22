import type { Metadata } from "next";
import { notFound }      from "next/navigation";
import Image             from "next/image";
import Link              from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { sanityFetch, urlFor } from "@/sanity/lib/client";
import { blogPostBySlugQuery, allBlogSlugsQuery, relatedPostsQuery } from "@/sanity/lib/queries";
import { PortableText }  from "@/components/blog/portable-text";
import { formatDate }    from "@/lib/utils";
import { BUSINESS, SITE_URL } from "@/lib/constants";

// ─── Static params for ISR ────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<string[]>(allBlogSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await sanityFetch<any>(
    blogPostBySlugQuery,
    { slug: params.slug },
    ["blog"]
  );

  if (!post) return { title: "Post Not Found" };

  const ogImage = post.seo?.ogImage?.asset
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title:       post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates:  { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title:     post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      type:      "article",
      publishedTime: post.publishedAt,
      authors:   post.author?.name ? [post.author.name] : undefined,
      images:    ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

// ─── Related post card (compact) ─────────────────────────────────────────────
function RelatedPostCard({ post }: { post: any }) {
  const src = post.coverImage?.asset
    ? urlFor(post.coverImage).width(400).height(225).url()
    : null;

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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-green-600 transition-colors line-clamp-2">
          {post.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await sanityFetch<any>(
    blogPostBySlugQuery,
    { slug: params.slug },
    ["blog"]
  );

  if (!post) notFound();

  const categorySlugs = post.categories?.map((c: any) => c.slug) ?? [];
  const related = await sanityFetch<any[]>(
    relatedPostsQuery,
    { currentSlug: params.slug, categories: categorySlugs },
    ["blog"]
  );

  const coverSrc = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : null;

  const avatarSrc = post.author?.avatar?.asset
    ? urlFor(post.author.avatar).width(80).height(80).url()
    : null;

  // JSON-LD Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type":    "Article",
    headline:   post.title,
    description: post.excerpt,
    image:      coverSrc ?? undefined,
    author: {
      "@type": "Person",
      name:    post.author?.name ?? BUSINESS.name,
    },
    publisher: {
      "@type": "Organization",
      name:    BUSINESS.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.jpg` },
    },
    datePublished: post.publishedAt,
    dateModified:  post._updatedAt ?? post.publishedAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero image */}
      {coverSrc && (
        <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-green-950">
          <Image
            src={coverSrc}
            alt={post.coverImage?.alt ?? post.title}
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      )}

      {/* Article */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-3">

          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
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
                    className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors dark:bg-green-950/40 dark:text-green-300"
                  >
                    <Tag className="h-3 w-3" />
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-2.5">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={post.author.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                </div>
              )}

              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>

              {post.readingTime && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
              )}
            </div>

            {/* Excerpt */}
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground border-l-4 border-green-500 pl-5 italic">
              {post.excerpt}
            </p>

            {/* Body content */}
            {post.body && <PortableText value={post.body} />}

            {/* Share */}
            <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
              <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              {[
                { label: "Twitter/X", href: `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}` },
                { label: "Facebook",  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}` },
                { label: "LinkedIn",  href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}` },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-green-300 hover:text-green-600 transition-colors"
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
              <h3 className="text-lg font-bold mb-2">Need Waste Pickup?</h3>
              <p className="text-sm text-white/75 mb-4">
                Get a free quote tailored to your home or business.
              </p>
              <Link
                href="/contact#quote"
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors"
              >
                Get Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
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
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Browse Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/blog?category=${cat.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-green-300 hover:text-green-600 transition-colors"
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
