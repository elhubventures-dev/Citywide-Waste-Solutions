import Link from "next/link";
import { headers } from "next/headers";
import { Phone, Mail, Facebook, Instagram, Linkedin, ExternalLink } from "lucide-react";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import {
  MOVING_NAV_LINKS,
  MOVING_SERVICE_STRIP,
  MOVING_VALUE_STRIP,
} from "@/lib/moving/constants";
import { relocateHref } from "@/lib/moving/paths";
import { MovingLogo } from "@/components/relocate/moving-logo";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const SOCIAL = [
  { icon: WhatsAppIcon, label: "WhatsApp", href: MOVING_BUSINESS.social.whatsapp },
  { icon: Facebook, label: "Facebook", href: MOVING_BUSINESS.social.facebook },
  { icon: Instagram, label: "Instagram", href: MOVING_BUSINESS.social.instagram },
  { icon: Linkedin, label: "LinkedIn", href: MOVING_BUSINESS.social.linkedin },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/terms#disclaimer" },
  { label: "Cookie Policy", href: "/cookies" },
] as const;

export function RelocateFooter() {
  const host = headers().get("host") ?? "";
  const href = (path: string) => relocateHref(path, host);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white" aria-label="Moving site footer">
      <div className="border-b border-white/10 bg-green-900/40">
        <div className="container flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
          {MOVING_VALUE_STRIP.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-white/30">|</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-2">
            <MovingLogo size="lg" variant="light" />
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              {MOVING_BUSINESS.name} is part of {MOVING_BUSINESS.parentName} — professional,
              reliable, and affordable moving services for homes and businesses across Ontario.
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${MOVING_BUSINESS.phoneRaw}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-green-400" />
                  {MOVING_BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${MOVING_BUSINESS.email}`}
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-green-400" />
                  {MOVING_BUSINESS.email}
                </a>
              </li>
            </ul>
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, label, href: socialHref }) => (
                <a
                  key={label}
                  href={socialHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-green-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {MOVING_NAV_LINKS.map(({ label, href: linkHref }) => (
                <li key={linkHref}>
                  <Link
                    href={href(linkHref)}
                    className="text-sm text-white/60 transition-colors hover:text-green-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {MOVING_SERVICE_STRIP.slice(0, 6).map((item) => (
                <li key={item} className="text-sm text-white/60">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/40 sm:flex-row sm:text-left">
          <p>
            © {year} {MOVING_BUSINESS.parentName}. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {LEGAL_LINKS.map(({ label, href: legalHref }) => (
                <Link
                  key={legalHref}
                  href={href(legalHref)}
                  className="transition-colors hover:text-white/70"
                >
                  {label}
                </Link>
              ))}
            </div>
            <p className="flex items-center gap-1.5">
              <span>{MOVING_BUSINESS.tagline}</span>
              <span className="text-white/20">·</span>
              <a
                href={MOVING_BUSINESS.mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/50 transition-colors hover:text-green-300"
              >
                Waste Solutions
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
