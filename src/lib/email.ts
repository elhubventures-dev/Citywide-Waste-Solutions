import { Resend } from "resend";
import type { QuoteFormData, ContactFormData } from "@/types";
import { BUSINESS, SITE_URL } from "@/lib/business";
import { BRAND_COLORS } from "@/lib/brand-colors";

let resend: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required to send email.");
  }

  resend ??= new Resend(apiKey);
  return resend;
}

const FROM = process.env.EMAIL_FROM ?? BUSINESS.email;
const ADMIN = process.env.EMAIL_ADMIN ?? BUSINESS.email;
const BRAND = BUSINESS.name;
const GREEN = BRAND_COLORS.green;
const NAVY = BRAND_COLORS.navy;
const BG = BRAND_COLORS.offWhite;

function getSender() {
  return FROM.includes("<") ? FROM : `${BRAND} <${FROM}>`;
}

async function sendEmail(args: Parameters<Resend["emails"]["send"]>[0]) {
  const result = await getResendClient().emails.send(args);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

// ─── Shared layout wrapper ─────────────────────────────────────────────────────
function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${GREEN} 0%,${NAVY} 100%);border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <span style="font-size:24px;">♻️</span>
              <span style="color:#fff;font-size:18px;font-weight:700;">${BRAND}</span>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:36px 32px;border-left:1px solid #e8edea;border-right:1px solid #e8edea;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0f9f3;border:1px solid #e8edea;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#637d73;">${BUSINESS.address.full}</p>
            <p style="margin:0;font-size:12px;color:#637d73;">
              <a href="tel:${BUSINESS.phoneRaw}" style="color:${GREEN};text-decoration:none;">${BUSINESS.phone}</a>
              &nbsp;·&nbsp;
              <a href="mailto:${BUSINESS.email}" style="color:${GREEN};text-decoration:none;">${BUSINESS.email}</a>
              &nbsp;·&nbsp;
              <a href="${SITE_URL}" style="color:${GREEN};text-decoration:none;">${SITE_URL.replace("https://", "")}</a>
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#adbdb5;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Quote confirmation → Customer ────────────────────────────────────────────
export async function sendQuoteConfirmationEmail(data: QuoteFormData) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#141c18;">Thanks, ${data.fullName.split(" ")[0]}! 🌱</h1>
    <p style="margin:0 0 24px;color:#4e635b;font-size:15px;line-height:1.6;">
      We've received your quote request and will respond within <strong>2 business hours</strong>.
      Here's a summary of what you submitted:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf9;border:1px solid #e8edea;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;width:140px;">Service</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.serviceType}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">City</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.city}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Phone</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.phone}</td></tr>
      ${data.pickupFrequency ? `<tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Frequency</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.pickupFrequency}</td></tr>` : ""}
    </table>

    <p style="margin:0 0 8px;color:#4e635b;font-size:14px;">In the meantime, you can:</p>
    <ul style="margin:0 0 28px;padding-left:20px;color:#4e635b;font-size:14px;line-height:2;">
      <li>Browse our <a href="${SITE_URL}/services" style="color:${GREEN};">services page</a></li>
      <li>Check our <a href="${SITE_URL}/pricing" style="color:${GREEN};">transparent pricing</a></li>
      <li>Learn about our <a href="${SITE_URL}/recycling" style="color:${GREEN};">recycling programs</a></li>
    </ul>

    <a href="${SITE_URL}" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
      Visit Our Website →
    </a>
  `;

  return sendEmail({
    from: getSender(),
    to: data.email,
    subject: `Quote request received — we'll be in touch shortly`,
    html: emailLayout("Quote Request Received", body),
  });
}

// ─── Quote notification → Admin ───────────────────────────────────────────────
export async function sendQuoteAdminNotification(data: QuoteFormData) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#141c18;">🔔 New Quote Request</h1>
    <p style="margin:0 0 24px;color:#4e635b;font-size:14px;">A new quote request has been submitted. Review and respond within 2 hours.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf9;border:1px solid #e8edea;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;width:140px;">Name</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.fullName}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Email</td><td style="font-size:14px;color:#141c18;"><a href="mailto:${data.email}" style="color:${GREEN};">${data.email}</a></td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Phone</td><td style="font-size:14px;color:#141c18;"><a href="tel:${data.phone}" style="color:${GREEN};">${data.phone}</a></td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Service</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.serviceType}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">City</td><td style="font-size:14px;color:#141c18;">${data.city}</td></tr>
      ${data.pickupFrequency ? `<tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Frequency</td><td style="font-size:14px;color:#141c18;">${data.pickupFrequency}</td></tr>` : ""}
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">SMS Opt-In</td><td style="font-size:14px;color:#141c18;">${data.smsOptIn ? "✅ Yes" : "No"}</td></tr>
      ${data.message ? `<tr><td style="padding:6px 0;font-size:14px;color:#637d73;vertical-align:top;">Message</td><td style="font-size:14px;color:#141c18;">${data.message}</td></tr>` : ""}
    </table>

    <div style="display:flex;gap:12px;">
      <a href="mailto:${data.email}" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;margin-right:8px;">Reply to ${data.fullName.split(" ")[0]} →</a>
      <a href="${SITE_URL}/admin/dashboard" style="display:inline-block;border:2px solid ${GREEN};color:${GREEN};text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">Open Admin Panel</a>
    </div>
  `;

  return sendEmail({
    from: getSender(),
    to: ADMIN,
    subject: `🔔 New Quote: ${data.serviceType} — ${data.fullName} (${data.city})`,
    html: emailLayout("New Quote Request", body),
  });
}

// ─── Contact confirmation → Customer ──────────────────────────────────────────
export async function sendContactConfirmationEmail(data: ContactFormData) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#141c18;">Message received, ${data.fullName.split(" ")[0]}!</h1>
    <p style="margin:0 0 20px;color:#4e635b;font-size:15px;line-height:1.6;">
      Thanks for reaching out. We typically respond within <strong>2 business hours</strong> Monday–Friday.
    </p>

    <div style="background:#f8faf9;border-left:4px solid ${GREEN};padding:16px;border-radius:0 8px 8px 0;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:13px;color:#637d73;text-transform:uppercase;letter-spacing:.05em;">Your message</p>
      <p style="margin:0;font-size:14px;color:#141c18;line-height:1.6;">${data.message}</p>
    </div>

    <p style="margin:0 0 20px;font-size:14px;color:#4e635b;">
      Need faster help? Call us directly at <a href="tel:${BUSINESS.phoneRaw}" style="color:${GREEN};font-weight:600;">${BUSINESS.phone}</a>.
    </p>
  `;

  return sendEmail({
    from: getSender(),
    to: data.email,
    subject: `We got your message — ${data.subject}`,
    html: emailLayout("Message Received", body),
  });
}

// ─── Contact notification → Admin ─────────────────────────────────────────────
export async function sendContactAdminNotification(data: ContactFormData) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#141c18;">📬 New Contact Message</h1>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faf9;border:1px solid #e8edea;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;width:100px;">Name</td><td style="font-size:14px;color:#141c18;font-weight:600;">${data.fullName}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Email</td><td style="font-size:14px;"><a href="mailto:${data.email}" style="color:${GREEN};">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Phone</td><td style="font-size:14px;"><a href="tel:${data.phone}" style="color:${GREEN};">${data.phone}</a></td></tr>` : ""}
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Subject</td><td style="font-size:14px;color:#141c18;">${data.subject}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;vertical-align:top;">Message</td><td style="font-size:14px;color:#141c18;line-height:1.6;">${data.message}</td></tr>
    </table>

    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 24px;border-radius:8px;margin-right:8px;">
      Reply Now →
    </a>
    <a href="${SITE_URL}/admin/dashboard" style="display:inline-block;border:2px solid ${GREEN};color:${GREEN};text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">Open Admin Panel</a>
  `;

  return sendEmail({
    from: getSender(),
    to: ADMIN,
    subject: `📬 Contact: ${data.subject} — ${data.fullName}`,
    html: emailLayout("New Contact Message", body),
  });
}

// ─── Invoice payment confirmation ─────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  invoiceNumber: string,
  amount: number
) {
  const formatted = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    amount / 100
  );

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#141c18;">✅ Payment Confirmed!</h1>
    <p style="margin:0 0 24px;color:#4e635b;font-size:15px;">
      Hi ${name}, your payment has been successfully processed. A receipt has been saved to your account.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9f3;border:1px solid #b3e0c1;border-radius:8px;padding:20px;margin-bottom:28px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;width:160px;">Invoice #</td><td style="font-size:14px;color:#141c18;font-weight:700;">${invoiceNumber}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Amount Paid</td><td style="font-size:18px;color:${GREEN};font-weight:700;">${formatted}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#637d73;">Date</td><td style="font-size:14px;color:#141c18;">${new Date().toLocaleDateString("en-CA", { dateStyle: "long" })}</td></tr>
    </table>

    <p style="font-size:14px;color:#4e635b;margin:0 0 24px;">
      Questions about your invoice? Contact us at <a href="mailto:${BUSINESS.email}" style="color:${GREEN};">${BUSINESS.email}</a>.
    </p>
  `;

  return sendEmail({
    from: getSender(),
    to: email,
    subject: `✅ Payment confirmed — Invoice #${invoiceNumber}`,
    html: emailLayout("Payment Confirmed", body),
  });
}
