import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { HeroSection } from "@/components/sections/hero-section";
import { WhoWeAreSection } from "@/components/sections/who-we-are-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SpecializedSolutionsSection } from "@/components/sections/specialized-solutions-section";
import { TrustSection } from "@/components/sections/trust-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ServiceAreasSection } from "@/components/sections/service-areas-section";
import { CtaBannerSection } from "@/components/sections/cta-banner-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview-section";

export const metadata: Metadata = {
  title: "Reliable Waste Collection & Recycling Services in Ontario",
  description:
    "Citywide Waste Solutions provides professional residential and commercial waste collection, recycling, junk removal, and dumpster rental across Durham, Scarborough, Vaughan, Toronto & Clarington. Get your free quote today.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhoWeAreSection />
      <ServicesSection />
      <SpecializedSolutionsSection />
      <TrustSection />
      <TestimonialsSection />
      <ServiceAreasSection />
      <CtaBannerSection />
      <BlogPreviewSection />
    </>
  );
}
