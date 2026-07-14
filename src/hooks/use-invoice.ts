"use client";

// ─── useInvoice Hook ─────────────────────────────────────────────────────────
// Citywide Waste Solutions — manages all invoice state, calculations, and
// localStorage draft persistence for Phase 1.

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type {
  InvoiceClient,
  InvoiceDraft,
  InvoiceMeta,
  InvoiceRow,
  InvoiceTotals,
  ServiceLibraryItem,
} from "@/types/invoice";
import {
  DEFAULT_TAX_RATE,
  DRAFTS_STORAGE_KEY,
  defaultClient,
  defaultMeta,
} from "@/lib/invoice-constants";

// ─── Row ID counter ──────────────────────────────────────────────────────────

let rowCounter = 0;

function createRow(svc?: ServiceLibraryItem): InvoiceRow {
  return {
    id: `row-${Date.now()}-${rowCounter++}`,
    service: svc?.name ?? "",
    description: "",
    qty: 1,
    unit: svc?.unit ?? "unit",
    price: svc?.price ?? 0,
    discount: 0,
    tax: DEFAULT_TAX_RATE,
  };
}

// ─── Draft helpers ───────────────────────────────────────────────────────────

function loadAllDrafts(): InvoiceDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InvoiceDraft[]) : [];
  } catch {
    return [];
  }
}

function saveAllDrafts(drafts: InvoiceDraft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseInvoiceOptions {
  /** Load an existing draft by ID */
  draftId?: string;
}

export function useInvoice(options: UseInvoiceOptions = {}) {
  const { draftId } = options;

  // ─── State ───────────────────────────────────────────────────────

  const [client, setClient] = useState<InvoiceClient>(defaultClient);
  const [meta, setMeta] = useState<InvoiceMeta>(defaultMeta);
  const [rows, setRows] = useState<InvoiceRow[]>([createRow()]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId ?? null);

  // ─── Load draft on mount ─────────────────────────────────────────

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || !draftId) return;
    hasLoaded.current = true;

    const drafts = loadAllDrafts();
    const draft = drafts.find((d) => d.id === draftId);
    if (draft) {
      setClient(draft.client);
      setMeta(draft.meta);
      setRows(draft.rows.length > 0 ? draft.rows : [createRow()]);
      setCurrentDraftId(draft.id);
    }
  }, [draftId]);

  // ─── Line item calculations ──────────────────────────────────────

  const lineTotal = useCallback((r: InvoiceRow): number => {
    const base = r.qty * r.price;
    const afterDiscount = base - (base * r.discount) / 100;
    return afterDiscount + (afterDiscount * r.tax) / 100;
  }, []);

  const totals: InvoiceTotals = useMemo(() => {
    const subtotal = rows.reduce((s, r) => s + r.qty * r.price, 0);
    const discountTotal = rows.reduce(
      (s, r) => s + (r.qty * r.price * r.discount) / 100,
      0
    );
    const taxTotal = rows.reduce((s, r) => {
      const base = r.qty * r.price - (r.qty * r.price * r.discount) / 100;
      return s + (base * r.tax) / 100;
    }, 0);
    const grandTotal = subtotal - discountTotal + taxTotal;
    const balanceDue = grandTotal - meta.deposit - meta.amountPaid;
    return { subtotal, discountTotal, taxTotal, grandTotal, balanceDue };
  }, [rows, meta.deposit, meta.amountPaid]);

  // ─── Currency formatter ──────────────────────────────────────────

  const formatCurrency = useCallback(
    (n: number) =>
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: meta.currency || "CAD",
      }).format(n || 0),
    [meta.currency]
  );

  // ─── Row mutations ──────────────────────────────────────────────

  const updateRow = useCallback(
    (id: string, patch: Partial<InvoiceRow>) =>
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    []
  );

  const addRow = useCallback(() => setRows((rs) => [...rs, createRow()]), []);

  const duplicateRow = useCallback(
    (id: string) =>
      setRows((rs) => {
        const r = rs.find((x) => x.id === id);
        if (!r) return rs;
        return [...rs, { ...r, id: `row-${Date.now()}-${rowCounter++}` }];
      }),
    []
  );

  const deleteRow = useCallback(
    (id: string) =>
      setRows((rs) => {
        const filtered = rs.filter((r) => r.id !== id);
        return filtered.length > 0 ? filtered : [createRow()];
      }),
    []
  );

  const addFromLibrary = useCallback(
    (svc: ServiceLibraryItem) => setRows((rs) => [...rs, createRow(svc)]),
    []
  );

  // ─── Client / Meta helpers ──────────────────────────────────────

  const updateClient = useCallback(
    (patch: Partial<InvoiceClient>) =>
      setClient((c) => ({ ...c, ...patch })),
    []
  );

  const updateMeta = useCallback(
    (patch: Partial<InvoiceMeta>) =>
      setMeta((m) => ({ ...m, ...patch })),
    []
  );

  // ─── Draft persistence ──────────────────────────────────────────

  const saveDraft = useCallback(() => {
    const now = new Date().toISOString();
    const id = currentDraftId || `draft-${Date.now()}`;

    const draft: InvoiceDraft = {
      id,
      client,
      meta,
      rows,
      createdAt: currentDraftId
        ? loadAllDrafts().find((d) => d.id === id)?.createdAt ?? now
        : now,
      updatedAt: now,
    };

    const existing = loadAllDrafts();
    const idx = existing.findIndex((d) => d.id === id);
    if (idx >= 0) {
      existing[idx] = draft;
    } else {
      existing.unshift(draft);
    }
    saveAllDrafts(existing);

    setCurrentDraftId(id);
    setSavedAt(new Date().toLocaleTimeString("en-CA"));

    return id;
  }, [client, meta, rows, currentDraftId]);

  const deleteDraft = useCallback(
    (id: string) => {
      const existing = loadAllDrafts().filter((d) => d.id !== id);
      saveAllDrafts(existing);
    },
    []
  );

  // ─── Autosave every 30s ─────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      // Only autosave if there's meaningful content
      if (client.name || client.company || rows.some((r) => r.service)) {
        saveDraft();
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [saveDraft, client.name, client.company, rows]);

  // ─── Reset ──────────────────────────────────────────────────────

  const resetInvoice = useCallback(() => {
    setClient(defaultClient());
    setMeta(defaultMeta());
    setRows([createRow()]);
    setCurrentDraftId(null);
    setSavedAt(null);
  }, []);

  // ─── Return ─────────────────────────────────────────────────────

  return {
    // State
    client,
    meta,
    rows,
    totals,
    savedAt,
    currentDraftId,

    // Setters
    setClient,
    setMeta,
    updateClient,
    updateMeta,

    // Row operations
    addRow,
    updateRow,
    duplicateRow,
    deleteRow,
    addFromLibrary,

    // Calculations
    lineTotal,
    formatCurrency,

    // Draft operations
    saveDraft,
    deleteDraft,
    resetInvoice,

    // Static helpers
    loadAllDrafts,
  };
}

export { loadAllDrafts };
