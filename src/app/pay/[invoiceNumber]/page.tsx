import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DownloadPdfButton } from "./download-button";

export const dynamic = "force-dynamic";

export default async function PayInvoicePage({ params }: { params: { invoiceNumber: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber: params.invoiceNumber.toUpperCase() },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice || !invoice.client) {
    notFound();
  }

  // Log "VIEWED" activity if not viewed recently
  const lastViewedActivity = await prisma.invoiceActivity.findFirst({
    where: { invoiceId: invoice.id, action: "VIEWED" },
    orderBy: { createdAt: "desc" },
  });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  if (!lastViewedActivity || lastViewedActivity.createdAt < oneHourAgo) {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: (invoice.status === "Sent" || invoice.status === "Pending") ? "Viewed" : invoice.status,
        activities: {
          create: { action: "VIEWED", notes: "Client viewed the invoice online" }
        }
      }
    });
  }

  // Calculate totals
  const subtotal = invoice.items.reduce((s, r) => s + r.qty * r.price, 0);
  const discountTotal = invoice.items.reduce((s, r) => s + (r.qty * r.price * r.discount) / 100, 0);
  const taxTotal = invoice.items.reduce((s, r) => {
    const base = r.qty * r.price - (r.qty * r.price * r.discount) / 100;
    return s + (base * r.tax) / 100;
  }, 0);
  const grandTotal = subtotal - discountTotal + taxTotal;
  
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
          
          {/* Header */}
          <div className="bg-[#1E3A5C] px-8 py-10 text-center text-white">
            <h1 className="text-2xl font-bold tracking-tight">{invoice.type === "QUOTE" ? "Quote" : "Invoice"} #{invoice.invoiceNumber}</h1>
            <p className="mt-2 text-blue-100">
              {invoice.brand === "moving" ? "Citywide Moving Solutions" : "Citywide Waste Solutions"}
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Billed To</p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                  {invoice.client.name || invoice.client.company}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Due</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(invoice.balanceDue)}
                </p>
              </div>
            </div>

            {/* Payment Instructions */}
            {invoice.type !== "QUOTE" && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
                <h2 className="font-semibold text-[#1E3A5C] dark:text-blue-400">Payment Instructions</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Please send your payment via <strong>Interac e-Transfer</strong> to:
                </p>
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
                  <code className="text-sm font-bold text-gray-900 dark:text-white">
                    payments@citywidewastesolutions.com
                  </code>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  * Please ensure you include <strong>Invoice #{invoice.invoiceNumber}</strong> in the e-Transfer message so we can properly apply your payment.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <DownloadPdfButton 
                invoice={invoice} 
                client={invoice.client} 
                items={invoice.items} 
              />
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {invoice.brand === "moving" ? "Citywide Moving Solutions" : "Citywide Waste Solutions"}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
