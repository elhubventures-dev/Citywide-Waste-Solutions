import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/email";
import { sendPaymentConfirmationSms } from "@/lib/sms";

export const runtime = "nodejs";

// Must read raw body for Stripe signature verification
export const dynamic = "force-dynamic";

let stripe: Stripe | null = null;

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required to verify Stripe webhooks.");
  }

  stripe ??= new Stripe(secretKey, {
    apiVersion: "2024-06-20",
    typescript: true,
  });
  return stripe;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured" }, { status: 500 });
  }

  // ── Verify webhook signature ───────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Handle events ──────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const meta = pi.metadata;
        const invoiceId = meta.invoiceId;

        if (!invoiceId) break;

        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "Paid",
            paidAt: new Date(),
          },
        });

        const amountFormatted = new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
        }).format(pi.amount / 100);

        // Send confirmation email
        await sendPaymentConfirmationEmail(
          meta.customerEmail,
          meta.customerName,
          invoice.invoiceNumber,
          pi.amount
        ).catch(console.error);

        // Send confirmation SMS if we have a phone on the invoice record
        // (phone is stored via quote request — look up via email)
        const quoteRecord = await prisma.quoteRequest.findFirst({
          where: { email: meta.customerEmail },
          orderBy: { createdAt: "desc" },
        });

        if (quoteRecord?.smsOptIn && quoteRecord.phone) {
          await sendPaymentConfirmationSms(
            quoteRecord.phone,
            meta.customerName.split(" ")[0],
            invoice.invoiceNumber,
            amountFormatted
          ).catch(console.error);
        }

        console.log(`✅ Payment confirmed: Invoice #${invoice.invoiceNumber} — ${amountFormatted}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        if (pi.metadata.invoiceId) {
          await prisma.invoice
            .update({
              where: { id: pi.metadata.invoiceId },
              data: { status: "FAILED" },
            })
            .catch(console.error);
        }
        console.warn(`❌ Payment failed: ${pi.id}`);
        break;
      }

      case "payment_intent.canceled": {
        const pi = event.data.object as Stripe.PaymentIntent;
        if (pi.metadata.invoiceId) {
          await prisma.invoice
            .update({
              where: { id: pi.metadata.invoiceId },
              data: { status: "PENDING" },
            })
            .catch(console.error);
        }
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
