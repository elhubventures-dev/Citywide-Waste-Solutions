import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { COOKIE_SECTIONS } from "@/lib/legal/cookie-sections";
import { LEGAL_WEBSITES } from "@/lib/legal/sites";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how Citywide Waste Solutions and Citywide Moving Solutions use cookies and similar technologies on our websites.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiesPage() {
  return (
    <LegalDocumentPage
      title="Cookie Policy"
      description={`This policy explains how cookies and similar technologies are used on ${LEGAL_WEBSITES.waste.name} and ${LEGAL_WEBSITES.moving.name}.`}
      sections={COOKIE_SECTIONS}
      contactTitle="Contact Us"
      relatedLinks={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ]}
    />
  );
}
