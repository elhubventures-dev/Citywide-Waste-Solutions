"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// Placeholder posts until Sanity is wired up (Phase 4)
const PLACEHOLDER_POSTS = [
  {
    slug:        "how-to-reduce-household-waste-ontario",
    title:       "10 Practical Ways to Reduce Household Waste in Ontario",
    excerpt:     "Small changes at home can make a big impact on Ontario's recycling targets. Here's where to start this month.",
    category:    "Recycling Tips",
    publishedAt: "2024-11-15",
    readingTime: "4 min read",
    image:       SITE_IMAGES.blog.recycling,
  },
  {
    slug:        "construction-debris-disposal-ontario-guide",
    title:       "The Complete Guide to Construction Debris Disposal in Ontario",
    excerpt:     "Renovation season means mountains of debris. Know your options — what's recyclable, what isn't, and how to stay compliant.",
    category:    "Waste Reduction",
    publishedAt: "2024-11-08",
    readingTime: "6 min read",
    image:       SITE_IMAGES.blog.commercial,
  },
  {
    slug:        "courtice-brampton-community-cleanup-2024",
    title:       "How Courtice & Brampton Led Ontario's Cleanest Community Initiative",
    excerpt:     "Citywide Waste Solutions partnered with local governments to divert 12 tonnes of waste from landfill this fall.",
    category:    "Community Cleanup",
    publishedAt: "2024-10-28",
    readingTime: "3 min read",
    image:       SITE_IMAGES.blog.community,
  },
];

function BlogCard({ post }: { post: (typeof PLACEHOLDER_POSTS)[number] }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <div className="aspect-video bg-green-50 dark:bg-green-950/20 relative overflow-hidden">
        <Image
          src={post.image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>

        <h3 className="font-bold leading-snug text-foreground group-hover:text-green-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
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
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <SectionHeader
            eyebrow="Resources"
            title="Waste & Recycling Insights"
            subtitle="Practical tips, community news, and sustainability advice from our team."
            id="blog-heading"
          />
          <Button asChild variant="outline" size="md" className="shrink-0 hidden sm:inline-flex">
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
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-green-300 hover:text-green-600 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </Reveal>

        {/* Posts grid */}
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_POSTS.map((post) => (
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
