import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { invoicePaymentSchema } from "@/lib/validations";
import { prisma }               from "@/lib/prisma";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

let stripe: Stripe | null = null;

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required to create payment intents.");
  }

  stripe ??= new Stripe(secretKey, {
    apiVersion: "2024-06-20",
    typescript:  true,
  });
  return stripe;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const { success, reset } = await formRatelimit.limit(`stripe:${ip}`);
  if (!success) return rateLimitResponse(reset);

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 }); }

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
  if (invoice.customerEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json(
      { success: false, message: "Email address doesn't match this invoice." },
      { status: 403 }
    );
  }

  if (invoice.status === "COMPLETED") {
    return NextResponse.json(
      { success: false, message: "This invoice has already been paid." },
      { status: 409 }
    );
  }

  // ── Create Stripe Payment Intent ───────────────────────────────────────
  let paymentIntent;
  try {
    paymentIntent = await getStripeClient().paymentIntents.create({
      amount:      invoice.amount,
      currency:    "cad",
      description: `Citywide Waste Solutions — Invoice #${invoiceNumber}`,
      metadata: {
        invoiceNumber,
        invoiceId:     invoice.id,
        customerEmail: email,
        customerName:  invoice.customerName,
      },
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });
  } catch (err) {
    console.error("Stripe PaymentIntent error:", err);
    return NextResponse.json(
      { success: false, message: "Payment processing error. Please try again." },
      { status: 500 }
    );
  }

  // Update invoice with payment intent ID
  await prisma.invoice.update({
    where: { id: invoice.id },
    data:  { stripePaymentIntentId: paymentIntent.id, status: "PENDING" },
  }).catch(console.error);

  const amountFormatted = new Intl.NumberFormat("en-CA", {
    style: "currency", currency: "CAD",
  }).format(invoice.amount / 100);

  return NextResponse.json({
    success:      true,
    clientSecret: paymentIntent.client_secret,
    invoice: {
      invoiceNumber,
      customerName: invoice.customerName,
      amount:       invoice.amount,
      amountFormatted,
      description:  invoice.description,
    },
  });
}
