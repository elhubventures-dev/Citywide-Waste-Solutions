"use client";

import { useState, useEffect } from "react";
import {
  FileText, Mail, DollarSign, Users, TrendingUp,
  CheckCircle2, Clock, AlertCircle, Archive, RefreshCw,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color = "green",
}: {
  icon: any; label: string; value: string | number; sub?: string; color?: string;
}) {
  const colorMap = {
    green: "bg-green-100 text-green-600 dark:bg-green-950/40",
    blue:  "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
    earth: "bg-earth-100 text-earth-600 dark:bg-earth-950/40",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/40",
  } as Record<string, string>;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map = {
    NEW:      { label: "New",      cls: "bg-green-100 text-green-700" },
    READ:     { label: "Read",     cls: "bg-blue-100 text-blue-700" },
    REPLIED:  { label: "Replied",  cls: "bg-gray-100 text-gray-700" },
    ARCHIVED: { label: "Archived", cls: "bg-amber-100 text-amber-700" },
  } as Record<string, { label: string; cls: string }>;

  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", s.cls)}>
      {s.label}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [quotes,   setQuotes]   = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<"quotes" | "contacts">("quotes");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, cRes] = await Promise.all([
        fetch("/api/admin/submissions?type=quote&limit=20"),
        fetch("/api/admin/submissions?type=contact&limit=20"),
      ]);
      const qData = await qRes.json();
      const cData = await cRes.json();
      setQuotes(qData.items   ?? []);
      setContacts(cData.items ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, type: string, status: string) => {
    await fetch("/api/admin/submissions", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, type, status }),
    });
    fetchData();
  };

  const newQuotes   = quotes.filter((q) => q.status === "NEW").length;
  const newContacts = contacts.filter((c) => c.status === "NEW").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Citywide Waste Solutions</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FileText}   label="New Quote Requests" value={newQuotes}   sub="Awaiting response"  color="green" />
          <StatCard icon={Mail}       label="New Contact Messages" value={newContacts} sub="Awaiting response"  color="blue"  />
          <StatCard icon={Users}      label="Total Quotes (30d)"  value={quotes.length}   color="earth" />
          <StatCard icon={TrendingUp} label="Total Messages (30d)" value={contacts.length} color="amber" />
        </div>

        {/* Submissions table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["quotes", "contacts"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold transition-colors",
                  tab === t
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "quotes" ? "Quote Requests" : "Contact Messages"}
                {t === "quotes" && newQuotes   > 0 && (
                  <span className="ml-2 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">{newQuotes}</span>
                )}
                {t === "contacts" && newContacts > 0 && (
                  <span className="ml-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">{newContacts}</span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading submissions…</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                    {tab === "quotes" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</th>
                      </>
                    )}
                    {tab === "contacts" && (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(tab === "quotes" ? quotes : contacts).map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{item.fullName}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${item.email}`} className="text-green-600 hover:underline">
                          {item.email}
                        </a>
                      </td>
                      {tab === "quotes" && (
                        <>
                          <td className="px-4 py-3 text-muted-foreground">{item.serviceType?.replace(/_/g, " ")}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.city}</td>
                        </>
                      )}
                      {tab === "contacts" && (
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{item.subject}</td>
                      )}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(item.createdAt, { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {item.status === "NEW" && (
                            <button
                              onClick={() => updateStatus(item.id, tab === "quotes" ? "quote" : "contact", "READ")}
                              title="Mark as Read"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {item.status === "READ" && (
                            <button
                              onClick={() => updateStatus(item.id, tab === "quotes" ? "quote" : "contact", "REPLIED")}
                              title="Mark as Replied"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(item.id, tab === "quotes" ? "quote" : "contact", "ARCHIVED")}
                            title="Archive"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(tab === "quotes" ? quotes : contacts).length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick links to Sanity */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Content Management</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Open Sanity Studio",   href: "/studio",          emoji: "✏️" },
              { label: "Manage Blog Posts",     href: "/studio/blogPost", emoji: "📝" },
              { label: "Update Pricing",        href: "/studio/pricingTier", emoji: "💰" },
              { label: "Update Services",       href: "/studio/service",  emoji: "🗂️" },
              { label: "Manage Testimonials",   href: "/studio/testimonial", emoji: "⭐" },
            ].map(({ label, href, emoji }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-green-300 hover:text-green-600 transition-colors"
              >
                <span>{emoji}</span> {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
