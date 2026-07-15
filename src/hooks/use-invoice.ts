"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type {
  InvoiceClient,
  InvoiceMeta,
  InvoiceRow,
  InvoiceTotals,
  ServiceLibraryItem,
} from "@/types/invoice";
import {
  DEFAULT_TAX_RATE,
  defaultClient,
  defaultMeta,
} from "@/lib/invoice-constants";

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

interface UseInvoiceOptions {
  draftId?: string;
}

export function useInvoice(options: UseInvoiceOptions = {}) {
  const { draftId } = options;

  const [client, setClient] = useState<InvoiceClient>(defaultClient);
  const [meta, setMeta] = useState<InvoiceMeta>(defaultMeta);
  const [rows, setRows] = useState<InvoiceRow[]>([createRow()]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId ?? null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || !draftId) return;
    hasLoaded.current = true;

    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/invoices/${draftId}`);
        if (!res.ok) throw new Error("Failed to load invoice");
        const { invoice } = await res.json();
        
        if (invoice) {
          setMeta({
            invoiceNo: invoice.invoiceNumber,
            issueDate: invoice.issueDate || "",
            dueDate: invoice.dueDate || "",
            currency: invoice.currency,
            terms: invoice.terms || "",
            status: invoice.status as any,
            brand: invoice.brand as any,
            deposit: invoice.deposit,
            amountPaid: invoice.amountPaid,
            type: invoice.type as any || "INVOICE",
          });
          
          if (invoice.client) {
            setClient({
              company: invoice.client.company || "",
              name: invoice.client.name || "",
              email: invoice.client.email || "",
              phone: invoice.client.phone || "",
              serviceAddress: invoice.client.serviceAddress || "",
              billingAddress: invoice.client.billingAddress || "",
              city: invoice.client.city || "",
              province: invoice.client.province || "",
              country: invoice.client.country || "",
              zip: invoice.client.zip || "",
              taxNumber: invoice.client.taxNumber || "",
              notes: invoice.client.notes || "",
            });
          }

          if (invoice.items && invoice.items.length > 0) {
            setRows(invoice.items.map((i: any) => ({
              id: i.id,
              service: i.service,
              description: i.description || "",
              qty: i.qty,
              unit: i.unit,
              price: i.price,
              discount: i.discount,
              tax: i.tax,
            })));
          } else {
            setRows([createRow()]);
          }
          
          if (invoice.activities) {
            setActivities(invoice.activities);
          }
          
          setCurrentDraftId(invoice.id);
          setSavedAt(new Date(invoice.updatedAt).toLocaleTimeString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [draftId]);

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

  const formatCurrency = useCallback(
    (n: number) =>
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: meta.currency || "CAD",
      }).format(n || 0),
    [meta.currency]
  );

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

  const saveDraft = useCallback(async () => {
    try {
      const payload = { client, meta, rows, totals };
      let res;
      
      if (currentDraftId) {
        res = await fetch(`/api/admin/invoices/${currentDraftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save invoice");
      
      const { invoice } = await res.json();
      setCurrentDraftId(invoice.id);
      setSavedAt(new Date().toLocaleTimeString());
      
      // Update URL if this was a new draft
      if (!currentDraftId) {
        window.history.replaceState({}, "", `/admin/invoices/create?draft=${invoice.id}`);
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      alert(error.message || "Failed to save invoice to database.");
    }
  }, [client, meta, rows, totals, currentDraftId]);

  const resetInvoice = useCallback(() => {
    if (confirm("Reset form? All unsaved changes will be lost.")) {
      setClient(defaultClient);
      setMeta(defaultMeta);
      setRows([createRow()]);
      setSavedAt(null);
      setCurrentDraftId(null);
      window.history.replaceState({}, "", "/admin/invoices/create");
    }
  }, []);

  return {
    client,
    meta,
    rows,
    totals,
    savedAt,
    currentDraftId,
    isLoading,
    activities,
    updateClient,
    updateMeta,
    updateRow,
    addRow,
    duplicateRow,
    deleteRow,
    addFromLibrary,
    lineTotal,
    formatCurrency,
    saveDraft,
    resetInvoice,
  };
}
