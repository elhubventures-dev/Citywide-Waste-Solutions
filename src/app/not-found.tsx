import Link from "next/link";
import { ArrowLeft, Home, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="container max-w-lg text-center space-y-6 py-20">
        {/* Large 404 */}
        <div className="relative">
          <span className="text-[8rem] font-black text-green-100 dark:text-green-950/60 select-none leading-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-5xl">
            🗑️
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            This page went to the landfill
          </h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            View Services
          </Link>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
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
    </div>
  );
}
