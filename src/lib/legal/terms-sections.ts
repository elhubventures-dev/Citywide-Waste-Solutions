import { LEGAL_WEBSITES, LEGAL_WEBSITES_SCOPE } from "./sites";

import type { LegalSection } from "./privacy-sections";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "1. Scope of These Terms",
    body: [
      ...LEGAL_WEBSITES_SCOPE,
      `These Terms of Service apply to your use of ${LEGAL_WEBSITES.waste.name}, ${LEGAL_WEBSITES.moving.name}, and any related forms, payment tools, or service requests submitted through those websites.`,
    ],
  },
  {
    id: "use-of-website",
    title: "2. Use of Our Websites",
    body: [
      "You may use our websites to learn about our services, request quotes, contact our team, and pay eligible invoices. You agree to provide accurate information and to use the websites only for lawful purposes.",
      "You may not attempt to disrupt either website, access non-public systems, submit malicious content, or use automated tools in a way that interferes with normal operation.",
    ],
  },
  {
    id: "quotes-and-service",
    title: "3. Quotes and Service Requests",
    body: [
      "Quotes submitted through either website are requests for pricing, not binding service agreements. Final pricing may depend on location, service type, volume, access conditions, scheduling, equipment needs, disposal or transit fees, and other operational factors.",
      `Waste service quotes may depend on waste type, container requirements, contamination, landfill or transfer station rules, and site access.`,
      `Moving quotes may depend on distance, crew size, packing needs, stairs or elevator access, parking, inventory volume, specialty items, and timing.`,
      `A service is confirmed only after ${LEGAL_WEBSITES.waste.name} or ${LEGAL_WEBSITES.moving.name} accepts the request and confirms scheduling, pricing, and service details with you.`,
    ],
  },
  {
    id: "customer-responsibilities",
    title: "4. Customer Responsibilities",
    body: [
      "You are responsible for ensuring safe and reasonable access to service locations and for providing accurate information about the type, quantity, and condition of materials or belongings to be handled.",
      "For waste services, you must not include hazardous, regulated, flammable, biomedical, chemical, explosive, or otherwise prohibited materials unless we have agreed in writing that such materials can be handled.",
      "For moving services, you are responsible for securing valuables, notifying us of fragile, heavy, or specialty items, and ensuring that origin and destination locations are reasonably accessible for our crew and equipment.",
    ],
  },
  {
    id: "payments",
    title: "5. Payments and Invoices",
    body: [
      "If you use our online payment tools, you agree to pay the amount shown for the applicable invoice or service. Card and wallet payments are processed by third-party payment providers such as Stripe, and we do not store full card numbers.",
      "Late, failed, reversed, or disputed payments may result in service delays, collection activity, or additional charges where permitted by law and by the applicable invoice terms.",
    ],
  },
  {
    id: "scheduling",
    title: "6. Scheduling, Cancellations, and Access",
    body: [
      "Service windows are estimates and may be affected by weather, traffic, landfill or transfer station availability, building access restrictions, safety concerns, equipment issues, or events outside our reasonable control.",
      "If we cannot safely access the service location or if the job differs materially from what was described, we may reschedule, revise the quote, decline service, or apply additional fees.",
    ],
  },
  {
    id: "communications",
    title: "7. Communications",
    body: [
      "By submitting a quote, contact, payment, or scheduling form on either website, you authorize us to contact you using the details you provide, including by phone, email, SMS, or similar channels where appropriate for responding to your request or managing service.",
      "Marketing messages, if any, will be handled in accordance with applicable Canadian anti-spam requirements. You can unsubscribe from promotional messages where required.",
    ],
  },
  {
    id: "third-party-services",
    title: "8. Third-Party Services",
    body: [
      "The websites may rely on third-party services for hosting, analytics, payments, maps, email, SMS, customer relationship management, authentication, spam prevention, and content management.",
      "Those services are governed by their own terms and policies. We are not responsible for third-party websites, services, or content that we do not control.",
      `Links between ${LEGAL_WEBSITES.waste.name} and ${LEGAL_WEBSITES.moving.url} are provided for convenience. Each website may present different service information, forms, and policies specific to the service being requested.`,
    ],
  },
  {
    id: "disclaimer",
    title: "9. Disclaimers",
    body: [
      "The websites and their content are provided for general information. We work to keep information accurate and current, but we do not guarantee that all content, pricing, availability, routing, crew availability, or service details are complete, error-free, or always up to date.",
      "Moving estimates, pickup windows, and same-day availability are subject to operational capacity and confirmation by our team.",
      "To the maximum extent permitted by law, the websites are provided without warranties of any kind, whether express, implied, statutory, or otherwise.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "10. Limitation of Liability",
    body: [
      "To the maximum extent permitted by applicable law, we will not be liable for indirect, incidental, consequential, special, punitive, or exemplary damages arising from your use of the websites or services.",
      "Nothing in these terms limits liability that cannot legally be limited under applicable law.",
    ],
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    body: [
      "These terms are governed by the laws of Ontario and the federal laws of Canada applicable in Ontario, without regard to conflict of law rules.",
      "Any dispute will be handled in the courts or tribunals with jurisdiction in Ontario, unless applicable law requires otherwise.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to These Terms",
    body: [
      "We may update these terms from time to time. The updated version will be posted on this page with a revised last updated date.",
      "Your continued use of either website or our services after changes are posted means you accept the updated terms.",
    ],
  },
];
