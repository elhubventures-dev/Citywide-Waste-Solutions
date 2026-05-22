import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { QuoteForm }     from "@/components/forms/quote-form";
import { BUSINESS, SPECIALIZED_SOLUTIONS, SITE_URL } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";
import { RecyclingHero } from "@/components/motion/recycling-hero";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ParallaxImageWrap } from "@/components/motion/parallax";

export const metadata: Metadata = {
  title: "Recycling Information | What Can Be Recycled in Ontario",
  description:
    `A complete guide to recycling in Ontario — what's accepted, sorting tips, pickup schedules, and how ${BUSINESS.name} handles your recyclables responsibly.`,
  alternates: { canonical: `${SITE_URL}/recycling` },
};

const RECYCLABLE = [
  { label: "Paper & Cardboard",       items: ["Newspapers", "Flattened cardboard boxes", "Office paper", "Magazines", "Paper bags"], icon: "📄" },
  { label: "Plastic Bottles & Jugs",  items: ["Water/juice bottles", "Milk jugs", "Shampoo bottles", "Detergent containers", "Yogurt containers (#1–#7)"], icon: "♻️" },
  { label: "Glass Containers",        items: ["Clear, green & brown bottles", "Food jars", "Beverage bottles (empty & rinsed)"], icon: "🫙" },
  { label: "Metal Cans",              items: ["Aluminum cans", "Steel/tin food cans", "Empty aerosol cans", "Foil pans (clean)"], icon: "🥫" },
  { label: "Electronics (E-Waste)",   items: ["Computers & laptops", "Smartphones & tablets", "Printers & monitors", "Small appliances"], icon: "💻" },
  { label: "Organics & Compost",      items: ["Fruit & vegetable scraps", "Coffee grounds & filters", "Yard waste", "Food-soiled paper"], icon: "🌱" },
];

const NOT_RECYCLABLE = [
  "Plastic bags & film plastic",
  "Styrofoam / polystyrene",
  "Pizza boxes (greasy)",
  "Broken glass",
  "Diapers & personal hygiene products",
  "Hazardous chemicals & paint",
  "Medical / sharps waste",
  "Ceramics & dishes",
];

const TIPS = [
  { emoji: "🚿", title: "Rinse before recycling", desc: "Food residue contaminates entire batches. A quick rinse is all it takes." },
  { emoji: "📦", title: "Flatten cardboard boxes", desc: "Flattened boxes take up less space and are easier to sort at facilities." },
  { emoji: "🎁", title: "Remove non-paper materials", desc: "Bubble wrap, tape, and plastic windows on envelopes must be removed first." },
  { emoji: "🏷️", title: "Labels are OK to leave on", desc: "Modern sorting facilities handle labels — no need to peel them off." },
  { emoji: "🪣", title: "Keep lids on bottles", desc: "Screw caps back on after rinsing — they're recyclable and easier to process." },
  { emoji: "📵", title: "No plastic bags in recycling bins", desc: "Bags clog sorting machinery. Return them to grocery stores instead." },
];

const SCHEDULE = [
  { area: "Courtice",    day: "Monday",    freq: "Weekly" },
  { area: "Oshawa",      day: "Tuesday",   freq: "Bi-Weekly" },
  { area: "Brampton",    day: "Wednesday", freq: "Weekly" },
  { area: "Mississauga", day: "Thursday",  freq: "Weekly" },
  { area: "Vaughan",     day: "Thursday",  freq: "Weekly" },
  { area: "Toronto",     day: "Friday",    freq: "Weekly" },
];

export default function RecyclingPage() {
  return (
    <>
      <RecyclingHero />

      <MotionSection className="bg-background" id="materials" animate={false}>
          <SectionHeader
            eyebrow="What We Accept"
            title="Recyclable Materials Guide"
            subtitle="Sort your recycling into these categories for pickup. When in doubt — leave it out and contact us."
            id="materials-heading"
            className="mb-12"
          />

          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECYCLABLE.map(({ label, items, icon }) => (
              <StaggerItem key={label}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <h3 className="font-bold text-foreground">{label}</h3>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              </StaggerItem>
            ))}
          </Stagger>
      </MotionSection>

      <MotionSection className="bg-section-alt" aria-labelledby="not-recyclable-heading">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Do Not Recycle"
                title="Items That Cannot Go in Your Recycling Bin"
                subtitle="These items contaminate recycling batches and must be disposed of separately."
                id="not-recyclable-heading"
                className="mb-8"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {NOT_RECYCLABLE.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 dark:border-red-900/30 dark:bg-red-950/10"
                  >
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/10">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Not sure about an item?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-200 mt-0.5">
                    Contact us or check the{" "}
                    <a
                      href="https://www.ontario.ca/page/reduce-reuse-recycle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      Ontario Ministry of Environment
                    </a>{" "}
                    guide. When in doubt, keep it out.
                  </p>
                </div>
              </div>
            </div>

            {/* Sorting tips */}
            <div>
              <SectionHeader
                eyebrow="Sorting Tips"
                title="6 Tips for Better Recycling"
                subtitle="Small habits that make a big difference at the sorting facility."
                className="mb-8"
              />
              <div className="space-y-3">
                {TIPS.map(({ emoji, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
                  >
                    <span className="text-xl shrink-0">{emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </MotionSection>

      <MotionSection className="bg-background" aria-labelledby="schedule-heading">
          <SectionHeader
            eyebrow="Pickup Schedule"
            title="Recycling Pickup Days by Area"
            subtitle="Schedules vary by neighbourhood. Contact us to confirm your exact pickup day and to sign up for SMS reminders."
            id="schedule-heading"
            className="mb-10"
          />

          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="px-5 py-3.5 text-left font-semibold">Service Area</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Pickup Day</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Frequency</th>
                  <th className="px-5 py-3.5 text-left font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {SCHEDULE.map(({ area, day, freq }, i) => (
                  <tr key={area} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{area}</td>
                    <td className="px-5 py-3.5 text-foreground">{day}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        freq === "Weekly"
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      }`}>
                        {freq}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href="/contact#quote"
                        className="text-xs font-semibold text-green-600 hover:underline"
                      >
                        Schedule Pickup →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            * Schedules subject to change on statutory holidays. SMS reminders sent automatically when you sign up.
          </p>
      </MotionSection>

      {/* ── Recycling programs (reference-style detail) ─────────────── */}
      <MotionSection className="bg-background">
          <SectionHeader
            eyebrow="Recycling Programs"
            title="Wood, Paper, Plastics & Metal Recovery"
            subtitle="Dedicated streams for renovation wood waste and multi-material recycling — keeping resources in use and out of landfill."
            centered
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {SPECIALIZED_SOLUTIONS.filter((s) =>
              s.title.includes("Wood") || s.title.includes("Paper")
            ).map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <Link href={item.href} className="text-sm font-semibold text-green-600 hover:underline">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
      </MotionSection>

      {/* ── Download guide + Quote form ─────────────────────────────── */}
      <MotionSection className="bg-section-alt">
          <div className="grid gap-10 lg:grid-cols-2">

            {/* PDF Download card */}
            <div className="rounded-2xl bg-hero-gradient p-8 text-white flex flex-col gap-5">
              <div className="text-4xl">📥</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Download the Full Recycling Guide</h2>
                <p className="text-white/75 text-sm leading-relaxed">
                  Our printable PDF guide covers every material category, sorting instructions,
                  accepted plastics by number, and what to do with specialty items like electronics,
                  batteries, and paint.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {["Complete materials A–Z", "Ontario-specific regulations", "Sorting illustrations", "Specialty disposal locations"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/docs/recycling-guide.pdf"
                download
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors w-fit"
              >
                <Download className="h-4 w-4" />
                Download PDF (Free)
              </a>
            </div>

            {/* Quote form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-1">
                Start Your Recycling Service
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Get a free quote for residential or commercial recycling pickup.
              </p>
              <QuoteForm defaultService="Recycling Services" compact />
            </div>
          </div>
      </MotionSection>
    </>
  );
}
