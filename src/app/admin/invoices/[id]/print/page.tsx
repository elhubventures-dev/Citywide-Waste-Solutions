import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { COMPANY_INFO } from "@/lib/invoice-constants";
import { SITE_IMAGES } from "@/lib/site-images";
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
  const docLabel = invoice.type === "QUOTE" ? "QUOTE" : "INVOICE";
  const client = invoice.client;

  const billingAddress = [client.billingAddress, client.city, client.province, client.zip]
    .filter(Boolean)
    .join(", ");

  const serviceAddress = [client.serviceAddress, client.city, client.province, client.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white dark:bg-gray-950 dark:print:bg-white">
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

      <div className="mx-auto my-8 max-w-[820px] bg-white shadow-lg print:m-0 print:max-w-none print:shadow-none dark:bg-white dark:text-black print:dark:bg-white">
        <AutoPrint />

        {/* Brand accent */}
        <div className="h-1.5 bg-[#2E9B4A] print:h-1" />
        <div className="h-1 bg-[#1E3A5C]" />

        <div className="p-10 sm:p-12 print:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-[55%]">
              <Image
                src={SITE_IMAGES.logos.header}
                alt={brandName}
                width={200}
                height={52}
                className="mb-3 h-auto w-[200px]"
              />
              <p className="text-sm font-bold text-[#1E3A5C]">{brandName}</p>
              <p className="text-xs italic text-[#2E9B4A]">{COMPANY_INFO.tagline}</p>
              <div className="mt-3 space-y-0.5 text-xs text-gray-500">
                <p>{COMPANY_INFO.address}</p>
                <p>
                  {COMPANY_INFO.phone} · {COMPANY_INFO.email}
                </p>
                <p>{COMPANY_INFO.website}</p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-bold tracking-widest text-[#1E3A5C]">{docLabel}</h2>
              <p className="mt-1 text-sm font-bold text-[#2E9B4A]">#{invoice.invoiceNumber}</p>

              <div className="mt-4 w-52 overflow-hidden rounded border border-gray-200 text-left text-xs">
                {[
                  ["Issue Date", invoice.issueDate || "—"],
                  ["Due Date", invoice.dueDate || "—"],
                  ["Payment Terms", invoice.terms || "—"],
                  ["Status", invoice.status],
                ].map(([label, value], i, arr) => (
                  <div
                    key={label}
                    className={`flex ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    <span className="w-[45%] bg-[#F5F8F6] px-2.5 py-1.5 font-semibold text-gray-500">
                      {label}
                    </span>
                    <span className="flex-1 px-2.5 py-1.5 text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-gray-200 bg-[#FAFBFC] p-4">
              <h3 className="mb-2 border-b border-gray-200 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#2E9B4A]">
                Bill To
              </h3>
              <p className="font-bold text-gray-900">{client.name || client.company || "Client"}</p>
              {client.company && client.name ? (
                <p className="text-sm text-gray-600">{client.company}</p>
              ) : null}
              {billingAddress ? <p className="text-sm text-gray-600">{billingAddress}</p> : null}
              {client.email ? <p className="text-sm text-gray-600">{client.email}</p> : null}
              {client.phone ? <p className="text-sm text-gray-600">{client.phone}</p> : null}
              {client.taxNumber ? (
                <p className="text-xs text-gray-500">Tax #: {client.taxNumber}</p>
              ) : null}
            </div>

            {client.serviceAddress ? (
              <div className="rounded border border-gray-200 bg-[#FAFBFC] p-4">
                <h3 className="mb-2 border-b border-gray-200 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#2E9B4A]">
                  Service Location
                </h3>
                <p className="text-sm text-gray-600">{serviceAddress}</p>
              </div>
            ) : null}
          </div>

          {/* Line items */}
          <div className="mt-8 overflow-hidden rounded border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1E3A5C] text-[10px] uppercase tracking-wide text-white">
                <tr>
                  <th className="px-3 py-2.5 font-bold">Description</th>
                  <th className="px-3 py-2.5 text-center font-bold">Qty</th>
                  <th className="px-3 py-2.5 text-right font-bold">Unit Price</th>
                  <th className="px-3 py-2.5 text-center font-bold">Tax</th>
                  <th className="px-3 py-2.5 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((row, i) => {
                  const base = row.qty * row.price;
                  const afterDisc = base - (base * row.discount) / 100;
                  const lineTot = afterDisc + (afterDisc * row.tax) / 100;

                  return (
                    <tr
                      key={row.id}
                      className={`border-t border-gray-200 ${i % 2 === 1 ? "bg-[#FAFBFC]" : "bg-white"}`}
                    >
                      <td className="px-3 py-3">
                        <p className="text-gray-900">{row.service || "—"}</p>
                        {row.description ? (
                          <p className="text-xs text-gray-400">{row.description}</p>
                        ) : null}
                        {row.discount > 0 ? (
                          <p className="text-xs text-gray-400">{row.discount}% discount applied</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600">
                        {row.qty} {row.unit}
                      </td>
                      <td className="px-3 py-3 text-right text-gray-600">
                        {formatCurrency(row.price)}
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600">{row.tax}%</td>
                      <td className="px-3 py-3 text-right font-semibold text-[#1E3A5C]">
                        {formatCurrency(lineTot)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom section */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              {invoice.type !== "QUOTE" ? (
                <div className="rounded border border-gray-200 bg-[#FAFBFC] p-4 text-sm">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#1E3A5C]">
                    Payment Instructions
                  </h3>
                  <p className="text-gray-600">
                    Please remit payment via Interac e-Transfer. Include your invoice number in the
                    transfer message.
                  </p>
                  <p className="mt-3 rounded bg-[#1E3A5C] px-3 py-2 text-center text-sm font-bold text-white">
                    {COMPANY_INFO.email}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Reference: Invoice #{invoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay online at {COMPANY_INFO.website}/pay
                  </p>
                </div>
              ) : (
                <div className="rounded border border-gray-200 bg-[#FAFBFC] p-4 text-sm">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#1E3A5C]">
                    Quote Validity
                  </h3>
                  <p className="text-gray-600">
                    This quote is valid for 30 days from the issue date unless otherwise noted.
                  </p>
                </div>
              )}

              {client.notes ? (
                <div className="rounded border border-gray-200 bg-[#FAFBFC] p-4 text-sm">
                  <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#1E3A5C]">
                    Notes
                  </h3>
                  <p className="text-xs text-gray-500">{client.notes}</p>
                </div>
              ) : null}
            </div>

            <div className="overflow-hidden rounded border border-gray-200">
              <div className="flex justify-between border-b border-gray-100 px-4 py-2 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountTotal > 0 ? (
                <div className="flex justify-between border-b border-gray-100 px-4 py-2 text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-gray-900">
                    -{formatCurrency(discountTotal)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between border-b border-gray-100 px-4 py-2 text-sm">
                <span className="text-gray-500">HST / Tax</span>
                <span className="font-semibold text-gray-900">{formatCurrency(taxTotal)}</span>
              </div>
              <div className="flex justify-between bg-[#F5F8F6] px-4 py-2.5 text-sm">
                <span className="font-bold text-[#1E3A5C]">Total ({invoice.currency})</span>
                <span className="font-bold text-[#1E3A5C]">{formatCurrency(grandTotal)}</span>
              </div>
              {invoice.deposit > 0 ? (
                <div className="flex justify-between border-b border-gray-100 px-4 py-2 text-sm">
                  <span className="text-gray-500">Deposit Received</span>
                  <span className="font-semibold text-gray-900">
                    -{formatCurrency(invoice.deposit)}
                  </span>
                </div>
              ) : null}
              {invoice.amountPaid > 0 ? (
                <div className="flex justify-between border-b border-gray-100 px-4 py-2 text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-gray-900">
                    -{formatCurrency(invoice.amountPaid)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between bg-[#1E3A5C] px-4 py-3">
                <span className="text-sm font-bold text-white">
                  {invoice.type === "QUOTE" ? "QUOTE TOTAL" : "BALANCE DUE"}
                </span>
                <span className="text-base font-bold text-[#2E9B4A]">
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 flex items-end justify-between border-t border-gray-200 pt-5 text-[10px] text-gray-400">
            <div>
              <p>
                BN {COMPANY_INFO.businessNumbers.bn} · BIN {COMPANY_INFO.businessNumbers.bin}
              </p>
              <p>
                NAICS {COMPANY_INFO.businessNumbers.naics} · All amounts in {invoice.currency}
              </p>
            </div>
            <p className="text-xs font-bold text-[#1E3A5C]">Thank you for your business</p>
          </div>
        </div>
      </div>
    </div>
  );
}
