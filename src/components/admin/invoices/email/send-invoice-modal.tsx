"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InvoicePdfTemplate } from "../pdf/invoice-pdf-template";
import type { InvoiceDraft } from "@/types/invoice";
import { COMPANY_INFO } from "@/lib/invoice-constants";

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: InvoiceDraft;
  formatCurrency: (n: number) => string;
}

export function SendInvoiceModal({
  isOpen,
  onClose,
  draft,
  formatCurrency,
}: SendInvoiceModalProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen && status === "idle") {
      handleSend();
    }
  }, [isOpen, status]);

  // Reset status when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStatus("idle"), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const to = draft.client.email;
    
    if (!to) {
      setStatus("error");
      setErrorMsg("Client email is missing. Please add an email to the client first.");
      return;
    }
    
    setStatus("sending");
    setErrorMsg("");

    try {
      const subject = `Invoice #${draft.meta.invoiceNo} from Citywide Waste Solutions`;
      const message = `Hi ${draft.client.name || draft.client.company},\n\nPlease find attached invoice #${draft.meta.invoiceNo}.\n\nThank you for your business!`;
      const bcc = COMPANY_INFO.email;

      // 1. Generate the PDF Blob client-side
      const blob = await pdf(<InvoicePdfTemplate draft={draft} formatCurrency={formatCurrency} />).toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      
      // 2. Convert to Base64
      const base64String = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // 3. Send to API
      const res = await fetch(`/api/admin/invoices/${draft.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          cc: "",
          bcc,
          subject,
          message,
          pdfBase64: base64String,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred while sending.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={status === "sending" ? undefined : onClose}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm dark:bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900"
            >
              {status === "sending" && (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sending Email...</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Sending to {draft.client.email} and admin.
                  </p>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Successfully Sent!</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    The invoice has been sent to the client and admin.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                  >
                    Done
                  </button>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Failed to Send</h3>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMsg}
                  </p>
                  <div className="mt-6 flex w-full gap-3">
                    <button
                      onClick={onClose}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
