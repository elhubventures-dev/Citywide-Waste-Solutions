import { LEGAL_WEBSITES, LEGAL_WEBSITES_SCOPE } from "./sites";

import type { LegalSection } from "./privacy-sections";

export const COOKIE_SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "1. Scope of This Policy",
    body: [
      ...LEGAL_WEBSITES_SCOPE,
      `This Cookie Policy explains how cookies and similar technologies are used on ${LEGAL_WEBSITES.waste.name} and ${LEGAL_WEBSITES.moving.name}.`,
    ],
  },
  {
    id: "what-are-cookies",
    title: "2. What Are Cookies?",
    body: [
      "Cookies are small text files stored on your device when you visit a website. Similar technologies include pixels, local storage, session storage, and software development kits used by analytics or hosting providers.",
      "Cookies may be set by us or by third-party services that help us operate, secure, and measure our websites.",
    ],
  },
  {
    id: "how-we-use-cookies",
    title: "3. How We Use Cookies",
    body: [
      "We use cookies and similar technologies to keep the websites functioning, remember preferences, maintain secure sessions, prevent abuse, understand how visitors use our pages, and measure marketing performance.",
      `Cookies may be used on both ${LEGAL_WEBSITES.waste.url} and ${LEGAL_WEBSITES.moving.url} because both websites are operated by the same business and may rely on shared infrastructure.`,
    ],
  },
  {
    id: "types-of-cookies",
    title: "4. Types of Cookies We May Use",
    body: [
      "Essential cookies: Required for core website features such as form submission, security, load balancing, and session management.",
      "Performance and analytics cookies: Help us understand traffic, page views, referral sources, and how visitors interact with quote forms or service pages.",
      "Functional cookies: Remember choices such as form progress, language preferences, or other settings that improve your experience.",
      "Marketing cookies: May be used to measure advertising effectiveness or understand how visitors arrive at our websites.",
    ],
  },
  {
    id: "third-party-cookies",
    title: "5. Third-Party Cookies",
    body: [
      "Third-party providers such as analytics, hosting, payment, maps, spam prevention, or customer relationship tools may set cookies when you use our websites.",
      "Those providers process information according to their own privacy policies and cookie practices. We do not control all cookies set by third parties.",
    ],
  },
  {
    id: "managing-cookies",
    title: "6. Managing Cookies",
    body: [
      "You can control or delete cookies through your browser settings. Most browsers allow you to block cookies, delete existing cookies, or receive alerts before cookies are stored.",
      "If you block essential cookies, some website features — including quote forms, secure login areas, or payment tools — may not work properly.",
    ],
  },
  {
    id: "changes",
    title: "7. Changes to This Policy",
    body: [
      "We may update this Cookie Policy from time to time. The updated version will be posted on this page with a revised last updated date.",
      "Your continued use of either website after changes are posted means the updated policy applies.",
    ],
  },
];
