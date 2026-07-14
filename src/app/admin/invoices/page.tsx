"use client";

// ─── Invoice Dashboard Page ──────────────────────────────────────────────────
// /admin/invoices — summary stats, recent invoices table, quick actions.
// Phase 1: reads from localStorage drafts.

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Trash2,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { loadAllDrafts } from "@/hooks/use-invoice";
import { InvoiceStatusBadge } from "@/components/admin/invoices";
import type { InvoiceDraft, InvoiceStatus } from "@/types/invoice";

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InvoiceDashboardPage() {
  const [drafts, setDrafts] = useState<InvoiceDraft[]>([]);

  useEffect(() => {
    setDrafts(loadAllDrafts());
  }, []);

  // Compute stats from drafts
  const statusCounts = drafts.reduce(
    (acc, d) => {
      acc[d.meta.status] = (acc[d.meta.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalRevenue = drafts
    .filter((d) => d.meta.status === "Paid")
    .reduce((s, d) => {
      const subtotal = d.rows.reduce((rs, r) => rs + r.qty * r.price, 0);
      return s + subtotal;
    }, 0);

  const outstanding = drafts
    .filter((d) => !["Paid", "Cancelled", "Refunded", "Draft"].includes(d.meta.status))
    .reduce((s, d) => {
      const subtotal = d.rows.reduce((rs, r) => rs + r.qty * r.price, 0);
      return s + subtotal;
    }, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  const handleDelete = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("citywide-invoice-drafts", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Invoice Manager
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Invoice Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Citywide Waste Solutions · Ontario, Canada
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              ← Dashboard
            </Link>
            <Link
              href="/admin/invoices/create"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600"
            >
              <Plus size={16} />
              New Invoice
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Invoices" value={drafts.length} icon={FileText} color="#1E3A5C" delay={0.05} />
          <StatCard label="Draft" value={statusCounts["Draft"] || 0} icon={Clock} color="#6B7280" delay={0.1} />
          <StatCard label="Sent" value={statusCounts["Sent"] || 0} icon={Send} color="#3B82F6" delay={0.15} />
          <StatCard label="Paid" value={statusCounts["Paid"] || 0} icon={CheckCircle} color="#2E9B4A" delay={0.2} />
          <StatCard label="Overdue" value={statusCounts["Overdue"] || 0} icon={AlertCircle} color="#DC2626" delay={0.25} />
          <StatCard label="Pending" value={statusCounts["Pending"] || 0} icon={Clock} color="#D97706" delay={0.3} />
          <StatCard label="Revenue" value={fmt(totalRevenue)} icon={DollarSign} color="#2E9B4A" delay={0.35} />
          <StatCard label="Outstanding" value={fmt(outstanding)} icon={TrendingUp} color="#DC2626" delay={0.4} />
        </div>

        {/* Recent Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white shadow-card dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Recent Invoices
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {drafts.length} total
            </span>
          </div>

          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No invoices yet
              </h3>
              <p className="mb-6 mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Create your first invoice to get started. All drafts are saved locally and will appear here.
              </p>
              <Link
                href="/admin/invoices/create"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-blue hover:bg-blue-600"
              >
                <Plus size={16} />
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left dark:border-gray-800">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Client
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((d, idx) => {
                    const total = d.rows.reduce((s, r) => {
                      const base = r.qty * r.price;
                      const afterDisc = base - (base * r.discount) / 100;
                      return s + afterDisc + (afterDisc * r.tax) / 100;
                    }, 0);

                    return (
                      <tr
                        key={d.id}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-gray-800/50 dark:hover:bg-gray-800/30"
                      >
                        <td className="whitespace-nowrap px-6 py-3 font-semibold text-blue-500">
                          {d.meta.invoiceNo}
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {d.client.name || d.client.company || "—"}
                          </div>
                          {d.client.email && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {d.client.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <InvoiceStatusBadge status={d.meta.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-600 dark:text-gray-400">
                          {d.meta.issueDate || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                          {fmt(total)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/invoices/create?draft=${d.id}`}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
                              title="Edit"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
