import { RelocateHeader } from "@/components/relocate/relocate-header";
import { RelocateFooter } from "@/components/relocate/relocate-footer";
import { MovingPhoneBanner } from "@/components/relocate/moving-hero-section";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { BackToTop } from "@/components/layout/back-to-top";
import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";

export const metadata = buildMovingMetadata({
  title: `${MOVING_BUSINESS.name} | Professional Moving Services in Ontario`,
  description:
    "Citywide Moving Solutions offers residential, commercial, and long-distance moving across the GTA and Durham Region. Packing, loading, and furniture assembly. Get a free quote today.",
  path: "/",
});

export default function RelocateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RelocateHeader />
      <div>{children}</div>
      <MovingPhoneBanner />
      <RelocateFooter />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
