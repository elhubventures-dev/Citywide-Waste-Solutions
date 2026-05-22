"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Field components ─────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground",
    "placeholder:text-muted-foreground transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
      : "border-input hover:border-green-300"
  );

// ─── Main Form ────────────────────────────────────────────────────────────────

interface QuoteFormProps {
  defaultService?: string;
  compact?:        boolean;
  className?:      string;
}

export function QuoteForm({ defaultService, compact = false, className }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      serviceType: (defaultService as any) ?? undefined,
      smsOptIn:    false,
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/quote", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  };

  // ── Success state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/20",
          className
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Quote Request Received!</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We'll review your request and respond within <strong>2 business hours</strong>.
            Check your email for a confirmation.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-green-600 hover:underline"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("space-y-5", className)}
    >
      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row 1 — Name + Email */}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div>
          <Label required>Full Name</Label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            className={inputClass(!!errors.fullName)}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label required>Email Address</Label>
          <input
            {...register("email")}
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            className={inputClass(!!errors.email)}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      {/* Row 2 — Phone */}
      <div>
        <Label required>Phone Number</Label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="(905) 555-0100"
          autoComplete="tel"
          className={inputClass(!!errors.phone)}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      {/* Row 3 — Service + City */}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div>
          <Label required>Service Type</Label>
          <div className="relative">
            <select
              {...register("serviceType")}
              className={cn(inputClass(!!errors.serviceType), "appearance-none pr-10 cursor-pointer")}
            >
              <option value="">Select a service…</option>
              <option>Residential Waste Collection</option>
              <option>Commercial Waste Management</option>
              <option>Recycling Services</option>
              <option>Dumpster &amp; Bin Rental</option>
              <option>Junk Removal</option>
              <option>Construction Waste Removal</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <FieldError message={errors.serviceType?.message} />
        </div>

        <div>
          <Label required>Your City</Label>
          <div className="relative">
            <select
              {...register("city")}
              className={cn(inputClass(!!errors.city), "appearance-none pr-10 cursor-pointer")}
            >
              <option value="">Select your city…</option>
              <option>Vaughan</option>
              <option>Toronto</option>
              <option>Brampton</option>
              <option>Mississauga</option>
              <option>Courtice</option>
              <option>Other</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <FieldError message={errors.city?.message} />
        </div>
      </div>

      {/* Row 4 — Frequency (optional) */}
      {!compact && (
        <div>
          <Label>Pickup Frequency <span className="text-muted-foreground text-xs">(optional)</span></Label>
          <div className="relative">
            <select
              {...register("pickupFrequency")}
              className={cn(inputClass(), "appearance-none pr-10 cursor-pointer")}
            >
              <option value="">Select frequency…</option>
              <option>Weekly</option>
              <option>Bi-Weekly</option>
              <option>Monthly</option>
              <option>One-Time</option>
              <option>Custom</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Row 5 — Message */}
      <div>
        <Label>Additional Details <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <textarea
          {...register("message")}
          rows={compact ? 3 : 4}
          placeholder="Describe your waste removal needs, property size, access considerations, or anything else we should know…"
          className={cn(inputClass(!!errors.message), "resize-none")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      {/* SMS opt-in */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          {...register("smsOptIn")}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-input accent-green-600"
        />
        <span className="text-sm text-muted-foreground leading-snug">
          Send me SMS updates about my pickup schedule and service confirmations.{" "}
          <span className="text-xs">(Message &amp; data rates may apply.)</span>
        </span>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
        leftIcon={!isSubmitting ? <Send className="h-4 w-4" /> : undefined}
      >
        {isSubmitting ? "Sending Request…" : "Submit Quote Request"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        No commitment required. We respond within 2 business hours. 🌱
      </p>
    </form>
  );
}
