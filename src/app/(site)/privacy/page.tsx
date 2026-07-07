import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { PRIVACY_SECTIONS } from "@/lib/legal/privacy-sections";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Citywide Waste Solutions and Citywide Moving Solutions collect, use, store, and protect personal information submitted through our websites and service forms.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description={`This policy explains how ${LEGAL_WEBSITES.waste.name} and ${LEGAL_WEBSITES.moving.name} collect, use, share, and protect information submitted through our websites, quote forms, contact forms, and payment tools.`}
      sections={PRIVACY_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ]}
    />
  );
}
