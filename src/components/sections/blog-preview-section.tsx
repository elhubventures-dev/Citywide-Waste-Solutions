"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { fallbackBlogPosts } from "@/lib/fallback-blog-posts";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

function BlogCard({ post }: { post: (typeof fallbackBlogPosts)[number] }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-green-50 dark:bg-green-950/20">
        <Image
          src={post.localImage}
          alt={post.coverImage.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            {post.categories[0].label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString("en-CA", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>

        <h3 className="line-clamp-2 font-bold leading-snug text-foreground transition-colors group-hover:text-green-600">
          {post.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
        >
          Read article
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export function BlogPreviewSection() {
  return (
    <section className="section bg-background" aria-labelledby="blog-heading">
      <div className="container">
        <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Resources"
            title="Waste & Recycling Insights"
            subtitle="Practical tips, community news, and sustainability advice from our team."
            id="blog-heading"
          />
          <Button asChild variant="outline" size="md" className="hidden shrink-0 sm:inline-flex">
            <Link href="/blog">
              All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        {/* Category filters */}
        <Reveal delay={0.05} className="mb-8 flex flex-wrap gap-2">
          <button className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-semibold text-white">
            All
          </button>
          {BLOG_CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-green-300 hover:text-green-600"
            >
              {cat.label}
            </Link>
          ))}
        </Reveal>

        {/* Posts grid */}
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fallbackBlogPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
