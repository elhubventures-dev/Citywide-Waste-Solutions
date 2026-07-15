"use client";

import { useState, useEffect, useCallback } from "react";
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
  Trash2,
  Eye,
  Loader2,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { InvoiceStatusBadge } from "@/components/admin/invoices";

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

export default function InvoiceDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [typeFilter, setTypeFilter] = useState<"INVOICE" | "QUOTE">("INVOICE");

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (dateFilter !== "All Time") params.append("dateRange", dateFilter);
      params.append("type", typeFilter);

      const res = await fetch(`/api/admin/invoices?${params.toString()}`);
      const data = await res.json();
      if (data.invoices) setInvoices(data.invoices);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, dateFilter, typeFilter]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInvoices();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchInvoices]);

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (statusFilter !== "All") params.append("status", statusFilter);
    if (dateFilter !== "All Time") params.append("dateRange", dateFilter);
    params.append("type", typeFilter);

    window.location.href = `/api/admin/invoices/export?${params.toString()}`;
  };

  const statusCounts = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((s, inv) => s + inv.grandTotal, 0);

  const outstanding = invoices
    .filter((inv) => !["Paid", "Cancelled", "Refunded", "Draft"].includes(inv.status))
    .reduce((s, inv) => s + inv.balanceDue, 0);

  const wasteRevenue = invoices
    .filter((inv) => inv.status === "Paid" && inv.brand === "waste")
    .reduce((s, inv) => s + inv.grandTotal, 0);

  const movingRevenue = invoices
    .filter((inv) => inv.status === "Paid" && inv.brand === "moving")
    .reduce((s, inv) => s + inv.grandTotal, 0);

  const totalBrandRevenue = wasteRevenue + movingRevenue || 1;
  const wastePct = (wasteRevenue / totalBrandRevenue) * 100;
  const movingPct = (movingRevenue / totalBrandRevenue) * 100;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      setInvoices(invoices.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice.");
    }
  };

  return (
    <div className="space-y-6">
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
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download size={16} />
              Export CSV
            </button>
            <Link
              href="/admin/invoices/create"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600"
            >
              <Plus size={16} />
              New {typeFilter === "QUOTE" ? "Quote" : "Invoice"}
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setTypeFilter("INVOICE")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              typeFilter === "INVOICE"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setTypeFilter("QUOTE")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              typeFilter === "QUOTE"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Quotes
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Invoices" value={invoices.length} icon={FileText} color="#1E3A5C" delay={0.05} />
          <StatCard label="Draft" value={statusCounts["Draft"] || 0} icon={Clock} color="#6B7280" delay={0.1} />
          <StatCard label="Sent" value={statusCounts["Sent"] || 0} icon={Send} color="#3B82F6" delay={0.15} />
          <StatCard label="Paid" value={statusCounts["Paid"] || 0} icon={CheckCircle} color="#2E9B4A" delay={0.2} />
          <StatCard label="Overdue" value={statusCounts["Overdue"] || 0} icon={AlertCircle} color="#DC2626" delay={0.25} />
          <StatCard label="Pending" value={statusCounts["Pending"] || 0} icon={Clock} color="#D97706" delay={0.3} />
          <StatCard label="Revenue" value={fmt(totalRevenue)} icon={DollarSign} color="#2E9B4A" delay={0.35} />
          <StatCard label="Outstanding" value={fmt(outstanding)} icon={TrendingUp} color="#DC2626" delay={0.4} />
        </div>

        {/* Revenue by Brand */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Paid Revenue by Brand
            </h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total: {fmt(wasteRevenue + movingRevenue)}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex">
            {wastePct > 0 && (
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                style={{ width: `${wastePct}%` }}
                title={`Waste Solutions: ${fmt(wasteRevenue)}`}
              />
            )}
            {movingPct > 0 && (
              <div 
                className="h-full bg-amber-500 transition-all duration-1000 ease-out" 
                style={{ width: `${movingPct}%` }}
                title={`Moving Solutions: ${fmt(movingRevenue)}`}
              />
            )}
          </div>
          <div className="mt-3 flex justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Waste Solutions ({fmt(wasteRevenue)})
            </div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              Moving Solutions ({fmt(movingRevenue)})
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        >
          <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                Recent Invoices
              </h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {invoices.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No invoices found
              </h3>
              <p className="mb-6 mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left dark:border-white/[0.05]">
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Invoice #</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Client</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-brand-500 dark:text-brand-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {inv.client?.name || inv.client?.company || "—"}
                        </div>
                        {inv.client?.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {inv.client.email}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <InvoiceStatusBadge status={inv.status as any} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {inv.issueDate || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {fmt(inv.grandTotal)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/invoices/create?draft=${inv.id}`}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
                            title="Edit"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
    </div>
  );
}
