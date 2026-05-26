import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms that apply when using Citywide Waste Solutions' website, quote forms, payment features, and waste collection services.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

const lastUpdated = "May 26, 2026";

const sections = [
  {
    id: "use-of-website",
    title: "1. Use of This Website",
    body: [
      "You may use this website to learn about our services, request quotes, contact our team, and pay eligible invoices. You agree to provide accurate information and to use the website only for lawful purposes.",
      "You may not attempt to disrupt the website, access non-public systems, submit malicious content, or use automated tools in a way that interferes with normal operation.",
    ],
  },
  {
    id: "quotes-and-service",
    title: "2. Quotes and Service Requests",
    body: [
      "Quotes submitted through the website are requests for pricing, not binding service agreements. Final pricing may depend on location, waste type, volume, access conditions, container requirements, disposal fees, contamination, and other operational factors.",
      "A service is confirmed only after Citywide Waste Solutions accepts the request and confirms scheduling, pricing, and service details with you.",
    ],
  },
  {
    id: "customer-responsibilities",
    title: "3. Customer Responsibilities",
    body: [
      "You are responsible for ensuring safe and reasonable access to pickup locations, keeping waste properly contained, and providing accurate information about the type and quantity of material to be collected.",
      "You must not include hazardous, regulated, flammable, biomedical, chemical, explosive, or otherwise prohibited materials unless Citywide Waste Solutions has agreed in writing that such materials can be handled.",
    ],
  },
  {
    id: "payments",
    title: "4. Payments and Invoices",
    body: [
      "If you use our online payment tools, you agree to pay the amount shown for the applicable invoice or service. Card and wallet payments are processed by third-party payment providers such as Stripe, and Citywide Waste Solutions does not store full card numbers.",
      "Late, failed, reversed, or disputed payments may result in service delays, collection activity, or additional charges where permitted by law and by the applicable invoice terms.",
    ],
  },
  {
    id: "scheduling",
    title: "5. Scheduling, Cancellations, and Access",
    body: [
      "Pickup windows are estimates and may be affected by weather, traffic, landfill or transfer station availability, safety concerns, equipment issues, or events outside our reasonable control.",
      "If we cannot safely access the service location or if the material differs from what was described, we may reschedule, revise the quote, decline collection, or apply additional fees.",
    ],
  },
  {
    id: "communications",
    title: "6. Communications",
    body: [
      "By submitting a quote, contact, payment, or scheduling form, you authorize us to contact you using the details you provide, including by phone, email, SMS, or similar channels where appropriate for responding to your request or managing service.",
      "Marketing messages, if any, will be handled in accordance with applicable Canadian anti-spam requirements. You can unsubscribe from promotional messages where required.",
    ],
  },
  {
    id: "third-party-services",
    title: "7. Third-Party Services",
    body: [
      "The website may rely on third-party services for hosting, analytics, payments, maps, email, SMS, customer relationship management, authentication, spam prevention, and content management.",
      "Those services are governed by their own terms and policies. Citywide Waste Solutions is not responsible for third-party websites, services, or content that we do not control.",
    ],
  },
  {
    id: "disclaimer",
    title: "8. Disclaimers",
    body: [
      "The website and its content are provided for general information. We work to keep information accurate and current, but we do not guarantee that all content, pricing, availability, or service details are complete, error-free, or always up to date.",
      "To the maximum extent permitted by law, the website is provided without warranties of any kind, whether express, implied, statutory, or otherwise.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "9. Limitation of Liability",
    body: [
      "To the maximum extent permitted by applicable law, Citywide Waste Solutions will not be liable for indirect, incidental, consequential, special, punitive, or exemplary damages arising from your use of the website or services.",
      "Nothing in these terms limits liability that cannot legally be limited under applicable law.",
    ],
  },
  {
    id: "governing-law",
    title: "10. Governing Law",
    body: [
      "These terms are governed by the laws of Ontario and the federal laws of Canada applicable in Ontario, without regard to conflict of law rules.",
      "Any dispute will be handled in the courts or tribunals with jurisdiction in Ontario, unless applicable law requires otherwise.",
    ],
  },
  {
    id: "changes",
    title: "11. Changes to These Terms",
    body: [
      "We may update these terms from time to time. The updated version will be posted on this page with a revised last updated date.",
      "Your continued use of the website or services after changes are posted means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background">
      <section className="bg-section-alt border-b border-border">
        <div className="container py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Legal
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            These terms explain how you may use the {BUSINESS.name} website, request services,
            submit forms, and pay invoices online.
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
              These terms are provided for general website and service operations. They are not
              legal advice and should be reviewed by qualified legal counsel before launch.
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
              <h2 className="text-2xl font-bold text-foreground">12. Contact Us</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  If you have questions about these terms, contact {BUSINESS.name} using the details
                  below.
                </p>
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
                  <Link className="font-medium text-green-600 hover:text-green-700" href="/privacy">
                    Privacy Policy
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
