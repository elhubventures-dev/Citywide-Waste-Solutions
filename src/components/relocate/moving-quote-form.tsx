"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Home,
  Phone,
} from "lucide-react";
import { movingQuoteFormSchema, type MovingQuoteFormValues } from "@/lib/validations";
import { MOVING_PHONE_CTA } from "@/lib/moving/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <label className="mb-1.5 block text-sm font-medium text-foreground">
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

const SERVICE_OPTIONS = [
  "Residential Move",
  "Commercial / Office Move",
  "Long-Distance Move",
  "Packing & Unpacking",
  "Loading & Unloading Only",
  "Furniture Assembly",
  "Full-Service Move",
] as const;

const HOME_SIZES = [
  "Studio / 1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "4+ Bedroom",
  "Office / Commercial",
  "Other",
] as const;

interface MovingQuoteFormProps {
  defaultService?: string;
  compact?: boolean;
  className?: string;
}

export function MovingQuoteForm({
  defaultService,
  compact = false,
  className,
}: MovingQuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovingQuoteFormValues>({
    resolver: zodResolver(movingQuoteFormSchema),
    defaultValues: {
      serviceType: (defaultService as MovingQuoteFormValues["serviceType"]) ?? undefined,
      smsOptIn: false,
      moveDate: "",
    },
  });

  const onSubmit = async (data: MovingQuoteFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/moving/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.message ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please call us directly.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950/30",
          className
        )}
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3 className="mb-2 text-xl font-bold text-foreground">Quote Request Received!</h3>
        <p className="mb-6 text-muted-foreground">
          Thank you! Our moving team will contact you within 2 business hours with your personalized
          quote.
        </p>
        <Button asChild variant="outline">
          <a href={MOVING_PHONE_CTA.href}>
            <Phone className="h-4 w-4" />
            Call {MOVING_PHONE_CTA.display} Now
          </a>
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8",
        className
      )}
      noValidate
    >
      {!compact && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">Request Your Free Moving Quote</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details below and we&apos;ll send a clear estimate — no obligation.
          </p>
        </div>
      )}

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("grid gap-5", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
        <div className={compact ? "" : "sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-5"}>
          <div>
            <Label required>Full Name</Label>
            <input
              {...register("fullName")}
              className={inputClass(!!errors.fullName)}
              placeholder="John Smith"
              autoComplete="name"
            />
            <FieldError message={errors.fullName?.message} />
          </div>
          {!compact && <div className="mt-5 sm:mt-0" />}
        </div>

        <div>
          <Label required>Email</Label>
          <input
            {...register("email")}
            type="email"
            className={inputClass(!!errors.email)}
            placeholder="you@email.com"
            autoComplete="email"
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label required>Phone</Label>
          <input
            {...register("phone")}
            type="tel"
            className={inputClass(!!errors.phone)}
            placeholder="437-555-0100"
            autoComplete="tel"
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label required>Moving Service</Label>
          <select {...register("serviceType")} className={inputClass(!!errors.serviceType)}>
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError message={errors.serviceType?.message} />
        </div>

        <div>
          <Label required>Preferred Move Date</Label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              {...register("moveDate")}
              type="date"
              className={cn(inputClass(!!errors.moveDate), "pl-10")}
            />
          </div>
          <FieldError message={errors.moveDate?.message} />
        </div>

        <div>
          <Label required>Moving From</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              {...register("fromCity")}
              className={cn(inputClass(!!errors.fromCity), "pl-10")}
              placeholder="e.g. Toronto, ON"
            />
          </div>
          <FieldError message={errors.fromCity?.message} />
        </div>

        <div>
          <Label required>Moving To</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              {...register("toCity")}
              className={cn(inputClass(!!errors.toCity), "pl-10")}
              placeholder="e.g. Vaughan, ON"
            />
          </div>
          <FieldError message={errors.toCity?.message} />
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <Label required>Property Size</Label>
          <div className="relative">
            <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              {...register("homeSize")}
              className={cn(inputClass(!!errors.homeSize), "pl-10")}
            >
              <option value="">Select size…</option>
              {HOME_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <FieldError message={errors.homeSize?.message} />
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <Label>Additional Details</Label>
          <textarea
            {...register("message")}
            rows={compact ? 3 : 4}
            className={inputClass(!!errors.message)}
            placeholder="Stairs, elevator, parking, specialty items, preferred time…"
          />
          <FieldError message={errors.message?.message} />
        </div>

        <div className={cn("flex items-start gap-3", compact ? "" : "sm:col-span-2")}>
          <input
            {...register("smsOptIn")}
            type="checkbox"
            id="moving-sms-opt-in"
            className="mt-1 h-4 w-4 rounded border-input text-green-600 focus:ring-green-500"
          />
          <label htmlFor="moving-sms-opt-in" className="text-sm text-muted-foreground">
            Send me SMS updates about my moving quote and appointment reminders.
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="sm:flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Get My Free Quote
            </>
          )}
        </Button>
        <Button asChild variant="outline" size="lg" type="button">
          <a href={MOVING_PHONE_CTA.href}>
            <Phone className="h-4 w-4" />
            Or Call Now
          </a>
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        No spam. No commitment. Same-day service may be available — call to confirm.
      </p>
    </form>
  );
}

/** Quick booking CTA card for sidebar / inline use */
export function MovingBookingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-hero-gradient p-6 text-white shadow-green sm:p-8",
        className
      )}
    >
      <h3 className="text-xl font-bold">Book Your Move Today</h3>
      <p className="mt-2 text-sm text-white/80">
        Speak with our team directly for fastest scheduling and same-day availability.
      </p>
      <div className="mt-6 space-y-3">
        <Button asChild size="lg" className="w-full bg-white text-green-700 hover:bg-green-50">
          <a href={MOVING_PHONE_CTA.href}>
            <Phone className="h-5 w-5" />
            {MOVING_PHONE_CTA.display}
          </a>
        </Button>
        <p className="text-center text-xs text-white/60">
          Mon–Fri 7 AM – 6 PM · Sat 8 AM – 2 PM
        </p>
      </div>
    </div>
  );
}
