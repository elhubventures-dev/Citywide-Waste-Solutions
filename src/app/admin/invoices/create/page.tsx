"use client";

// ─── Create Invoice Page ─────────────────────────────────────────────────────
// /admin/invoices/create — full invoice creation form with live calculations.
// Supports loading an existing draft via ?draft=<id> query param.

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Save, Send, FileDown, ArrowLeft, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useInvoice } from "@/hooks/use-invoice";
import {
  ClientInfoForm,
  InvoiceDetailsForm,
  LineItemsTable,
  TotalsPanel,
} from "@/components/admin/invoices";

// ─── Inner component (needs useSearchParams inside Suspense) ─────────────────

function CreateInvoiceContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft") ?? undefined;

  const invoice = useInvoice({ draftId });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <Link
              href="/admin/invoices"
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft size={14} />
              Back to Invoices
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Invoice Manager
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {draftId ? "Edit Invoice" : "New Invoice"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Citywide Waste Solutions · Ontario, Canada
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={invoice.resetInvoice}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Reset form"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={() => invoice.saveDraft()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/20"
            >
              <Save size={15} />
              Save Draft
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600"
              title="Send Invoice (coming in Phase 4)"
              onClick={() =>
                alert(
                  "Send Invoice is coming in Phase 4 (Integrations). For now, use Save Draft + Preview PDF."
                )
              }
            >
              <Send size={15} />
              Send Invoice
            </button>
          </div>
        </motion.div>

        {/* Saved indicator */}
        {invoice.savedAt && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 text-xs font-medium text-green-600 dark:text-green-400"
          >
            ✓ Draft saved at {invoice.savedAt}
          </motion.div>
        )}

        {/* Two-column: Client Info | Invoice Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5 grid gap-5 lg:grid-cols-2"
        >
          <ClientInfoForm client={invoice.client} onChange={invoice.updateClient} />
          <InvoiceDetailsForm meta={invoice.meta} onChange={invoice.updateMeta} />
        </motion.div>

        {/* Service Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-5"
        >
          <LineItemsTable
            rows={invoice.rows}
            onUpdateRow={invoice.updateRow}
            onAddRow={invoice.addRow}
            onDuplicateRow={invoice.duplicateRow}
            onDeleteRow={invoice.deleteRow}
            onAddFromLibrary={invoice.addFromLibrary}
            lineTotal={invoice.lineTotal}
            formatCurrency={invoice.formatCurrency}
          />
        </motion.div>

        {/* Totals + Preview PDF */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col items-end gap-4"
        >
          <TotalsPanel
            totals={invoice.totals}
            meta={invoice.meta}
            onChangeMeta={invoice.updateMeta}
            formatCurrency={invoice.formatCurrency}
          />

          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/20"
            title="Preview PDF (coming in Phase 2)"
            onClick={() =>
              alert("PDF Preview is coming in Phase 2. Draft your invoice and save it for now.")
            }
          >
            <FileDown size={15} />
            Preview PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense for useSearchParams ──────────────────────────

export default function CreateInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <CreateInvoiceContent />
    </Suspense>
  );
}
