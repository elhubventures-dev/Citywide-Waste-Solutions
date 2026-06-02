import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Phone, ChevronDown } from "lucide-react";
import { sanityFetch, urlFor } from "@/sanity/lib/client";
import { serviceBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@/components/blog/portable-text";
import { QuoteForm } from "@/components/forms/quote-form";
import { SERVICES, BUSINESS, SITE_URL } from "@/lib/constants";
import { getServiceIcon } from "@/lib/service-icons";
import { ServicePageHero } from "@/components/motion/service-page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const sanityService = await sanityFetch<any>(serviceBySlugQuery, { slug: params.slug }, [
    "services",
  ]).catch(() => null);

  const staticService = SERVICES.find((s) => s.slug === params.slug);
  const title = sanityService?.seo?.metaTitle ?? sanityService?.title ?? staticService?.title;
  const description =
    sanityService?.seo?.metaDescription ?? sanityService?.description ?? staticService?.description;

  if (!title) return { title: "Service Not Found" };

  return {
    title: `${title} in Ontario`,
    description:
      description ?? `Professional ${title} services across Ontario. Get your free quote today.`,
    alternates: { canonical: `${SITE_URL}/services/${params.slug}` },
  };
}

// ─── FAQ Accordion (client needed for open/close — using details/summary) ─────
function FaqAccordion({ faqs }: { faqs: { _id: string; question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq._id}
          className="group overflow-hidden rounded-xl border border-border bg-card shadow-card"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground transition-colors hover:text-green-600">
            {faq.question}
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ServicePage({ params }: { params: { slug: string } }) {
  const staticService = SERVICES.find((s) => s.slug === params.slug);
  if (!staticService) notFound();

  // Try to get enriched content from Sanity
  const sanityService = await sanityFetch<any>(serviceBySlugQuery, { slug: params.slug }, [
    "services",
  ]).catch(() => null);

  const title = sanityService?.title ?? staticService.title;
  const description = sanityService?.description ?? staticService.description;
  const features = sanityService?.features ?? staticService.features;
  const price = sanityService?.price ?? staticService.price;
  const faqs = sanityService?.faqs ?? [];
  const details = sanityService?.longDescription ? null : (staticService as any).details;
  const heroSrc = sanityService?.heroImage?.asset
    ? urlFor(sanityService.heroImage).width(1200).height(600).url()
    : null;

  // JSON-LD Service schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      url: SITE_URL,
    },
    areaServed: ["Durham", "Scarborough", "Vaughan", "Toronto"],
    url: `${SITE_URL}/services/${params.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <ServicePageHero
        title={title}
        description={description}
        slug={params.slug}
        heroSrc={heroSrc}
      />

      <MotionSection className="bg-background">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Left — content */}
          <div className="space-y-12 lg:col-span-2">
            {/* Price badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300">
              💰 Starting price: {price}
            </div>

            {/* Features */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">What's Included</h2>
              <Stagger className="grid gap-3 sm:grid-cols-2">
                {features.map((f: string) => (
                  <StaggerItem key={f}>
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm font-medium text-foreground">{f}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Long description (Sanity if available, else static details) */}
            {sanityService?.longDescription && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">About This Service</h2>
                <PortableText value={sanityService.longDescription} />
              </div>
            )}
            {!sanityService?.longDescription && typeof details === "string" && details.trim() && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">About This Service</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{details}</p>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div id="faqs">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
                <FaqAccordion faqs={faqs} />
              </div>
            )}
          </div>

          {/* Right — sticky quote form */}
          <div className="lg:col-span-1">
            <div
              id="quote"
              className="scroll-mt-header sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <h2 className="mb-1 text-xl font-bold text-foreground">Get Your Free Quote</h2>
              <p className="mb-6 text-sm text-muted-foreground">Respond within 2 business hours.</p>
              <QuoteForm defaultService={title} compact />
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-section-alt">
        <h2 className="mb-8 text-2xl font-bold text-foreground">Other Services We Offer</h2>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.filter((s) => s.slug !== params.slug).map((s) => {
            const S = getServiceIcon(s.slug);
            return (
              <StaggerItem key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-card-hover"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white dark:bg-green-950/40">
                    <S className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-green-600">
                      {s.shortTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.price}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </MotionSection>
    </>
  );
}
