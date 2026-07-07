import { buildMovingMetadata } from "@/lib/moving/metadata";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { MOVING_CONTACT_INFO, MOVING_SERVICE_AREAS_SHORT } from "@/lib/moving/constants";
import { PageHero } from "@/components/motion/page-hero";
import { MovingQuoteForm, MovingBookingCard } from "@/components/relocate/moving-quote-form";
import { MotionSection } from "@/components/motion/motion-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const CONTACT_ICONS = {
  phone: Phone,
  whatsapp: WhatsAppIcon,
  email: Mail,
  hours: Clock,
} as const;

export const metadata = buildMovingMetadata({
  title: `Contact & Book | ${MOVING_BUSINESS.name}`,
  description:
    `Contact ${MOVING_BUSINESS.name} for a free moving quote or to book your move. Serving ${MOVING_SERVICE_AREAS_SHORT}. Call ${MOVING_BUSINESS.phone} or submit the form online.`,
  path: "/contact",
});

export default function RelocateContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get Your Free Moving Quote"
        description={`Request a quote online or speak with our team directly. We respond within 2 business hours and can often accommodate same-day moves. Serving ${MOVING_SERVICE_AREAS_SHORT}.`}
        centered
      />

      <MotionSection className="bg-background" id="quote" animate={false}>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <SectionHeader
              eyebrow="Get in Touch"
              title="We're Ready to Help"
              subtitle="Call, email, or fill out the form — whichever is easiest for you."
            />

            <ul className="space-y-4">
              {MOVING_CONTACT_INFO.map(({ kind, label, value, href }) => {
                const Icon = CONTACT_ICONS[kind];
                return (
                  <li key={label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950/40">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-foreground transition-colors hover:text-green-600"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <MovingBookingCard />
          </div>

          <div className="lg:col-span-3">
            <MovingQuoteForm />
          </div>
        </div>
      </MotionSection>
    </>
  );
}
