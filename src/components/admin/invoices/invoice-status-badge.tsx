"use client";

// ─── InvoiceStatusBadge ──────────────────────────────────────────────────────
// Color-coded pill badge for invoice statuses.

import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/invoice-constants";
import type { InvoiceStatus } from "@/types/invoice";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colors.bg,
        colors.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {status}
    </span>
  );
}
