"use client";

import { toast as toastFn } from "@/components/ui/toaster";

interface ToastOptions {
  title?:       string;
  description?: string;
  variant?:     "default" | "success" | "error";
  duration?:    number;
}

export function useToast() {
  return {
    toast: (options: ToastOptions) => toastFn(options),
    success: (title: string, description?: string) =>
      toastFn({ title, description, variant: "success" }),
    error: (title: string, description?: string) =>
      toastFn({ title, description, variant: "error" }),
  };
}
