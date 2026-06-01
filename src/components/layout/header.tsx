"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAV_CTA } from "@/lib/constants";
import { BUSINESS } from "@/lib/business";
import { getServiceIconFromHref } from "@/lib/service-icons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

// ─── Services dropdown ────────────────────────────────────────────────────────
function ServicesDropdown({
  items,
  onNavigate,
}: {
  items: (typeof NAV_LINKS)[0]["children"];
  onNavigate?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 top-full z-50 mt-2 w-[520px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl dark:bg-gray-900"
    >
      <div className="grid grid-cols-2 gap-1 p-3">
        {items?.map((item) => {
          const Icon = getServiceIconFromHref(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white dark:bg-green-900/40">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground group-hover:text-green-600">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-border bg-gray-50 p-3 dark:bg-gray-900/50">
        <Link
          href="/services"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
        >
          View all services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Top bar — phone & email only here */}
      <div className="bg-brand-navy py-2 text-xs text-white/90">
        <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center sm:text-left">
            Serving Durham · Scarborough · Vaughan · Toronto
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="flex items-center gap-1.5 font-semibold hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              {BUSINESS.phone}
            </a>
            <a
              href={`mailto:${BUSINESS.email}`}
              className="flex items-center gap-1.5 font-semibold hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {BUSINESS.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={cn(
          "sticky top-0 z-nav w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-sm dark:bg-gray-950/95"
            : "bg-white dark:bg-gray-950"
        )}
      >
        <nav className="container flex h-[4.5rem] items-center gap-6" aria-label="Main navigation">
          <Logo variant="header" priority size="lg" />

          {/* Desktop links */}
          <div className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);

              if ("children" in link) {
                return (
                  <div key={link.href} className="relative" ref={servicesRef}>
                    <button
                      onClick={() => setServicesOpen((prev) => !prev)}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive || servicesOpen
                          ? "bg-green-50 text-green-600 dark:bg-green-950/30"
                          : "text-foreground hover:bg-muted"
                      )}
                      aria-expanded={servicesOpen}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          servicesOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <ServicesDropdown
                          items={link.children}
                          onNavigate={() => setServicesOpen(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-green-50 text-green-600 dark:bg-green-950/30"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Button asChild size="md" variant="primary">
              <Link href={NAV_CTA.href}>
                {NAV_CTA.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-white shadow-2xl dark:bg-gray-950 lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Logo variant="header" priority size="lg" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer links */}
              <div className="flex-1 overflow-y-auto py-4">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    {"children" in link ? (
                      <div>
                        <div className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Services
                        </div>
                        {link.children.map((child) => {
                          const Icon = getServiceIconFromHref(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground hover:bg-green-50 hover:text-green-600"
                            >
                              <Icon className="h-4 w-4 text-green-500" />
                              {child.label}
                            </Link>
                          );
                        })}
                        <div className="my-2 border-t border-border" />
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-5 py-3 text-sm font-medium transition-colors hover:bg-muted",
                          pathname.startsWith(link.href) ? "text-green-600" : "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="border-t border-border p-5">
                <Button asChild variant="primary" size="lg" className="w-full">
                  <Link href="/contact#quote">Get Free Quote</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
