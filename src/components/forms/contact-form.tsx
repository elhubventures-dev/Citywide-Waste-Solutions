"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
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

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground",
    "placeholder:text-muted-foreground transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasError ? "border-red-300 focus:ring-red-400/20" : "border-input hover:border-green-300"
  );

const SUBJECTS = [
  "General Enquiry",
  "Request a Quote",
  "Schedule a Pickup",
  "Billing / Invoice",
  "Service Complaint",
  "Partnership Enquiry",
  "Other",
];

export function ContactForm({ className }: { className?: string }) {
  const [submitted,  setSubmitted]  = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null);
    try {
      const res  = await fetch("/api/contact", {
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
          <h3 className="text-lg font-bold text-foreground">Message Sent!</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Thanks for reaching out. We'll respond within <strong>2 business hours</strong>.
          </p>
        </div>
        <button onClick={() => setSubmitted(false)} className="text-xs text-green-600 hover:underline">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("space-y-5", className)}>
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-base">Full Name <span className="text-red-500">*</span></label>
          <input {...register("fullName")} type="text" placeholder="Jane Smith"
            autoComplete="name" className={inputClass(!!errors.fullName)} />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <label className="label-base">Email Address <span className="text-red-500">*</span></label>
          <input {...register("email")} type="email" placeholder="jane@example.com"
            autoComplete="email" className={inputClass(!!errors.email)} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-base">Phone <span className="text-muted-foreground text-xs">(optional)</span></label>
          <input {...register("phone")} type="tel" placeholder="(905) 555-0100"
            autoComplete="tel" className={inputClass(!!errors.phone)} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <label className="label-base">Subject <span className="text-red-500">*</span></label>
          <div className="relative">
            <select {...register("subject")}
              className={cn(inputClass(!!errors.subject), "appearance-none pr-10 cursor-pointer")}>
              <option value="">Select a subject…</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <FieldError message={errors.subject?.message} />
        </div>
      </div>

      <div>
        <label className="label-base">Message <span className="text-red-500">*</span></label>
        <textarea {...register("message")} rows={5}
          placeholder="How can we help you today?"
          className={cn(inputClass(!!errors.message), "resize-none")} />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting}
        className="w-full" leftIcon={!isSubmitting ? <Send className="h-4 w-4" /> : undefined}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
