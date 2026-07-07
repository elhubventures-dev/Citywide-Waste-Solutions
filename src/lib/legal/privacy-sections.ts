import { LEGAL_WEBSITES, LEGAL_WEBSITES_SCOPE } from "./sites";

export type LegalSection = {
  id: string;
  title: string;
  body: string[];
};

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "1. Scope of This Policy",
    body: [
      ...LEGAL_WEBSITES_SCOPE,
      `This Privacy Policy applies to information collected through ${LEGAL_WEBSITES.waste.name}, ${LEGAL_WEBSITES.moving.name}, and any related quote forms, contact forms, payment tools, or communications connected to those websites.`,
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: [
      "We collect information you provide directly, including your name, email address, phone number, address or service location, service preferences, quote details, messages, invoice details, and communication preferences.",
      `On ${LEGAL_WEBSITES.waste.name}, this may include waste type, pickup frequency, bin or dumpster needs, property access details, and disposal requirements.`,
      `On ${LEGAL_WEBSITES.moving.name}, this may include move dates, origin and destination addresses, property size, moving service type, packing needs, inventory details, elevator or stair access, and preferred contact methods including SMS updates.`,
      "When you use either website, we may also collect technical information such as IP address, browser type, device information, pages visited, referring pages, form submission timestamps, and analytics events.",
      "If you pay an invoice online, payment information is processed by our payment provider. We do not store full card numbers on our servers.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Information",
    body: [
      `We use personal information to respond to quote requests, provide ${LEGAL_WEBSITES.waste.description}, provide ${LEGAL_WEBSITES.moving.description}, schedule pickups or moves, process payments, send confirmations, manage customer records, prevent fraud or abuse, and improve our websites.`,
      "We may use contact details to send service-related emails, SMS messages, or phone calls. Promotional communications, if used, will include unsubscribe options where required by Canadian law.",
    ],
  },
  {
    id: "sharing",
    title: "4. How We Share Information",
    body: [
      "We share information only as needed to operate the business, deliver services, process payments, communicate with customers, comply with law, protect our rights, or complete a business transaction such as a merger or asset transfer.",
      "Service providers may include hosting, database, payment, analytics, email, SMS, customer relationship management, authentication, spam prevention, and content management vendors.",
    ],
  },
  {
    id: "service-providers",
    title: "5. Service Providers and Integrations",
    body: [
      "The websites may use services such as Vercel, Supabase or PostgreSQL hosting, Supabase Auth, Prisma, Stripe, Resend, Twilio, GoHighLevel, Google Analytics, Google Maps, Google reCAPTCHA, Sanity, Upstash Redis, and related infrastructure providers.",
      "These providers may process information in Canada, the United States, or other jurisdictions. Their handling of information is governed by their own agreements and privacy practices.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking",
    body: [
      "We may use cookies, pixels, local storage, and similar technologies on both websites to keep pages working, improve performance, understand visitor activity, remember preferences, prevent abuse, and measure marketing performance.",
      "You can adjust cookie settings through your browser. Some website features may not work properly if cookies or similar technologies are blocked. See our Cookie Policy for more detail.",
    ],
  },
  {
    id: "retention",
    title: "7. Retention",
    body: [
      "We keep personal information only as long as reasonably needed for the purposes described in this policy, including service delivery, customer support, accounting, legal compliance, dispute resolution, and business recordkeeping.",
      "Retention periods may vary depending on the type of record, legal requirements, and operational needs.",
    ],
  },
  {
    id: "security",
    title: "8. Security",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information from unauthorized access, misuse, loss, disclosure, alteration, or destruction.",
      "No website, network, or storage system can be guaranteed completely secure. You should avoid sending highly sensitive information through general website forms unless we specifically request it.",
    ],
  },
  {
    id: "your-choices",
    title: "9. Your Choices and Rights",
    body: [
      "You may contact us to request access to, correction of, or deletion of personal information we hold about you, subject to legal, contractual, and operational limits.",
      "You can opt out of promotional communications where applicable. Service-related communications may still be sent when needed to complete a request, provide service, process a payment, or meet legal obligations.",
    ],
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    body: [
      "Our websites and services are intended for adults and businesses seeking waste management, recycling, junk removal, dumpster rental, moving, or related services. We do not knowingly collect personal information from children under 13.",
      "If you believe a child has provided personal information to us, contact us and we will take appropriate steps to review and remove it where required.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised last updated date.",
      "Your continued use of either website after changes are posted means the updated policy applies to information collected going forward.",
    ],
  },
];
