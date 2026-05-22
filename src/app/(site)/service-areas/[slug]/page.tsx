import type { Metadata }  from "next";
import { notFound }        from "next/navigation";
import Link                from "next/link";
import { MapPin, Users, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { sanityFetch }     from "@/sanity/lib/client";
import { serviceAreaBySlugQuery } from "@/sanity/lib/queries";
import { PortableText }    from "@/components/blog/portable-text";
import { QuoteForm }       from "@/components/forms/quote-form";
import { BUSINESS, SERVICE_AREAS, SERVICES, SITE_URL } from "@/lib/constants";
import { getServiceIcon } from "@/lib/service-icons";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export async function generateStaticParams() {
  return SERVICE_AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const area   = SERVICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) return { title: "Area Not Found" };

  return {
    title:       `Waste Collection & Recycling in ${area.name}, Ontario`,
    description: `Professional residential and commercial waste collection, junk removal, and recycling services in ${area.name}, Ontario. Get your free quote from ${BUSINESS.name}.`,
    alternates:  { canonical: `${SITE_URL}/service-areas/${params.slug}` },
  };
}

export default async function ServiceAreaPage({
  params,
}: {
  params: { slug: string };
}) {
  const staticArea = SERVICE_AREAS.find((a) => a.slug === params.slug);
  if (!staticArea) notFound();

  const sanityArea = await sanityFetch<any>(
    serviceAreaBySlugQuery, { slug: params.slug }, ["service-areas"]
  ).catch(() => null);

  const name        = sanityArea?.name        ?? staticArea.name;
  const description = sanityArea?.description ?? staticArea.desc;
  const population  = sanityArea?.population  ?? staticArea.pop;
  const faqs        = sanityArea?.faqs        ?? [];

  // Local business JSON-LD for this city
  const localSchema = {
    "@context": "https://schema.org",
    "@type":    "LocalBusiness",
    name:       `${BUSINESS.name} — ${name}`,
    description: `Professional waste collection and recycling services in ${name}, Ontario.`,
    url:        `${SITE_URL}/service-areas/${params.slug}`,
    areaServed: { "@type": "City", name, addressRegion: "ON", addressCountry: "CA" },
    telephone:  BUSINESS.phoneRaw,
    address: {
      "@type":           "PostalAddress",
      streetAddress:     BUSINESS.address.street,
      addressLocality:   BUSINESS.address.city,
      addressRegion:     "ON",
      postalCode:        BUSINESS.address.postal,
      addressCountry:    "CA",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      <PageHero
        eyebrow="Service Area"
        title={`Waste Collection & Recycling in ${name}, Ontario`}
        description={description}
        size="large"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Users className="h-4 w-4" />
            Population: {population}
          </div>
          <Link
            href="#quote"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-green-700 transition-colors hover:bg-green-50"
          >
            Get Free Quote in {name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageHero>

      <MotionSection className="bg-background">
          <div className="grid gap-16 lg:grid-cols-3">

            {/* Left — content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Services we offer in this city */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Services Available in {name}
                </h2>
                <Stagger className="grid gap-4 sm:grid-cols-2">
                  {SERVICES.map((service) => {
                    const Icon = getServiceIcon(service.slug);
                    return (
                      <StaggerItem key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:border-green-200 hover:shadow-card-hover"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors dark:bg-green-950/40">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-green-600 transition-colors text-sm">
                            {service.title}
                          </p>
                          <p className="text-xs text-green-600 font-medium mt-0.5">{service.price}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 self-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>

              {/* Why us in this city */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/10">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Why {name} Residents Choose {BUSINESS.shortName}
                </h2>
                <ul className="space-y-2">
                  {[
                    `Local crews who know ${name} streets and schedules`,
                    "On-time pickups with SMS reminders",
                    "Transparent pricing — no surprise fees",
                    "Eco-conscious disposal — we maximize recycling",
                    "Flexible residential, commercial, and one-time services",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sanity local SEO content */}
              {sanityArea?.localSeoContent && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Waste Management in {name}
                  </h2>
                  <PortableText value={sanityArea.localSeoContent} />
                </div>
              )}

              {/* Map embed */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Our Coverage in {name}
                </h2>
                <div className="overflow-hidden rounded-2xl border border-border shadow-md">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d${staticArea.coords.lng}!3d${staticArea.coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sca!4v1234567890`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Waste collection service area map — ${name}, Ontario`}
                  />
                </div>
              </div>

              {/* FAQs */}
              {faqs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    FAQs — Waste Services in {name}
                  </h2>
                  <div className="space-y-3">
                    {faqs.map((faq: any) => (
                      <details
                        key={faq._id}
                        className="group rounded-xl border border-border bg-card shadow-card overflow-hidden"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground hover:text-green-600 transition-colors list-none">
                          {faq.question}
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 text-muted-foreground" />
                        </summary>
                        <div className="px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground border-t border-border">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — sticky form */}
            <div>
              <div
                id="quote"
                className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card scroll-mt-header"
              >
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Free Quote — {name}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  We'll respond within 2 business hours.
                </p>
                <QuoteForm defaultService={undefined} compact />
              </div>
            </div>
          </div>
      </MotionSection>

      <MotionSection className="bg-section-alt">
          <h2 className="text-xl font-bold text-foreground mb-6">Other Areas We Serve</h2>
          <Stagger className="flex flex-wrap gap-3">
            {SERVICE_AREAS.filter((a) => a.slug !== params.slug).map((area) => (
              <StaggerItem key={area.slug}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-green-300 hover:text-green-600"
                >
                  <MapPin className="h-3.5 w-3.5 text-green-500" />
                  {area.name}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
      </MotionSection>
    </>
  );
}
