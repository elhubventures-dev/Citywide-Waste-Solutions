import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allBlogPostsQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/client";
import { SectionHeader } from "@/components/ui/section-header";
import { formatDate } from "@/lib/utils";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { fallbackBlogCategories, fallbackBlogPosts } from "@/lib/fallback-blog-posts";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Blog | Waste & Recycling Insights",
  description: `Recycling tips, waste reduction guides, community news and environmental insights from the ${BUSINESS.name} team.`,
  alternates: { canonical: `${SITE_URL}/blog` },
};

// ─── Blog card ────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: any }) {
  const coverSrc =
    post.localImage ??
    (post.coverImage?.asset ? urlFor(post.coverImage).width(800).height(450).url() : null);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden bg-green-50 dark:bg-green-950/20">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={post.coverImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/40 dark:to-green-900/40">
            <span className="text-5xl opacity-30">🌿</span>
          </div>
        )}
        {/* Category badge */}
        {post.categories?.[0] && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
              {post.categories[0].label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min read
            </span>
          )}
        </div>

        <h2 className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-green-600">
          {post.title}
        </h2>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
          {post.author?.name && (
            <span className="text-xs text-muted-foreground">By {post.author.name}</span>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
            aria-label={`Read: ${post.title}`}
          >
            Read article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Featured post (first post, large) ───────────────────────────────────────
function FeaturedPost({ post }: { post: any }) {
  const coverSrc =
    post.localImage ??
    (post.coverImage?.asset ? urlFor(post.coverImage).width(1200).height(630).url() : null);

  return (
    <article className="group grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover lg:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-green-50 lg:aspect-auto">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={post.coverImage?.alt ?? post.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/40 dark:to-green-900/40">
            <span className="text-7xl opacity-20">🌿</span>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-earth-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center space-y-4 p-8">
        {post.categories?.[0] && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-green-600">
            <Tag className="h-3 w-3" />
            {post.categories[0].label}
          </span>
        )}

        <h2 className="text-balance text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-green-600 sm:text-3xl">
          {post.title}
        </h2>

        <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.author?.name && <span>By {post.author.name}</span>}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime && <span>{post.readingTime} min read</span>}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
        >
          Read Article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const [sanityPosts, sanityCategories] = await Promise.all([
    sanityFetch<any[]>(allBlogPostsQuery, {}, ["blog", "blog-list"]).catch(() => []),
    sanityFetch<any[]>(allCategoriesQuery, {}, ["categories"]).catch(() => []),
  ]);

  const posts = sanityPosts.length > 0 ? sanityPosts : fallbackBlogPosts;
  const categories = sanityCategories.length > 0 ? sanityCategories : fallbackBlogCategories;
  const activeCategory = searchParams.category;
  const filteredPosts = activeCategory
    ? posts.filter((p) => p.categories?.some((c: any) => c.slug === activeCategory))
    : posts;

  const [featured, ...rest] = filteredPosts;

  return (
    <>
      <PageHero
        eyebrow="Blog & Resources"
        title="Waste & Recycling Insights"
        description="Practical tips, community stories, and sustainability guides from our team in Ontario."
      />

      <MotionSection className="bg-background" animate={false}>
        {/* Category filter tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              !activeCategory
                ? "bg-green-500 text-white"
                : "border border-border text-muted-foreground hover:border-green-300 hover:text-green-600"
            }`}
          >
            All Posts {!activeCategory && `(${posts.length})`}
          </Link>
          {categories.map((cat: any) => {
            const count = posts.filter((p) =>
              p.categories?.some((c: any) => c.slug === cat.slug)
            ).length;
            return (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-green-500 text-white"
                    : "border border-border text-muted-foreground hover:border-green-300 hover:text-green-600"
                }`}
              >
                {cat.label} {count > 0 && `(${count})`}
              </Link>
            );
          })}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-2xl font-bold text-foreground">No posts yet</p>
            <p className="text-muted-foreground">Check back soon for articles in this category.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured first post */}
            {featured && <FeaturedPost post={featured} />}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <StaggerItem key={post._id}>
                    <BlogCard post={post} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        )}
      </MotionSection>
    </>
  );
}
