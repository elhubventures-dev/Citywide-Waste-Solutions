import Link from "next/link";
import type { LegalSection } from "@/lib/legal/privacy-sections";
import { LEGAL_ENTITY, LEGAL_LAST_UPDATED } from "@/lib/legal/sites";

type RelatedLink = {
  label: string;
  href: string;
};

type LegalDocumentPageProps = {
  title: string;
  description: string;
  sections: LegalSection[];
  contactTitle: string;
  relatedLinks?: RelatedLink[];
};

export function LegalDocumentPage({
  title,
  description,
  sections,
  contactTitle,
  relatedLinks = [],
}: LegalDocumentPageProps) {
  const contactNumber = sections.length + 1;

  return (
    <main className="bg-background">
      <section className="bg-section-alt border-b border-border">
        <div className="container py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Legal
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            {description}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
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
                <li>
                  <a className="transition-colors hover:text-green-600" href="#contact">
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
              These legal documents are provided for practical website launch readiness. They are
              not legal advice and should be reviewed by qualified legal counsel before launch.
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

            <section
              id="contact"
              className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
            >
              <h2 className="text-2xl font-bold text-foreground">
                {contactNumber}. {contactTitle}
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  To ask questions about this document, contact us using the details below. The same
                  contact information applies to both our waste and moving websites.
                </p>
                <p>Legal business name: {LEGAL_ENTITY.name}</p>
                <p>Business Number: {LEGAL_ENTITY.businessNumber}</p>
                <p>Business Identification Number: {LEGAL_ENTITY.bin}</p>
                <p>
                  Email:{" "}
                  <a
                    className="font-medium text-green-600 hover:text-green-700"
                    href={`mailto:${LEGAL_ENTITY.email}`}
                  >
                    {LEGAL_ENTITY.email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a
                    className="font-medium text-green-600 hover:text-green-700"
                    href={`tel:${LEGAL_ENTITY.phoneRaw}`}
                  >
                    {LEGAL_ENTITY.phone}
                  </a>
                </p>
                <p>Address: {LEGAL_ENTITY.address}</p>
                {relatedLinks.length > 0 && (
                  <p>
                    You can also review our{" "}
                    {relatedLinks.map((link, index) => (
                      <span key={link.href}>
                        <Link
                          className="font-medium text-green-600 hover:text-green-700"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                        {index < relatedLinks.length - 2
                          ? ", "
                          : index === relatedLinks.length - 2
                            ? ", and "
                            : ""}
                      </span>
                    ))}
                    .
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
