import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { PageHero } from "@/components/motion/page-hero";
import { MovingPricingSection } from "@/components/relocate/moving-pricing-section";
import { MovingCtaSection } from "@/components/relocate/moving-cta-section";
import { MovingFaqList } from "@/components/relocate/moving-faq-list";

export const metadata = buildMovingMetadata({
  title: `Moving Pricing | ${MOVING_BUSINESS.name}`,
  description:
    "Transparent moving rates for local, full-service, and commercial relocations. Request a free custom quote with no hidden fees.",
  path: "/pricing",
});

export default function RelocatePricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Honest Rates for Every Move"
        description="Choose a package that fits your needs or request a custom quote. We provide clear written estimates before any work begins."
        centered
      />
      <MovingPricingSection />
      <MovingFaqList limit={4} showHeader={false} />
      <MovingCtaSection />
    </>
  );
}
