"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Mail,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Archive,
  RefreshCw,
} from "lucide-react";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { cn, formatDate } from "@/lib/utils";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "green",
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  const colorMap = {
    green: "bg-green-100 text-green-600 dark:bg-green-950/40",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
    earth: "bg-earth-100 text-earth-600 dark:bg-earth-950/40",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/40",
  } as Record<string, string>;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-start justify-between">
        <div
          className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colorMap[color])}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map = {
    NEW: { label: "New", cls: "bg-green-100 text-green-700" },
    READ: { label: "Read", cls: "bg-blue-100 text-blue-700" },
    REPLIED: { label: "Replied", cls: "bg-gray-100 text-gray-700" },
    ARCHIVED: { label: "Archived", cls: "bg-amber-100 text-amber-700" },
  } as Record<string, { label: string; cls: string }>;

  const s = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", s.cls)}>{s.label}</span>
  );
}

type SubmissionResponse = {
  items?: any[];
  error?: string;
};

async function fetchSubmissions(type: "quote" | "contact"): Promise<SubmissionResponse> {
  const res = await fetch(`/api/admin/submissions?type=${type}&limit=50`, { cache: "no-store" });
  const data = (await res.json()) as SubmissionResponse;

  if (!res.ok) {
    throw new Error(data.error ?? `Unable to load ${type} submissions.`);
  }

  return data;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [tab, setTab] = useState<"quotes" | "contacts">("quotes");

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    setActionError(null);
    try {
      const [qData, cData] = await Promise.all([
        fetchSubmissions("quote"),
        fetchSubmissions("contact"),
      ]);
      setQuotes(qData.items ?? []);
      setContacts(cData.items ?? []);
    } catch (err) {
      console.error(err);
      setQuotes([]);
      setContacts([]);
      setLoadError(
        err instanceof Error
          ? err.message
          : "Unable to load submissions. Check the database connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, type: string, status: string) => {
    setActionError(null);
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, status }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setActionError(data.error ?? "Unable to update submission status.");
      return;
    }

    await fetchData();
  };

  const newQuotes = quotes.filter((q) => q.status === "NEW").length;
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
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </button>
            <AdminUserMenu />
          </div>
        </div>
      </header>

      <main className="space-y-8 p-6">
        {(loadError || actionError) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Admin submissions are not fully connected.</p>
              <p className="mt-1">{loadError ?? actionError}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            label="New Quote Requests"
            value={newQuotes}
            sub="Awaiting response"
            color="green"
          />
          <StatCard
            icon={Mail}
            label="New Contact Messages"
            value={newContacts}
            sub="Awaiting response"
            color="blue"
          />
          <StatCard icon={Users} label="Total Quotes (30d)" value={quotes.length} color="earth" />
          <StatCard
            icon={TrendingUp}
            label="Total Messages (30d)"
            value={contacts.length}
            color="amber"
          />
        </div>

        {/* Submissions table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
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
                {t === "quotes" && newQuotes > 0 && (
                  <span className="ml-2 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">
                    {newQuotes}
                  </span>
                )}
                {t === "contacts" && newContacts > 0 && (
                  <span className="ml-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                    {newContacts}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading submissions…
              </div>
            ) : loadError ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Fix the database connection or create the submission tables, then refresh this page.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </th>
                    {tab === "quotes" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          City
                        </th>
                      </>
                    )}
                    {tab === "contacts" && (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Subject
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(tab === "quotes" ? quotes : contacts).map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{item.fullName}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${item.email}`} className="text-green-600 hover:underline">
                          {item.email}
                        </a>
                      </td>
                      {tab === "quotes" && (
                        <>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.serviceType?.replace(/_/g, " ")}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.city}</td>
                        </>
                      )}
                      {tab === "contacts" && (
                        <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                          {item.subject}
                        </td>
                      )}
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(item.createdAt, { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {item.status === "NEW" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  tab === "quotes" ? "quote" : "contact",
                                  "READ"
                                )
                              }
                              title="Mark as Read"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {item.status === "READ" && (
                            <button
                              onClick={() =>
                                updateStatus(
                                  item.id,
                                  tab === "quotes" ? "quote" : "contact",
                                  "REPLIED"
                                )
                              }
                              title="Mark as Replied"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              updateStatus(
                                item.id,
                                tab === "quotes" ? "quote" : "contact",
                                "ARCHIVED"
                              )
                            }
                            title="Archive"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
          <h2 className="mb-4 font-semibold text-foreground">Content Management</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Open Sanity Studio", href: "/studio", emoji: "✏️" },
              { label: "Manage Blog Posts", href: "/studio/blogPost", emoji: "📝" },
              { label: "Update Pricing", href: "/studio/pricingTier", emoji: "💰" },
              { label: "Update Services", href: "/studio/service", emoji: "🗂️" },
              { label: "Manage Testimonials", href: "/studio/testimonial", emoji: "⭐" },
            ].map(({ label, href, emoji }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-green-300 hover:text-green-600"
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
