"use client";

// ─── ClientInfoForm ──────────────────────────────────────────────────────────
// Client information section for the create-invoice form.

import type { InvoiceClient } from "@/types/invoice";
import { InvoiceCard } from "./invoice-card";

interface ClientInfoFormProps {
  client: InvoiceClient;
  onChange: (patch: Partial<InvoiceClient>) => void;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className || "flex-1"}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
      />
    </div>
  );
}

export function ClientInfoForm({ client, onChange }: ClientInfoFormProps) {
  return (
    <InvoiceCard title="Client Information">
      <Field
        label="Company Name"
        value={client.company}
        onChange={(v) => onChange({ company: v })}
        placeholder="Company or business name"
      />
      <Field
        label="Client Name"
        value={client.name}
        onChange={(v) => onChange({ name: v })}
        placeholder="Full name"
      />
      <div className="flex gap-3">
        <Field
          label="Phone"
          value={client.phone}
          onChange={(v) => onChange({ phone: v })}
          type="tel"
          placeholder="(437) 580-6054"
        />
        <Field
          label="Email"
          value={client.email}
          onChange={(v) => onChange({ email: v })}
          type="email"
          placeholder="client@example.com"
        />
      </div>
      <Field
        label="Service Address"
        value={client.serviceAddress}
        onChange={(v) => onChange({ serviceAddress: v })}
        placeholder="Where the service is performed"
      />
      <Field
        label="Billing Address"
        value={client.billingAddress}
        onChange={(v) => onChange({ billingAddress: v })}
        placeholder="Billing address (if different)"
      />
      <div className="flex gap-3">
        <Field
          label="City"
          value={client.city}
          onChange={(v) => onChange({ city: v })}
          placeholder="City"
        />
        <Field
          label="Province"
          value={client.province}
          onChange={(v) => onChange({ province: v })}
          placeholder="ON"
        />
        <Field
          label="Postal Code"
          value={client.zip}
          onChange={(v) => onChange({ zip: v })}
          placeholder="L1E 3H8"
        />
      </div>
      <div className="flex gap-3">
        <Field
          label="Tax Number"
          value={client.taxNumber}
          onChange={(v) => onChange({ taxNumber: v })}
          placeholder="Optional"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Notes
        </label>
        <textarea
          value={client.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Client notes (internal only)"
          rows={2}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
        />
      </div>
    </InvoiceCard>
  );
}
