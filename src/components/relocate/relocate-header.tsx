"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOVING_NAV_LINKS, MOVING_NAV_CTA, MOVING_PHONE_CTA } from "@/lib/moving/constants";
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
    <header
      className={cn(
        "sticky top-0 z-nav border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-white/95 shadow-sm backdrop-blur-md dark:bg-gray-950/95"
          : "border-transparent bg-white dark:bg-gray-950"
      )}
    >
      {/* Top phone bar */}
      <div className="hidden border-b border-green-100 bg-green-50 lg:block dark:border-green-900/30 dark:bg-green-950/20">
        <div className="container flex items-center justify-between py-2 text-xs">
          <p className="font-medium text-green-800 dark:text-green-200">
            Professional moving across the GTA &amp; Durham Region
          </p>
          <a
            href={MOVING_PHONE_CTA.href}
            className="inline-flex items-center gap-2 font-semibold text-green-700 transition-colors hover:text-green-800 dark:text-green-300"
          >
            <Phone className="h-3.5 w-3.5" />
            Call for a free quote: {MOVING_PHONE_CTA.display}
          </a>
        </div>
      </div>

      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <MovingLogo priority variant="dark" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {MOVING_NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={resolve(href)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                isActive(href)
                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={MOVING_PHONE_CTA.href}>
              <Phone className="h-4 w-4" />
              {MOVING_PHONE_CTA.display}
            </a>
          </Button>
          <Button asChild size="sm">
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <nav className="container space-y-1 py-4" aria-label="Mobile navigation">
              {MOVING_NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={resolve(href)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-semibold",
                    isActive(href) ? "bg-green-50 text-green-700" : "text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="grid gap-2 pt-3">
                <Button asChild className="w-full">
                  <Link href={resolve(MOVING_NAV_CTA.href)}>{MOVING_NAV_CTA.label}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
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
  );
}
