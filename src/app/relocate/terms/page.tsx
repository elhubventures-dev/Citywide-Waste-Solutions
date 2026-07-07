import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { TERMS_SECTIONS } from "@/lib/legal/terms-sections";
import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";

export const metadata = buildMovingMetadata({
  title: `Terms of Service | ${MOVING_BUSINESS.name}`,
  description:
    "Review the terms that apply when using Citywide Moving Solutions and Citywide Waste Solutions websites, quote forms, and related services.",
  path: "/terms",
});

export default function RelocateTermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      description={`These terms explain how you may use ${LEGAL_WEBSITES.moving.name}, ${LEGAL_WEBSITES.waste.name}, request services, submit forms, and pay invoices online.`}
      sections={TERMS_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
      ]}
    />
  );
}
