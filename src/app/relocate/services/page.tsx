import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { PageHero } from "@/components/motion/page-hero";
import { MovingServicesSection } from "@/components/relocate/moving-services-section";
import { MovingCtaSection } from "@/components/relocate/moving-cta-section";
import { MOVING_IMAGES } from "@/lib/moving/images";

export const metadata = buildMovingMetadata({
  title: `Moving Services | ${MOVING_BUSINESS.name}`,
  description:
    "Residential moves, commercial relocations, long-distance moving, packing, loading, and furniture assembly across Ontario. Professional crews, fully insured.",
  path: "/services",
});

export default function RelocateServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Professional Moving Services"
        description="From studio apartments to full office relocations — we provide end-to-end moving solutions tailored to your timeline and budget."
        backgroundImage={MOVING_IMAGES.fleet}
        size="large"
        centered
      />
      <MovingServicesSection showAll />
      <MovingCtaSection />
    </>
  );
}
