"use client";

// ─── TotalsPanel ─────────────────────────────────────────────────────────────
// Right-aligned summary: subtotal, discount, tax, grand total, deposit,
// amount paid, balance due.

import type { InvoiceMeta, InvoiceTotals } from "@/types/invoice";

interface TotalsPanelProps {
  totals: InvoiceTotals;
  meta: InvoiceMeta;
  onChangeMeta: (patch: Partial<InvoiceMeta>) => void;
  formatCurrency: (n: number) => string;
}

function SummaryRow({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-1 text-sm"
      style={{ fontWeight: bold ? 700 : 400 }}
    >
      <span className={bold ? (color || "text-gray-900 dark:text-gray-100") : "text-gray-500 dark:text-gray-400"}>
        {label}
      </span>
      <span className={color || "text-gray-900 dark:text-gray-100"}>{value}</span>
    </div>
  );
}

export function TotalsPanel({ totals, meta, onChangeMeta, formatCurrency }: TotalsPanelProps) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-gray-900">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Payment Summary
      </h4>

      <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
      <SummaryRow label="Discount" value={`- ${formatCurrency(totals.discountTotal)}`} />
      <SummaryRow label="Tax (HST)" value={formatCurrency(totals.taxTotal)} />

      <div className="my-2.5 border-t-2 border-blue-500" />

      <SummaryRow
        label="Grand Total"
        value={formatCurrency(totals.grandTotal)}
        bold
      />

      {/* Deposit */}
      <div className="mt-3">
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Deposit
        </label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={meta.deposit}
          onChange={(e) => onChangeMeta({ deposit: +e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Amount Paid */}
      <div className="mt-2">
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Amount Paid
        </label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={meta.amountPaid}
          onChange={(e) => onChangeMeta({ amountPaid: +e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="my-2.5 border-t border-dashed border-gray-300 dark:border-gray-700" />

      <SummaryRow
        label="Balance Due"
        value={formatCurrency(totals.balanceDue)}
        bold
        color="text-blue-500"
      />
    </div>
  );
}
