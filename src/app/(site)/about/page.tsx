import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, Shield, Clock, Heart, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import {
  STATS,
  TRUST_POINTS,
  BUSINESS,
  WHO_WE_ARE,
  CLIENT_TYPES,
  SERVICE_PILLARS,
  SITE_URL,
} from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { StatsGrid, CountUp } from "@/components/motion/count-up";
import { ParallaxImageWrap } from "@/components/motion/parallax";

export const metadata: Metadata = {
  title: "About Us | Ontario's Trusted Waste Partner",
  description: `Learn about ${BUSINESS.name} — our mission, environmental commitment, and values that drive our waste collection and recycling services across Ontario.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

const VALUES = [
  {
    icon: Leaf,
    title: "Environmental Responsibility",
    desc: "Every decision we make prioritizes reducing landfill impact. We invest in better sorting, recycling partnerships, and cleaner disposal methods.",
  },
  {
    icon: Shield,
    title: "Professionalism & Accountability",
    desc: "Our crews are trained, uniformed, and insured. We show up on time, communicate proactively, and stand behind our work.",
  },
  {
    icon: Clock,
    title: "Reliability Above All",
    desc: "A missed pickup isn't a minor inconvenience — it's a broken promise. We've built our entire operation around never letting that happen.",
  },
  {
    icon: Heart,
    title: "Community First",
    desc: "We're a local Ontario business serving Ontario communities. The cleanliness and health of these neighbourhoods matters to us personally.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Built on Reliability. Driven by Responsibility."
        description={`${BUSINESS.name} has been serving Ontario communities since 2014. We started with one truck and a simple promise: show up when we say we will, handle waste responsibly, and treat every customer with respect.`}
        size="large"
      />

      <MotionSection className="bg-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <SectionHeader
                eyebrow="Our Mission"
                title="Making Waste Management Simple, Honest, and Eco-Conscious"
                subtitle="We believe waste management shouldn't be complicated, expensive, or environmentally reckless. Our mission is to make responsible disposal accessible to every home and business in Ontario."
              />
              <div className="space-y-3">
                {[
                  "Divert 50%+ of collected waste from Ontario landfills",
                  "Serve every customer with on-time reliability and transparency",
                  "Invest in greener collection vehicles and disposal methods",
                  "Partner with local recycling facilities and composting programs",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {point}
                  </div>
                ))}
              </div>
              <Link
                href="/contact#quote"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                Work With Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <ParallaxImageWrap className="relative aspect-[4/3] rounded-2xl border border-border shadow-card">
                <div className="relative h-full min-h-[280px] w-full">
                  <Image
                    src={SITE_IMAGES.fleet.wrap}
                    alt="Citywide Waste Solutions branded fleet"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </ParallaxImageWrap>
              <StatsGrid stats={STATS} valueClassName="text-4xl mb-1" />
              <div className="rounded-2xl bg-hero-gradient p-6 text-center text-white">
                <div className="mb-2 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-2xl font-bold">4.9 / 5</p>
                <p className="text-sm text-white/70">Average customer rating</p>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-section-alt" delay={0.05}>
        <div className="container">
          <SectionHeader
            eyebrow={WHO_WE_ARE.eyebrow}
            title={WHO_WE_ARE.sustainability}
            subtitle="We serve clients across residential, commercial, industrial, and community sectors throughout Ontario."
            centered
            className="mb-10"
          />
          <Stagger className="mx-auto mb-10 grid max-w-4xl gap-6 lg:grid-cols-2">
            {SERVICE_PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Link
                  href={pillar.href}
                  className="block rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover"
                >
                  <span className="mb-3 block text-3xl" aria-hidden="true">
                    {pillar.icon}
                  </span>
                  <h3 className="mb-2 font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CLIENT_TYPES.map((client) => (
              <StaggerItem key={client}>
                <li className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  {client}
                </li>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </MotionSection>

      <MotionSection className="bg-background">
        <div className="container">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Stand For"
            subtitle="Four principles guide every decision we make — from how we hire to how we dispose."
            centered
            className="mb-12"
          />
          <Stagger className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-bold text-foreground">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </MotionSection>

      <MotionSection className="bg-background">
        <div className="container">
          <SectionHeader
            eyebrow="Why Customers Trust Us"
            title={`5 Reasons Ontario Chooses ${BUSINESS.shortName}`}
            centered
            className="mb-12"
          />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST_POINTS.map((point) => (
              <StaggerItem key={point.title}>
                <div className="h-full rounded-xl border border-border bg-card p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="mb-3 text-3xl">{point.icon}</div>
                  <h3 className="mb-1 text-sm font-bold text-foreground">{point.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{point.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </MotionSection>

      <MotionSection className="bg-background">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ParallaxImageWrap className="relative aspect-[16/10] rounded-2xl border border-border shadow-card">
            <div className="relative h-full min-h-[220px] w-full">
              <Image
                src={SITE_IMAGES.about.beforeAfter}
                alt="Before and after community cleanup by Citywide Waste Solutions"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ParallaxImageWrap>
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-600">
              <Leaf className="h-3.5 w-3.5" /> Environmental Commitment
            </span>
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              We're Not Just Removing Waste. We're Protecting Ontario.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Over 50% of the waste we collect never reaches a landfill. Through partnerships with
              Ontario recycling facilities, composting programs, and material recovery centres, we
              give discarded items a second life wherever possible.
            </p>
            <Stagger className="grid grid-cols-3 gap-4">
              {[
                { value: "50%+", label: "Waste diverted from landfill" },
                { value: "12T", label: "Materials recycled monthly" },
                { value: "3", label: "Recycling facility partners" },
              ].map(({ value, label }) => (
                <StaggerItem key={label}>
                  <div className="rounded-xl border border-border bg-card p-4 text-center shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                    <CountUp value={value} className="text-2xl font-bold text-green-600" />
                    <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-section-alt" containerClassName="max-w-3xl">
        <SectionHeader
          eyebrow="Business Information"
          title="Registered Ontario Business"
          subtitle="Official registration and contact details for Citywide Waste Solutions."
          centered
          className="mb-8"
        />
        <dl className="grid gap-4 rounded-2xl border border-border bg-card p-6 text-sm shadow-card sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Legal Business Name
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Owner / Registrant
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.owner}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Business Number
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.businessNumber}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Business Identification Number (BIN)
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.bin}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              NAICS Code
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.naics.full}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Registered Address
            </dt>
            <dd className="mt-1 font-medium text-foreground">{BUSINESS.address.full}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${BUSINESS.email}`}
                className="font-medium text-green-600 hover:underline"
              >
                {BUSINESS.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Phone
            </dt>
            <dd className="mt-1">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="font-medium text-green-600 hover:underline"
              >
                {BUSINESS.phone}
              </a>
            </dd>
          </div>
        </dl>
      </MotionSection>

      <MotionSection
        className="bg-background"
        containerClassName="max-w-xl mx-auto text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-foreground">Ready to work together?</h2>
        <p className="text-muted-foreground">
          Get a free, no-commitment quote for your home or business in under 2 minutes.
        </p>
        <Link
          href="/contact#quote"
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-7 py-3.5 text-sm font-bold text-white shadow-green transition-colors hover:bg-green-600"
        >
          Get Free Quote <ArrowRight className="h-4 w-4" />
        </Link>
      </MotionSection>
    </>
  );
}
