"use client";

import { PortableText as SanityPortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─── Callout block component ─────────────────────────────────────────────────
const CALLOUT_STYLES = {
  info: {
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
    textColor: "text-blue-900 dark:text-blue-100",
  },
  tip: {
    bg: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
    icon: Lightbulb,
    iconColor: "text-green-600",
    textColor: "text-green-900 dark:text-green-100",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    textColor: "text-amber-900 dark:text-amber-100",
  },
  success: {
    bg: "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-700",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    textColor: "text-green-900 dark:text-green-100",
  },
} as const;

// ─── Portable Text component map ──────────────────────────────────────────────
const components = {
  types: {
    // Image block
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).url();
      return (
        <figure className="my-8">
          <div className="relative overflow-hidden rounded-xl border border-border">
            <Image
              src={src}
              alt={value.alt ?? "Blog image"}
              width={1200}
              height={675}
              className="w-full object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Callout block
    callout: ({ value }: any) => {
      const style = CALLOUT_STYLES[(value.type as keyof typeof CALLOUT_STYLES) ?? "tip"];
      const Icon = style.icon;
      return (
        <div className={cn("my-6 flex gap-3 rounded-xl border p-4", style.bg)}>
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} />
          <p className={cn("text-sm leading-relaxed", style.textColor)}>{value.text}</p>
        </div>
      );
    },

    // In-article CTA block (fallback blog posts)
    cta: ({ value }: any) => {
      const isExternal = (href: string) => href.startsWith("http");

      const renderButton = (
        href: string,
        label: string,
        variant: "primary" | "outline-invert" = "primary"
      ) => {
        if (isExternal(href)) {
          return (
            <Button asChild variant={variant} size="md">
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          );
        }
        return (
          <Button asChild variant={variant} size="md">
            <Link href={href}>
              {label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        );
      };

      return (
        <div className="my-10 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-card dark:border-green-900/40 dark:from-green-950/20 dark:to-card md:p-8">
          {value.title && (
            <h3 className="text-xl font-bold tracking-tight text-foreground">{value.title}</h3>
          )}
          {value.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              {value.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {value.primaryHref && value.primaryLabel &&
              renderButton(value.primaryHref, value.primaryLabel, "primary")}
            {value.secondaryHref && value.secondaryLabel &&
              renderButton(value.secondaryHref, value.secondaryLabel, "outline-invert")}
          </div>
        </div>
      );
    },
  },

  block: {
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed text-foreground/80">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="mb-3 mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mb-3 mt-8 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-foreground">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l-4 border-green-500 pl-5 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-4 ml-5 list-disc space-y-1.5 text-foreground/80">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-foreground/80">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },

  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }: any) => (
      <del className="text-muted-foreground line-through">{children}</del>
    ),
    code: ({ children }: any) => (
      <code className="rounded bg-green-50 px-1.5 py-0.5 font-mono text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
        {children}
      </code>
    ),
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : "_self"}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="font-medium text-green-600 underline underline-offset-2 transition-colors hover:text-green-700"
      >
        {children}
      </a>
    ),
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────
export function PortableText({
  value,
  className,
}: {
  value: PortableTextBlock[];
  className?: string;
}) {
  return (
    <div className={cn("max-w-none", className)}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
