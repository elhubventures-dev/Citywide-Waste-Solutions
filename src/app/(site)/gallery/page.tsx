import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { GALLERY_IMAGES } from "@/lib/gallery-images";
import { FlyerGallery } from "@/components/gallery/flyer-gallery";
import { PageHero } from "@/components/motion/page-hero";
import { MotionSection } from "@/components/motion/motion-section";

export const metadata: Metadata = {
  title: "Gallery | Brand & Service Creatives",
  description: `Browse ${BUSINESS.name} flyers, service creatives, fleet branding, and marketing designs — optimized for fast loading across Ontario.`,
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Creative Gallery"
        title="Our Work, Brand & Service Designs"
        description={`Explore ${GALLERY_IMAGES.length} flyers and creatives from ${BUSINESS.name} — residential, commercial, recycling, fleet branding, and campaign assets.`}
        centered
      />

      <MotionSection className="bg-background">
        <FlyerGallery />

        <div className="mt-16 rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/20">
          <h2 className="text-xl font-bold text-foreground">Ready to put these services to work?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Request a custom quote for any service shown in our gallery. We respond within 2 business
            hours.
          </p>
          <Link
            href="/contact#quote"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Get a Free Quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </MotionSection>
    </>
  );
}
