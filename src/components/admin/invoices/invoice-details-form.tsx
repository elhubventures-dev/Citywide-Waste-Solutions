"use client";

// ─── InvoiceDetailsForm ──────────────────────────────────────────────────────
// Invoice metadata section: invoice #, dates, currency, terms, status, brand.

import type { InvoiceMeta, InvoiceStatus } from "@/types/invoice";
import { INVOICE_STATUSES, PAYMENT_TERMS, CURRENCY_OPTIONS } from "@/lib/invoice-constants";
import { InvoiceCard } from "./invoice-card";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceDetailsFormProps {
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
      />
    </div>
  );
}

export function InvoiceDetailsForm({ meta, onChange }: InvoiceDetailsFormProps) {
  return (
    <InvoiceCard title="Invoice Details">
      <div className="flex gap-3">
        <Field
          label="Invoice #"
          value={meta.invoiceNo}
          onChange={(v) => onChange({ invoiceNo: v })}
          placeholder="CW-2026-0001"
        />
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Currency
          </label>
          <select
            value={meta.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <Field
          label="Issue Date"
          value={meta.issueDate}
          onChange={(v) => onChange({ issueDate: v })}
          type="date"
        />
        <Field
          label="Due Date"
          value={meta.dueDate}
          onChange={(v) => onChange({ dueDate: v })}
          type="date"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Payment Terms
          </label>
          <select
            value={meta.terms}
            onChange={(e) => onChange({ terms: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {PAYMENT_TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Brand
          </label>
          <select
            value={meta.brand}
            onChange={(e) => onChange({ brand: e.target.value as "waste" | "moving" })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="waste">Citywide Waste Solutions</option>
            <option value="moving">Citywide Moving Solutions</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Status
        </label>
        <div className="flex items-center gap-3">
          <select
            value={meta.status}
            onChange={(e) => onChange({ status: e.target.value as InvoiceStatus })}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {INVOICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <InvoiceStatusBadge status={meta.status} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Document Type
        </label>
        <select
          value={meta.type || "INVOICE"}
          onChange={(e) => onChange({ type: e.target.value as "INVOICE" | "QUOTE" })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="INVOICE">Invoice</option>
          <option value="QUOTE">Quote</option>
        </select>
      </div>
    </InvoiceCard>
  );
}
