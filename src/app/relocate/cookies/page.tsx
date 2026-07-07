import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { COOKIE_SECTIONS } from "@/lib/legal/cookie-sections";
import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";

export const metadata = buildMovingMetadata({
  title: `Cookie Policy | ${MOVING_BUSINESS.name}`,
  description:
    "Learn how Citywide Moving Solutions and Citywide Waste Solutions use cookies and similar technologies on our websites.",
  path: "/cookies",
});

export default function RelocateCookiesPage() {
  return (
    <LegalDocumentPage
      title="Cookie Policy"
      description={`This policy explains how cookies and similar technologies are used on ${LEGAL_WEBSITES.moving.name} and ${LEGAL_WEBSITES.waste.name}.`}
      sections={COOKIE_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ]}
    />
  );
}
