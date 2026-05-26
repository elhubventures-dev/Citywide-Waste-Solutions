import Link from "next/link";
import { ArrowLeft, Home, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { PageHero } from "@/components/motion/page-hero";

export default function NotFound() {
  return (
    <>
      <PageHero
        centered
        eyebrow="404"
        title="This page went to the landfill"
        description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
      />

      <section className="bg-background py-16">
        <div className="container max-w-lg space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              View Services
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-green-500" />
              Call Us
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            If you think this is a mistake, please{" "}
            <Link href="/contact" className="text-green-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
