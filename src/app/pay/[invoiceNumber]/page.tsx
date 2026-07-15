import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoicePaymentForm } from "@/components/forms/invoice-payment-form";
import { CreditCard } from "lucide-react";

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

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  const initialInvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.client.name || invoice.client.company || "",
    amount: Math.round(invoice.balanceDue * 100),
    amountFormatted: formatCurrency(invoice.balanceDue),
    description: invoice.terms || "",
    fullInvoice: invoice,
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/40">
        <CreditCard className="h-7 w-7 text-green-600" />
      </div>
      <div className="w-full max-w-4xl">
        <InvoicePaymentForm initialInvoice={initialInvoiceData} />
      </div>
    </div>
  );
}
