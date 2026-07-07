import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { PRIVACY_SECTIONS } from "@/lib/legal/privacy-sections";
import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";

export const metadata = buildMovingMetadata({
  title: `Privacy Policy | ${MOVING_BUSINESS.name}`,
  description:
    "Learn how Citywide Moving Solutions and Citywide Waste Solutions collect, use, store, and protect personal information submitted through our websites and service forms.",
  path: "/privacy",
});

export default function RelocatePrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description={`This policy explains how ${LEGAL_WEBSITES.moving.name} and ${LEGAL_WEBSITES.waste.name} collect, use, share, and protect information submitted through our websites, quote forms, contact forms, and payment tools.`}
      sections={PRIVACY_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ]}
    />
  );
}
