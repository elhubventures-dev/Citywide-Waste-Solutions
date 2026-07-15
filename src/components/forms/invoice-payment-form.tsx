"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CreditCard, CheckCircle2, AlertCircle, Loader2, Lock, FileText, User, Wallet, Mail, Download, ShieldCheck, Copy, Check } from "lucide-react";
import { invoicePaymentSchema, type InvoicePaymentValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { pdf } from "@react-pdf/renderer";
import { InvoicePdfTemplate } from "@/components/admin/invoices/pdf/invoice-pdf-template";
import type { InvoiceDraft } from "@/types/invoice";

// ─── Invoice data shape returned by API ──────────────────────────────────────
interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  amount: number;
  amountFormatted: string;
  description?: string;
  fullInvoice?: any;
}

// ─── Step 1: Lookup form ──────────────────────────────────────────────────────
function InvoiceLookupForm({
  onFound,
}: {
  onFound: (clientSecret: string, invoice: InvoiceData) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoicePaymentValues>({ resolver: zodResolver(invoicePaymentSchema) });

  const onSubmit = async (data: InvoicePaymentValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.message ?? "Invoice not found. Please check your details.");
        return;
      }

      onFound(json.clientSecret, json.invoice);
    } catch {
      setServerError("Network error. Please try again.");
    }
  };

  const inputCls = (err?: boolean) =>
    cn(
      "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground",
      "placeholder:text-muted-foreground transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
      err ? "border-red-300" : "border-input hover:border-green-300"
    );

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="label-base">
          Invoice Number <span className="text-red-500">*</span>
        </label>
        <input
          {...register("invoiceNumber")}
          type="text"
          placeholder="e.g. WQ-2024-0042"
          className={inputCls(!!errors.invoiceNumber)}
          style={{ textTransform: "uppercase" }}
        />
        {errors.invoiceNumber && (
          <p className="mt-1.5 text-xs text-red-500">{errors.invoiceNumber.message}</p>
        )}
      </div>

      <div>
        <label className="label-base">
          Email on Invoice <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          className={inputCls(!!errors.email)}
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
        leftIcon={!isSubmitting ? <Search className="h-4 w-4" /> : undefined}
      >
        {isSubmitting ? "Looking up invoice…" : "Find My Invoice"}
      </Button>
    </form>
    </div>
  );
}

// ─── Step 2: Interac e-Transfer Instructions ────────────────────────────────────
function CheckoutForm({ invoice, onSuccess }: { invoice: InvoiceData; onSuccess: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BUSINESS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!invoice.fullInvoice) {
      alert("Full invoice data not available for PDF generation. Please try reloading.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const full = invoice.fullInvoice;
      const draft: InvoiceDraft = {
        id: full.id,
        client: {
          company: full.client.company || "",
          name: full.client.name || "",
          phone: full.client.phone || "",
          email: full.client.email || "",
          serviceAddress: full.client.serviceAddress || "",
          billingAddress: full.client.billingAddress || "",
          city: full.client.city || "",
          province: full.client.province || "",
          country: full.client.country || "",
          zip: full.client.zip || "",
          taxNumber: full.client.taxNumber || "",
          notes: full.client.notes || "",
        },
        meta: {
          invoiceNo: full.invoiceNumber,
          issueDate: full.issueDate || "",
          dueDate: full.dueDate || "",
          currency: full.currency,
          terms: full.terms || "",
          status: full.status as any,
          brand: full.brand as "waste" | "moving",
          deposit: full.deposit || 0,
          amountPaid: full.amountPaid || 0,
          type: full.type as "INVOICE" | "QUOTE",
        },
        rows: full.items.map((item: any) => ({
          id: item.id,
          service: item.service,
          description: item.description || "",
          qty: item.qty,
          unit: item.unit,
          price: item.price,
          discount: item.discount,
          tax: item.tax,
        })),
        createdAt: full.createdAt,
        updatedAt: full.updatedAt,
      };

      const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

      const blob = await pdf(<InvoicePdfTemplate draft={draft} formatCurrency={formatCurrency} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${full.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-border">
      {/* Top Header */}
      <div className="relative overflow-hidden bg-brand-navy p-6 sm:p-8 md:p-10">
        {/* Decorative Green Swoop background */}
        <div className="absolute -right-20 -top-20 h-64 w-96 rotate-12 rounded-[100%] bg-brand-green opacity-20" />
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand-green/30 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="inline-flex items-center justify-center bg-white p-2.5 rounded-xl shadow-md border border-white/10 shrink-0">
            <Logo variant="footer" size="lg" className="h-8 w-auto sm:h-10" />
          </div>
          
          <div className="text-left sm:text-right">
            <div className="mb-2 flex items-center justify-start gap-2 text-brand-green sm:justify-end">
               <FileText className="h-6 w-6" />
               <span className="text-3xl font-bold tracking-tight text-white">INVOICE</span>
            </div>
            <div className="inline-block rounded-md bg-brand-green px-3 py-1 text-sm font-bold text-white">
              #{invoice.invoiceNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Content */}
      <div className="space-y-8 p-5 sm:p-8 md:p-10">
        
        {/* Billed To / Amount Due */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-border/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-brand-green">
              <User className="h-6 w-6 fill-brand-green" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Billed To</p>
              <p className="text-base font-bold text-foreground truncate">{invoice.customerName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-border/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-brand-green">
              <Wallet className="h-6 w-6 fill-brand-green" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Amount Due</p>
              <p className="text-2xl font-bold tracking-tight text-brand-green">{invoice.amountFormatted}</p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border/60" />

        {/* Payment Instructions Box */}
        <div className="rounded-xl border border-border/60 bg-gray-50/50 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-navy">PAYMENT INSTRUCTIONS</h3>
              <div className="mt-1 h-1 w-12 rounded-full bg-brand-green" />
            </div>
          </div>
          
          <p className="mb-4 text-sm text-foreground">
            Please send your payment via <strong className="text-brand-green">Interac e-Transfer</strong> to:
          </p>
          
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-white px-4 py-3 shadow-sm hover:border-brand-green/30 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                <Mail className="h-4 w-4 fill-white" />
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base truncate">{BUSINESS.email}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-8 px-3 shrink-0 items-center gap-1.5 rounded-lg bg-green-50 text-xs font-semibold text-brand-green hover:bg-green-100 transition-colors"
              type="button"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs leading-relaxed text-muted-foreground">
            * Please ensure you include <strong className="text-brand-green">Invoice #{invoice.invoiceNumber}</strong> in the e-Transfer message so we can properly apply your payment.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button 
            variant="outline" 
            className="h-14 flex-1 border-brand-green text-base font-bold text-brand-green hover:bg-green-50 hover:text-brand-green disabled:opacity-50" 
            onClick={handleDownload}
            disabled={isGenerating}
          >
             {isGenerating ? (
               <>
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 GENERATING...
               </>
             ) : (
               <>
                 <Download className="mr-2 h-5 w-5" />
                 DOWNLOAD PDF
               </>
             )}
          </Button>
          <Button 
            className="h-14 flex-1 bg-brand-green text-base font-bold text-white hover:bg-brand-green/90" 
            onClick={onSuccess}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            MARK AS PAID
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-center gap-2 bg-brand-navy px-8 py-6 text-center text-xs text-slate-300 sm:flex-row sm:px-10">
        <ShieldCheck className="h-4 w-4 text-brand-green" />
        <p className="text-slate-300">
          © 2026 Citywide Waste Solutions. 
          <span className="mx-3 hidden sm:inline text-white/20">|</span>
          <br className="sm:hidden" />
          <span className="mt-1 inline-block sm:mt-0">All rights reserved.</span>
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────
function PaymentSuccess({ invoiceNumber }: { invoiceNumber: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-8 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! We will process your payment and send a receipt once the e-Transfer is received.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export function InvoicePaymentForm({
  initialInvoice,
  initialStep = "lookup"
}: {
  initialInvoice?: InvoiceData;
  initialStep?: "lookup" | "checkout" | "done";
} = {}) {
  const [step, setStep] = useState<"lookup" | "checkout" | "done">(initialInvoice ? "checkout" : initialStep);
  const [clientSecret, setClientSecret] = useState<string>("direct-link");
  const [invoice, setInvoice] = useState<InvoiceData | null>(initialInvoice || null);

  const handleFound = (secret: string, inv: InvoiceData) => {
    setClientSecret(secret);
    setInvoice(inv);
    setStep("checkout");
  };

  const handleSuccess = async () => {
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (invoice) {
      try {
        await fetch("/api/stripe/mark-paid-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber: invoice.invoiceNumber,
            customerName: invoice.customerName,
            amount: invoice.amount,
          }),
        });
      } catch (e) {
        console.error("Failed to send notification", e);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Step indicator (only show for lookup) */}
      {step === "lookup" && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {(["lookup", "checkout", "done"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  step === s ? "bg-brand-green text-white shadow-md" : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="h-0.5 w-8 bg-border" />}
            </div>
          ))}
        </div>
      )}

      {/* Render current step */}
      <AnimatePresence mode="wait">
        {step === "lookup" && (
          <motion.div
            key="lookup"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="mx-auto max-w-md"
          >
            <InvoiceLookupForm onFound={handleFound} />
          </motion.div>
        )}

        {step === "checkout" && clientSecret && invoice && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckoutForm invoice={invoice} onSuccess={handleSuccess} />
          </motion.div>
        )}

        {step === "done" && invoice && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PaymentSuccess invoiceNumber={invoice.invoiceNumber} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
