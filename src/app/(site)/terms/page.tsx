import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { TERMS_SECTIONS } from "@/lib/legal/terms-sections";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms that apply when using Citywide Waste Solutions and Citywide Moving Solutions websites, quote forms, payment features, and related services.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      description={`These terms explain how you may use ${LEGAL_WEBSITES.waste.name}, ${LEGAL_WEBSITES.moving.name}, request services, submit forms, and pay invoices online.`}
      sections={TERMS_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
      ]}
    />
  );
}
