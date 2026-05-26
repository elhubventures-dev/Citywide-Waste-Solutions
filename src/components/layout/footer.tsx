import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { BUSINESS, SERVICES, SERVICE_AREAS, BLOG_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const SOCIAL_LINKS = [
  { icon: WhatsAppIcon, label: "WhatsApp",  href: BUSINESS.social.whatsapp,  brand: true },
  { icon: Facebook,     label: "Facebook",  href: BUSINESS.social.facebook },
  { icon: Instagram,    label: "Instagram", href: BUSINESS.social.instagram },
  { icon: Linkedin,     label: "LinkedIn",  href: BUSINESS.social.linkedin },
] as const;

const FOOTER_SERVICES = SERVICES.map((s) => ({ label: s.shortTitle, href: `/services/${s.slug}` }));
const FOOTER_AREAS    = SERVICE_AREAS.map((a) => ({ label: a.name,        href: `/service-areas/${a.slug}` }));

const COMPANY_LINKS = [
  { label: "About Us",       href: "/about" },
  { label: "Our Services",   href: "/services" },
  { label: "Pricing",        href: "/pricing" },
  { label: "Recycling Info", href: "/recycling" },
  { label: "Blog",           href: "/blog" },
  { label: "Contact",        href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",    href: "/privacy" },
  { label: "Terms of Service",  href: "/terms" },
  { label: "Disclaimer",        href: "/terms#disclaimer" },
  { label: "Cookie Policy",     href: "/cookies" },
  { label: "Support",           href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand col */}
          <div className="lg:col-span-2 space-y-6">
            <Logo variant="footer" size="xl" />

            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Ontario's trusted waste collection and recycling partner. Professional, eco-conscious,
              and committed to cleaner communities since 2014.
            </p>

            {/* Contact details */}
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-green-400" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-green-400" />
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=2246+Prestonvale+Road+Courtice+Ontario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {BUSINESS.address.full}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span>
                  {BUSINESS.hours.weekdays}<br />
                  {BUSINESS.hours.saturday}<br />
                  {BUSINESS.hours.sunday}
                </span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-green-500 hover:bg-green-500/10 hover:text-white",
                      "brand" in s && s.brand && "hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links — Services */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Services</h3>
            <ul className="space-y-2">
              {FOOTER_SERVICES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links — Areas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Service Areas</h3>
            <ul className="space-y-2">
              {FOOTER_AREAS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links — Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {BUSINESS.name}. All rights reserved.
            </p>
            <p className="text-white/30">
              {BUSINESS.legalName} · BN {BUSINESS.businessNumber} · BIN {BUSINESS.bin} · NAICS {BUSINESS.naics.full}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
