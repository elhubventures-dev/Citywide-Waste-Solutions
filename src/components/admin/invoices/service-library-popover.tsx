"use client";

// ─── ServiceLibraryPopover ───────────────────────────────────────────────────
// Dropdown with searchable service library. Click a service to add it as a row.

import { useState, useRef, useEffect } from "react";
import { Search, X, Truck, Recycle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICE_LIBRARY } from "@/lib/invoice-constants";
import type { ServiceLibraryItem } from "@/types/invoice";

interface ServiceLibraryPopoverProps {
  open: boolean;
  onClose: () => void;
  onSelect: (svc: ServiceLibraryItem) => void;
  formatCurrency: (n: number) => string;
}

export function ServiceLibraryPopover({
  open,
  onClose,
  onSelect,
  formatCurrency,
}: ServiceLibraryPopoverProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "waste" | "moving">("all");
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = SERVICE_LIBRARY.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Service Library
        </span>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            autoFocus
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-gray-100 px-3 py-1.5 dark:border-gray-800">
        {(["all", "waste", "moving"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              activeCategory === cat
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            {cat === "waste" && <Recycle size={12} />}
            {cat === "moving" && <Truck size={12} />}
            {cat === "all" ? "All" : cat === "waste" ? "Waste" : "Moving"}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="max-h-60 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">No services found</div>
        ) : (
          filtered.map((s) => (
            <button
              key={s.name}
              onClick={() => {
                onSelect(s);
                onClose();
              }}
              className="flex w-full items-center justify-between border-b border-gray-50 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {s.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(s.price)} / {s.unit}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                  s.category === "waste"
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                )}
              >
                {s.category}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
