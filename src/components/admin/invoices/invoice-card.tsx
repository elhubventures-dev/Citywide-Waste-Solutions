"use client";

// ─── InvoiceCard ─────────────────────────────────────────────────────────────
// Reusable card wrapper for the invoice manager sections.

import { cn } from "@/lib/utils";

interface InvoiceCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function InvoiceCard({ title, action, children, className }: InvoiceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {action}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
