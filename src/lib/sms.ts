import twilio from "twilio";
import { BUSINESS, SITE_URL } from "@/lib/business";

let client: twilio.Twilio | null = null;

function getTwilio(): twilio.Twilio {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  }
  return client;
}

const FROM = process.env.TWILIO_PHONE_NUMBER!;
const BRAND = BUSINESS.shortName;

// ─── Core sender ──────────────────────────────────────────────────────────────
async function sendSms(to: string, body: string): Promise<{ sid: string } | null> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("Twilio credentials not configured — SMS skipped");
    return null;
  }

  try {
    const msg = await getTwilio().messages.create({ body, from: FROM, to });
    return { sid: msg.sid };
  } catch (err) {
    console.error("Twilio SMS error:", err);
    return null;
  }
}

// ─── SMS Templates ────────────────────────────────────────────────────────────

/**
 * Sent immediately when a quote form is submitted
 */
export async function sendQuoteConfirmationSms(
  phone: string,
  firstName: string,
  serviceType: string
) {
  const body =
    `Hi ${firstName}! ✅ ${BRAND} received your ${serviceType} quote request. ` +
    `We'll contact you within 2 business hours. Questions? Call ${BUSINESS.phone}.`;
  return sendSms(phone, body);
}

/**
 * Sent when admin confirms/schedules the pickup
 */
export async function sendPickupScheduledSms(
  phone: string,
  firstName: string,
  serviceType: string,
  date: string,
  timeWindow: string
) {
  const body =
    `Hi ${firstName}! 📅 Your ${serviceType} pickup is confirmed for ${date} between ${timeWindow}. ` +
    `Our crew will be at your location during that window. — ${BRAND}`;
  return sendSms(phone, body);
}

/**
 * Sent the evening before a scheduled pickup
 */
export async function sendPickupReminderSms(
  phone: string,
  firstName: string,
  serviceType: string,
  date: string
) {
  const body =
    `📢 Reminder: Your ${serviceType} pickup is tomorrow (${date}). ` +
    `Please have bins/items ready by 7 AM. Need to reschedule? Call ${BUSINESS.phone}. — ${BRAND}`;
  return sendSms(phone, body);
}

/**
 * Sent when the pickup crew completes the job
 */
export async function sendPickupCompletedSms(phone: string, firstName: string) {
  const body =
    `Hi ${firstName}! ✅ Your pickup has been completed. Thank you for choosing ${BRAND}! ` +
    `Rate our service: ${SITE_URL}/review`;
  return sendSms(phone, body);
}

/**
 * Sent when an invoice payment is confirmed
 */
export async function sendPaymentConfirmationSms(
  phone: string,
  firstName: string,
  invoiceNumber: string,
  amount: string
) {
  const body =
    `✅ Payment received! Invoice #${invoiceNumber} — ${amount} CAD. ` +
    `Thank you, ${firstName}. A receipt has been emailed to you. — ${BRAND}`;
  return sendSms(phone, body);
}

/**
 * Sent for overdue invoices (admin-triggered)
 */
export async function sendPaymentReminderSms(
  phone: string,
  firstName: string,
  invoiceNumber: string,
  dueDate: string
) {
  const body =
    `Hi ${firstName}, a friendly reminder that Invoice #${invoiceNumber} was due on ${dueDate}. ` +
    `Pay online: ${SITE_URL}/pay — ${BRAND}`;
  return sendSms(phone, body);
}
