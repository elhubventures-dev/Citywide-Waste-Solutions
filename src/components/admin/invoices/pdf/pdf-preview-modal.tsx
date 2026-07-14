"use client";

import { X, Download, Loader2 } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdfTemplate } from "./invoice-pdf-template";
import type { InvoiceDraft } from "@/types/invoice";
import { useEffect, useState } from "react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: InvoiceDraft;
  formatCurrency: (n: number) => string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  draft,
  formatCurrency,
}: PdfPreviewModalProps) {
  // Prevent hydration mismatch by only rendering the PDF viewer on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Lock body scroll when open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const fileName = `Invoice_${draft.meta.invoiceNo}_${draft.client.company || draft.client.name || "Client"}.pdf`.replace(/\s+/g, "_");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Preview PDF
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {draft.meta.invoiceNo} — {draft.client.company || draft.client.name || "Client"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isClient && (
              <PDFDownloadLink
                document={
                  <InvoicePdfTemplate draft={draft} formatCurrency={formatCurrency} />
                }
                fileName={fileName}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-blue transition-colors hover:bg-blue-600"
              >
                {({ loading }) => (
                  <>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {loading ? "Generating..." : "Download PDF"}
                  </>
                )}
              </PDFDownloadLink>
            )}
            
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950">
          {isClient ? (
            <PDFViewer width="100%" height="100%" className="border-none">
              <InvoicePdfTemplate draft={draft} formatCurrency={formatCurrency} />
            </PDFViewer>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
