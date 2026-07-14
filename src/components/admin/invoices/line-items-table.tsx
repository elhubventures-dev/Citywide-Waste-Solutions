"use client";

// ─── LineItemsTable ──────────────────────────────────────────────────────────
// Dynamic table of service line items with inline editing, row actions, and
// service library integration.

import { useState } from "react";
import { Plus, Copy, Trash2, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { InvoiceCard } from "./invoice-card";
import { ServiceLibraryPopover } from "./service-library-popover";
import type { InvoiceRow, ServiceLibraryItem } from "@/types/invoice";

interface LineItemsTableProps {
  rows: InvoiceRow[];
  onUpdateRow: (id: string, patch: Partial<InvoiceRow>) => void;
  onAddRow: () => void;
  onDuplicateRow: (id: string) => void;
  onDeleteRow: (id: string) => void;
  onAddFromLibrary: (svc: ServiceLibraryItem) => void;
  lineTotal: (r: InvoiceRow) => number;
  formatCurrency: (n: number) => string;
}

const cellInputClass =
  "w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

export function LineItemsTable({
  rows,
  onUpdateRow,
  onAddRow,
  onDuplicateRow,
  onDeleteRow,
  onAddFromLibrary,
  lineTotal,
  formatCurrency,
}: LineItemsTableProps) {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <InvoiceCard
      title="Service Items"
      action={
        <div className="relative flex gap-2">
          <button
            onClick={() => setShowLibrary((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Library size={13} />
            From Library
          </button>
          <button
            onClick={onAddRow}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <Plus size={13} />
            Add Item
          </button>

          <ServiceLibraryPopover
            open={showLibrary}
            onClose={() => setShowLibrary(false)}
            onSelect={onAddFromLibrary}
            formatCurrency={formatCurrency}
          />
        </div>
      }
    >
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
              {["Service", "Qty", "Unit", "Price", "Disc %", "Tax %", "Total", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-2 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/30",
                  idx % 2 === 0 ? "" : "bg-gray-50/30 dark:bg-gray-800/10"
                )}
              >
                {/* Service name */}
                <td className="px-2 py-1.5" style={{ minWidth: 200 }}>
                  <input
                    value={r.service}
                    onChange={(e) => onUpdateRow(r.id, { service: e.target.value })}
                    className={cellInputClass}
                    placeholder="Service name"
                  />
                </td>
                {/* Qty */}
                <td className="px-2 py-1.5" style={{ width: 70 }}>
                  <input
                    type="number"
                    min={0}
                    value={r.qty}
                    onChange={(e) => onUpdateRow(r.id, { qty: +e.target.value })}
                    className={cellInputClass}
                  />
                </td>
                {/* Unit */}
                <td className="px-2 py-1.5" style={{ width: 90 }}>
                  <input
                    value={r.unit}
                    onChange={(e) => onUpdateRow(r.id, { unit: e.target.value })}
                    className={cellInputClass}
                  />
                </td>
                {/* Price */}
                <td className="px-2 py-1.5" style={{ width: 100 }}>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={r.price}
                    onChange={(e) => onUpdateRow(r.id, { price: +e.target.value })}
                    className={cellInputClass}
                  />
                </td>
                {/* Discount % */}
                <td className="px-2 py-1.5" style={{ width: 80 }}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={r.discount}
                    onChange={(e) => onUpdateRow(r.id, { discount: +e.target.value })}
                    className={cellInputClass}
                  />
                </td>
                {/* Tax % */}
                <td className="px-2 py-1.5" style={{ width: 80 }}>
                  <input
                    type="number"
                    min={0}
                    value={r.tax}
                    onChange={(e) => onUpdateRow(r.id, { tax: +e.target.value })}
                    className={cellInputClass}
                  />
                </td>
                {/* Total */}
                <td
                  className="whitespace-nowrap px-2 py-1.5 font-semibold text-gray-900 dark:text-gray-100"
                  style={{ width: 110 }}
                >
                  {formatCurrency(lineTotal(r))}
                </td>
                {/* Actions */}
                <td className="px-2 py-1.5" style={{ width: 70 }}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onDuplicateRow(r.id)}
                      title="Duplicate row"
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteRow(r.id)}
                      title="Delete row"
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{rows.length} item{rows.length !== 1 ? "s" : ""}</span>
        <button
          onClick={onAddRow}
          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600"
        >
          <Plus size={12} />
          Add another item
        </button>
      </div>
    </InvoiceCard>
  );
}
