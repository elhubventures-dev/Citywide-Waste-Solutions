import { MovingHeroSection } from "@/components/relocate/moving-hero-section";
import { MovingStatsBar } from "@/components/relocate/moving-hero-section";
import { MovingServicesSection } from "@/components/relocate/moving-services-section";
import { MovingWhySection, MovingProcessSection } from "@/components/relocate/moving-why-section";
import { MovingTestimonialsSection, MovingCtaSection } from "@/components/relocate/moving-cta-section";
import { MovingQuoteForm } from "@/components/relocate/moving-quote-form";
import { MotionSection } from "@/components/motion/motion-section";
import { SectionHeader } from "@/components/ui/section-header";

export default function RelocateHomePage() {
  return (
    <>
      <MovingHeroSection />
      <MovingStatsBar />
      <MovingServicesSection />
      <MovingWhySection />
      <MovingProcessSection />
      <MovingTestimonialsSection />

      <MotionSection className="bg-muted/30" id="quote">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Free Quote"
              title="Plan Your Move in Minutes"
              subtitle="Share your move details and our team will send a personalized quote — fast, clear, and with no obligation."
            />
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Response within 2 business hours
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Written estimate before moving day
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Same-day service may be available
              </li>
            </ul>
          </div>
          <MovingQuoteForm />
        </div>
      </MotionSection>

      <MovingCtaSection />
    </>
  );
}
