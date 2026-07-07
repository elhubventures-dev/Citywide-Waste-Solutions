import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { PageHero } from "@/components/motion/page-hero";
import { MovingFaqList } from "@/components/relocate/moving-faq-list";
import { MovingCtaSection } from "@/components/relocate/moving-cta-section";
import { MovingBookingCard } from "@/components/relocate/moving-quote-form";
import { MotionSection } from "@/components/motion/motion-section";

export const metadata = buildMovingMetadata({
  title: `Moving FAQ | ${MOVING_BUSINESS.name}`,
  description:
    "Answers to common questions about booking, pricing, insurance, packing, and preparing for your move with Citywide Moving Solutions.",
  path: "/faq",
});

export default function RelocateFaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Moving Questions Answered"
        description="Find answers about scheduling, pricing, insurance, and how to prepare for moving day."
        centered
      />
      <MotionSection className="bg-background" animate={false}>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MovingFaqList showHeader={false} wrapSection={false} />
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MovingBookingCard />
          </div>
        </div>
      </MotionSection>
      <MovingCtaSection />
    </>
  );
}
