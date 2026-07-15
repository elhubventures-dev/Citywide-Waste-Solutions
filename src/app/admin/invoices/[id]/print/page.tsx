import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COMPANY_INFO } from "@/lib/invoice-constants";
import { AutoPrint } from "./auto-print";
import { PrintButton } from "./print-button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PrintInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      items: true,
    },
  });

  if (!invoice || !invoice.client) {
    notFound();
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

  const brandName = invoice.brand === "moving" ? COMPANY_INFO.sisterBrand : COMPANY_INFO.name;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white dark:bg-gray-950 dark:print:bg-white">
      {/* Non-printable action bar */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Link 
          href={`/admin/invoices/create?draft=${invoice.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft size={16} />
          Back to Invoice
        </Link>
        <PrintButton />
      </div>

      {/* Printable Area (A4 / Letter layout) */}
      <div className="mx-auto my-8 max-w-4xl bg-white p-10 shadow-lg print:m-0 print:max-w-none print:shadow-none sm:p-16 dark:bg-white dark:text-black print:dark:bg-white">
        <AutoPrint />
        
        {/* Header */}
        <div className="flex justify-between border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1E3A5C]">{brandName}</h1>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>{COMPANY_INFO.address}</p>
              <p>Phone: {COMPANY_INFO.phone}</p>
              <p>Email: {COMPANY_INFO.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light tracking-wide text-gray-300">INVOICE</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <span className="font-semibold text-gray-700">Invoice #:</span>
              <span className="font-bold text-gray-900">{invoice.invoiceNumber}</span>
              
              <span className="font-semibold text-gray-700">Issue Date:</span>
              <span className="text-gray-900">{invoice.issueDate || "—"}</span>
              
              <span className="font-semibold text-gray-700">Due Date:</span>
              <span className="text-gray-900">{invoice.dueDate || "—"}</span>
              
              <span className="font-semibold text-gray-700">Status:</span>
              <span className="text-gray-900 font-medium">{invoice.status}</span>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mt-8 flex justify-between gap-12">
          <div className="flex-1">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1E3A5C]">Billed To</h3>
            <p className="font-bold text-gray-900">{invoice.client.name || invoice.client.company || "Client"}</p>
            {invoice.client.company && invoice.client.name && <p className="text-gray-600">{invoice.client.company}</p>}
            {invoice.client.billingAddress && (
              <p className="mt-1 text-gray-600">
                {invoice.client.billingAddress}, {invoice.client.city} {invoice.client.province} {invoice.client.zip}
              </p>
            )}
            {invoice.client.email && <p className="mt-1 text-gray-600">{invoice.client.email}</p>}
            {invoice.client.phone && <p className="text-gray-600">{invoice.client.phone}</p>}
            {invoice.client.taxNumber && <p className="mt-1 text-xs text-gray-500">Tax #: {invoice.client.taxNumber}</p>}
          </div>

          {invoice.client.serviceAddress && (
            <div className="flex-1">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1E3A5C]">Service Address</h3>
              <p className="text-gray-600">{invoice.client.serviceAddress}</p>
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="mt-12">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-[#1E3A5C] text-[#1E3A5C]">
              <tr>
                <th className="py-3 font-bold">Description</th>
                <th className="py-3 text-center font-bold">Qty</th>
                <th className="py-3 text-right font-bold">Price</th>
                <th className="py-3 text-center font-bold">Tax %</th>
                <th className="py-3 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((row) => {
                const base = row.qty * row.price;
                const afterDisc = base - (base * row.discount) / 100;
                const lineTot = afterDisc + (afterDisc * row.tax) / 100;

                return (
                  <tr key={row.id}>
                    <td className="py-4 text-gray-900">{row.service || "—"}</td>
                    <td className="py-4 text-center text-gray-600">
                      {row.qty} {row.unit}
                    </td>
                    <td className="py-4 text-right text-gray-600">{formatCurrency(row.price)}</td>
                    <td className="py-4 text-center text-gray-600">{row.tax}%</td>
                    <td className="py-4 text-right text-gray-900 font-medium">{formatCurrency(lineTot)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Payment Instructions */}
        <div className="mt-12 flex items-start justify-between">
          <div className="w-64 rounded-lg bg-gray-50 p-4 text-sm border border-gray-100 print:border-none print:bg-transparent print:p-0">
            <h3 className="font-bold text-[#1E3A5C]">Payment Instructions</h3>
            <p className="mt-2 text-gray-600">Please send payments via Interac e-Transfer to:</p>
            <p className="mt-1 font-bold text-gray-900">payments@citywidewastesolutions.com</p>
            <p className="mt-3 text-xs text-gray-500">Include Invoice #{invoice.invoiceNumber} in the message.</p>
          </div>

          <div className="w-72">
            <div className="flex justify-between py-2 text-sm text-gray-600">
              <span>Subtotal:</span>
              <span className="text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Discount:</span>
                <span className="text-gray-900">-{formatCurrency(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm text-gray-600">
              <span>Tax (HST):</span>
              <span className="text-gray-900">{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#1E3A5C] pt-3 mt-1 text-lg font-bold">
              <span className="text-[#1E3A5C]">Grand Total:</span>
              <span className="text-[#1E3A5C]">{formatCurrency(grandTotal)}</span>
            </div>
            {(invoice.deposit > 0 || invoice.amountPaid > 0) && (
              <>
                {invoice.deposit > 0 && (
                  <div className="flex justify-between py-2 text-sm text-gray-600">
                    <span>Deposit:</span>
                    <span className="text-gray-900">-{formatCurrency(invoice.deposit)}</span>
                  </div>
                )}
                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between py-2 text-sm text-gray-600">
                    <span>Amount Paid:</span>
                    <span className="text-gray-900">-{formatCurrency(invoice.amountPaid)}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between rounded bg-[#F3F6F8] px-3 py-2 mt-3 text-base font-bold print:bg-transparent print:px-0">
              <span className="text-[#1E3A5C]">Balance Due:</span>
              <span className="text-[#1E3A5C]">{formatCurrency(invoice.balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 flex justify-between border-t border-gray-200 pt-6 text-xs text-gray-400">
          <div>
            BN: {COMPANY_INFO.businessNumbers.bn} | BIN: {COMPANY_INFO.businessNumbers.bin}
          </div>
          <div>Terms: {invoice.terms}</div>
        </div>
      </div>
    </div>
  );
}
