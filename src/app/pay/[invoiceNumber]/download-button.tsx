"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InvoicePdfTemplate } from "@/components/admin/invoices/pdf/invoice-pdf-template";
import type { Invoice, Client, InvoiceItem } from "@prisma/client";
import type { InvoiceDraft } from "@/types/invoice";

interface DownloadPdfButtonProps {
  invoice: Invoice;
  client: Client;
  items: InvoiceItem[];
}

export function DownloadPdfButton({ invoice, client, items }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Reconstruct the InvoiceDraft format expected by the PDF template
      const draft: InvoiceDraft = {
        id: invoice.id,
        client: {
          company: client.company || "",
          name: client.name || "",
          phone: client.phone || "",
          email: client.email || "",
          serviceAddress: client.serviceAddress || "",
          billingAddress: client.billingAddress || "",
          city: client.city || "",
          province: client.province || "",
          country: client.country || "",
          zip: client.zip || "",
          taxNumber: client.taxNumber || "",
          notes: client.notes || "",
        },
        meta: {
          invoiceNo: invoice.invoiceNumber,
          issueDate: invoice.issueDate || "",
          dueDate: invoice.dueDate || "",
          currency: invoice.currency,
          terms: invoice.terms || "",
          status: invoice.status as any,
          brand: invoice.brand as "waste" | "moving",
          deposit: invoice.deposit || 0,
          amountPaid: invoice.amountPaid || 0,
          type: invoice.type as "INVOICE" | "QUOTE",
        },
        rows: items.map(item => ({
          id: item.id,
          service: item.service,
          description: item.description || "",
          qty: item.qty,
          unit: item.unit,
          price: item.price,
          discount: item.discount,
          tax: item.tax,
        })),
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
      };

      const formatCurrency = (n: number) =>
        new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

      const blob = await pdf(<InvoicePdfTemplate draft={draft} formatCurrency={formatCurrency} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
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
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download size={18} />
          Download PDF
        </>
      )}
    </button>
  );
}
