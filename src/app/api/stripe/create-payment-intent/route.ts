import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { invoicePaymentSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";



export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const { success, reset } = await formRatelimit.limit(`stripe:${ip}`);
  if (!success) return rateLimitResponse(reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const parsed = invoicePaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check your invoice number and email." },
      { status: 422 }
    );
  }

  const { invoiceNumber, email } = parsed.data;

  // ── Look up invoice in DB ──────────────────────────────────────────────
  let invoice;
  try {
    invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: invoiceNumber.toUpperCase() },
      include: { client: true, items: true },
    });
  } catch (err) {
    console.error("Invoice lookup error:", err);
    return NextResponse.json({ success: false, message: "Database error." }, { status: 500 });
  }

  if (!invoice) {
    return NextResponse.json(
      { success: false, message: "Invoice not found. Please check the number and try again." },
      { status: 404 }
    );
  }

  // Verify email matches invoice
  if (!invoice.client || (invoice.client.email?.toLowerCase() !== email.toLowerCase())) {
    return NextResponse.json(
      { success: false, message: "Email address doesn't match this invoice." },
      { status: 403 }
    );
  }

  if (invoice.status === "Paid") {
    return NextResponse.json(
      { success: false, message: "This invoice has already been paid." },
      { status: 409 }
    );
  }

  // Stripe is bypassed because only Interac e-Transfer is supported.
  // We just return success and the invoice details.
  
  // Update invoice status to pending if we want, or leave it. We'll leave it as is for e-Transfer.

  const amountFormatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(invoice.balanceDue);

  return NextResponse.json({
    success: true,
    clientSecret: "dummy-secret-not-used", // To keep TS happy if expected
    invoice: {
      invoiceNumber,
      customerName: invoice.client.name || invoice.client.company || "",
      amount: Math.round(invoice.balanceDue * 100),
      amountFormatted,
      description: invoice.terms || "",
      fullInvoice: invoice,
    },
  });
}
