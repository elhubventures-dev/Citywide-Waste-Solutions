import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Citywide Waste Solutions collects, uses, stores, and protects personal information submitted through its website and service forms.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const lastUpdated = "May 26, 2026";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly, including your name, email address, phone number, address or service location, service preferences, quote details, messages, invoice details, and communication preferences.",
      "When you use the website, we may also collect technical information such as IP address, browser type, device information, pages visited, referring pages, form submission timestamps, and analytics events.",
      "If you pay an invoice online, payment information is processed by our payment provider. We do not store full card numbers on our servers.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Information",
    body: [
      "We use personal information to respond to quote requests, provide waste collection and recycling services, schedule pickups, process payments, send confirmations, manage customer records, prevent fraud or abuse, and improve the website.",
      "We may use contact details to send service-related emails, SMS messages, or phone calls. Promotional communications, if used, will include unsubscribe options where required by Canadian law.",
    ],
  },
  {
    id: "sharing",
    title: "3. How We Share Information",
    body: [
      "We share information only as needed to operate the business, deliver services, process payments, communicate with customers, comply with law, protect our rights, or complete a business transaction such as a merger or asset transfer.",
      "Service providers may include hosting, database, payment, analytics, email, SMS, customer relationship management, authentication, spam prevention, and content management vendors.",
    ],
  },
  {
    id: "service-providers",
    title: "4. Service Providers and Integrations",
    body: [
      "The website may use services such as Vercel, Supabase or PostgreSQL hosting, Supabase Auth, Prisma, Stripe, Resend, Twilio, GoHighLevel, Google Analytics, Google Maps, Google reCAPTCHA, Sanity, Upstash Redis, and related infrastructure providers.",
      "These providers may process information in Canada, the United States, or other jurisdictions. Their handling of information is governed by their own agreements and privacy practices.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies and Tracking",
    body: [
      "We may use cookies, pixels, local storage, and similar technologies to keep the website working, improve performance, understand visitor activity, remember preferences, prevent abuse, and measure marketing performance.",
      "You can adjust cookie settings through your browser. Some website features may not work properly if cookies or similar technologies are blocked.",
    ],
  },
  {
    id: "retention",
    title: "6. Retention",
    body: [
      "We keep personal information only as long as reasonably needed for the purposes described in this policy, including service delivery, customer support, accounting, legal compliance, dispute resolution, and business recordkeeping.",
      "Retention periods may vary depending on the type of record, legal requirements, and operational needs.",
    ],
  },
  {
    id: "security",
    title: "7. Security",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information from unauthorized access, misuse, loss, disclosure, alteration, or destruction.",
      "No website, network, or storage system can be guaranteed completely secure. You should avoid sending highly sensitive information through general website forms unless we specifically request it.",
    ],
  },
  {
    id: "your-choices",
    title: "8. Your Choices and Rights",
    body: [
      "You may contact us to request access to, correction of, or deletion of personal information we hold about you, subject to legal, contractual, and operational limits.",
      "You can opt out of promotional communications where applicable. Service-related communications may still be sent when needed to complete a request, provide service, process a payment, or meet legal obligations.",
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    body: [
      "Our website and services are intended for adults and businesses seeking waste collection, recycling, junk removal, dumpster rental, or related services. We do not knowingly collect personal information from children under 13.",
      "If you believe a child has provided personal information to us, contact us and we will take appropriate steps to review and remove it where required.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised last updated date.",
      "Your continued use of the website after changes are posted means the updated policy applies to information collected going forward.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background">
      <section className="bg-section-alt border-b border-border">
        <div className="container py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Legal
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            This policy explains how {BUSINESS.name} collects, uses, shares, and protects
            information submitted through our website, quote forms, contact forms, and payment
            tools.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="mb-3 text-sm font-semibold text-foreground">On this page</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a className="transition-colors hover:text-green-600" href={`#${section.id}`}>
                      {section.title.replace(/^\d+\.\s/, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              This policy is drafted for practical website launch readiness. It is not legal advice
              and should be reviewed by qualified legal counsel before launch.
            </div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
              <h2 className="text-2xl font-bold text-foreground">11. Contact Us</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  To ask questions or make a privacy request, contact {BUSINESS.name} using the
                  details below.
                </p>
                <p>Legal business name: {BUSINESS.legalName}</p>
                <p>Business Number: {BUSINESS.businessNumber}</p>
                <p>Business Identification Number: {BUSINESS.bin}</p>
                <p>
                  Email:{" "}
                  <a
                    className="font-medium text-green-600 hover:text-green-700"
                    href={`mailto:${BUSINESS.email}`}
                  >
                    {BUSINESS.email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a
                    className="font-medium text-green-600 hover:text-green-700"
                    href={`tel:${BUSINESS.phoneRaw}`}
                  >
                    {BUSINESS.phone}
                  </a>
                </p>
                <p>Address: {BUSINESS.address.full}</p>
                <p>
                  You can also review our{" "}
                  <Link className="font-medium text-green-600 hover:text-green-700" href="/terms">
                    Terms of Service
                  </Link>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
