"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOVING_BUSINESS } from "@/lib/moving/business";
import { MOVING_NAV_LINKS, MOVING_NAV_CTA, MOVING_PHONE_CTA, MAIN_SITE_HEADER_CTA, MOVING_SERVICE_AREAS_HEADLINE } from "@/lib/moving/constants";
import { relocateHref } from "@/lib/moving/paths";
import { MovingLogo } from "@/components/relocate/moving-logo";
import { Button } from "@/components/ui/button";

export function RelocateHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const resolve = (path: string) => {
    if (typeof window !== "undefined") return relocateHref(path, window.location.host);
    return relocateHref(path);
  };

  const isActive = (href: string) => {
    const base = pathname.replace(/^\/relocate/, "") || "/";
    const target = href === "/" ? "/" : href;
    return base === target || (target !== "/" && base.startsWith(target));
  };

  return (
    <>
      {/* Top bar — brand navy */}
      <div className="bg-brand-navy py-2 text-xs text-white/90">
        <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center sm:text-left">{MOVING_SERVICE_AREAS_HEADLINE}</span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
            <a
              href={MOVING_PHONE_CTA.href}
              className="inline-flex items-center gap-1.5 font-semibold hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              {MOVING_PHONE_CTA.display}
            </a>
            <a
              href={`mailto:${MOVING_BUSINESS.email}`}
              className="inline-flex items-center gap-1.5 font-semibold hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {MOVING_BUSINESS.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-nav border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-white/95 shadow-sm backdrop-blur-md dark:bg-gray-950/95"
            : "border-transparent bg-white dark:bg-gray-950"
        )}
      >
        <div className="container relative flex h-[4.5rem] items-center">
          <MovingLogo priority variant="dark" className="shrink-0" />

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            <Button asChild variant="primary" size="md">
              <a href={MAIN_SITE_HEADER_CTA.href}>
                {MAIN_SITE_HEADER_CTA.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            {MOVING_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={resolve(href)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  isActive(href)
                    ? "bg-green-50 text-brand-green dark:bg-green-950/40 dark:text-green-300"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              <Button asChild variant="outline-invert" size="md">
                <a href={MOVING_PHONE_CTA.href}>
                  <Phone className="h-4 w-4" />
                  {MOVING_PHONE_CTA.display}
                </a>
              </Button>
              <Button asChild variant="primary" size="md">
                <Link href={resolve(MOVING_NAV_CTA.href)}>
                  {MOVING_NAV_CTA.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <nav className="container space-y-1 py-4" aria-label="Mobile navigation">
                <Button asChild variant="primary" size="lg" className="mb-2 w-full">
                  <a href={MAIN_SITE_HEADER_CTA.href}>
                    {MAIN_SITE_HEADER_CTA.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                {MOVING_NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={resolve(href)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-semibold",
                      isActive(href)
                        ? "bg-green-50 text-brand-green"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <div className="grid gap-2 pt-3">
                  <Button asChild variant="primary" size="lg" className="w-full">
                    <Link href={resolve(MOVING_NAV_CTA.href)}>{MOVING_NAV_CTA.label}</Link>
                  </Button>
                  <Button asChild variant="outline-invert" size="lg" className="w-full">
                    <a href={MOVING_PHONE_CTA.href}>
                      <Phone className="h-4 w-4" />
                      Call {MOVING_PHONE_CTA.display}
                    </a>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
