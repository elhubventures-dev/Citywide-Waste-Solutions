"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Search, CreditCard, CheckCircle2, AlertCircle, Loader2, Lock,
} from "lucide-react";
import { invoicePaymentSchema, type InvoicePaymentValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Stripe loader ────────────────────────────────────────────────────────────
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ─── Invoice data shape returned by API ──────────────────────────────────────
interface InvoiceData {
  invoiceNumber:  string;
  customerName:   string;
  amount:         number;
  amountFormatted: string;
  description?:  string;
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
      const res  = await fetch("/api/stripe/create-payment-intent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
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

  const inputCls = (err?: boolean) => cn(
    "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground",
    "placeholder:text-muted-foreground transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
    err ? "border-red-300" : "border-input hover:border-green-300"
  );

  return (
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
        <label className="label-base">Invoice Number <span className="text-red-500">*</span></label>
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
        <label className="label-base">Email on Invoice <span className="text-red-500">*</span></label>
        <input
          {...register("email")}
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          className={inputCls(!!errors.email)}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
        )}
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
  );
}

// ─── Step 2: Stripe checkout form ─────────────────────────────────────────────
function CheckoutForm({
  invoice,
  onSuccess,
}: {
  invoice: InvoiceData;
  onSuccess: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pay/success?invoice=${invoice.invoiceNumber}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setLoading(false);
    }
    // On success, Stripe redirects to return_url
  };

  return (
    <div className="space-y-5">
      {/* Invoice summary */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-green-700">Invoice</p>
            <p className="text-lg font-bold text-foreground">#{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
            {invoice.description && (
              <p className="mt-1 text-xs text-muted-foreground">{invoice.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-green-700">Amount Due</p>
            <p className="text-2xl font-bold text-green-600">{invoice.amountFormatted}</p>
            <p className="text-xs text-muted-foreground">CAD</p>
          </div>
        </div>
      </div>

      {/* Stripe payment element */}
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card", "apple_pay", "google_pay"],
        }}
      />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handlePay}
        disabled={!stripe || loading}
        loading={loading}
        leftIcon={!loading ? <CreditCard className="h-4 w-4" /> : undefined}
      >
        {loading ? "Processing Payment…" : `Pay ${invoice.amountFormatted} CAD`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Secured by Stripe · SSL encrypted · PCI compliant
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
          Invoice <strong>#{invoiceNumber}</strong> has been paid. A receipt has been sent to your email.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export function InvoicePaymentForm() {
  const [step,         setStep]         = useState<"lookup" | "checkout" | "done">("lookup");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [invoice,      setInvoice]      = useState<InvoiceData | null>(null);

  const handleFound = (secret: string, inv: InvoiceData) => {
    setClientSecret(secret);
    setInvoice(inv);
    setStep("checkout");
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {(["lookup", "checkout", "done"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                step === s || (s === "done" && step === "done")
                  ? "bg-green-500 text-white"
                  : i < ["lookup", "checkout", "done"].indexOf(step)
                  ? "bg-green-200 text-green-700"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "lookup" && (
          <motion.div key="lookup" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
            <InvoiceLookupForm onFound={handleFound} />
          </motion.div>
        )}

        {step === "checkout" && clientSecret && invoice && (
          <motion.div key="checkout" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2E9B4A",
                    colorBackground: "#ffffff",
                    borderRadius: "8px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  },
                },
              }}
            >
              <CheckoutForm invoice={invoice} onSuccess={() => setStep("done")} />
            </Elements>
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
