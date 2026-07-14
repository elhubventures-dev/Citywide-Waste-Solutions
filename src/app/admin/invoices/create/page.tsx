"use client";

// ─── Create Invoice Page ─────────────────────────────────────────────────────
// /admin/invoices/create — full invoice creation form with live calculations.
// Supports loading an existing draft via ?draft=<id> query param.

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Save, Send, FileDown, ArrowLeft, RotateCcw, Loader2, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { useInvoice } from "@/hooks/use-invoice";
import {
  ClientInfoForm,
  InvoiceDetailsForm,
  LineItemsTable,
  TotalsPanel,
  PdfPreviewModal,
  SendInvoiceModal,
} from "@/components/admin/invoices";

// ─── Inner component (needs useSearchParams inside Suspense) ─────────────────

function CreateInvoiceContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft") ?? undefined;
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const invoice = useInvoice({ draftId });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {invoice.isLoading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-sm text-gray-500">Loading invoice...</p>
          </div>
        ) : (
          <>
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
            {invoice.meta.type === "QUOTE" && (
              <button
                onClick={() => {
                  invoice.updateMeta({ type: "INVOICE", status: "Draft" });
                  setTimeout(() => invoice.saveDraft(), 0);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-teal transition-colors hover:bg-teal-600 disabled:opacity-50"
                title="Convert to Invoice"
              >
                Convert to Invoice
              </button>
            )}
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600 disabled:opacity-50"
              title={invoice.meta.type === "QUOTE" ? "Send Quote" : "Send Invoice"}
              disabled={!invoice.currentDraftId}
              onClick={() => setShowSendModal(true)}
            >
              <Send size={15} />
              {invoice.meta.type === "QUOTE" ? "Send Quote" : "Send Invoice"}
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

          <div className="flex gap-2">
            <Link
              href={`/admin/invoices/${invoice.currentDraftId}/print`}
              target="_blank"
              className={`inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 ${
                !invoice.currentDraftId ? "pointer-events-none opacity-50" : ""
              }`}
              title="Print Invoice"
            >
              <Printer size={15} />
              Print
            </Link>

            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-blue-900/20"
              title="Preview PDF"
              onClick={() => setShowPdfModal(true)}
            >
              <FileDown size={15} />
              Preview PDF
            </button>
          </div>
        </motion.div>


        {/* Activity Timeline */}
        <ActivityTimeline activities={invoice.activities} />

          </>
        )}
      </div>

      <PdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        draft={{
          id: invoice.currentDraftId || `temp-${Date.now()}`,
          client: invoice.client,
          meta: invoice.meta,
          rows: invoice.rows,
          createdAt: invoice.savedAt || new Date().toISOString(),
          updatedAt: invoice.savedAt || new Date().toISOString(),
        }}
        formatCurrency={invoice.formatCurrency}
      />

      <SendInvoiceModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        draft={{
          id: invoice.currentDraftId || `temp-${Date.now()}`,
          client: invoice.client,
          meta: invoice.meta,
          rows: invoice.rows,
          createdAt: invoice.savedAt || new Date().toISOString(),
          updatedAt: invoice.savedAt || new Date().toISOString(),
        }}
        formatCurrency={invoice.formatCurrency}
      />
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

// ─── Activity Timeline Component ─────────────────────────────────────────────

function ActivityTimeline({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
        Activity Timeline
      </h3>
      <div className="relative border-l border-gray-200 pl-6 dark:border-gray-700 ml-2">
        {activities.map((act, idx) => {
          let color = "bg-blue-500";
          if (act.action === "CREATED") color = "bg-gray-400";
          if (act.action === "SENT") color = "bg-blue-500";
          if (act.action === "VIEWED") color = "bg-purple-500";
          if (act.action === "PAID") color = "bg-green-500";

          return (
            <div key={act.id} className="mb-6 last:mb-0 relative">
              <div className={`absolute -left-[31px] mt-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-gray-900 ${color}`} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {act.action}
                </span>
                {act.notes && (
                  <span className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                    {act.notes}
                  </span>
                )}
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {new Date(act.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

