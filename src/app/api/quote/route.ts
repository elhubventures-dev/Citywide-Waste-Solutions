import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/lib/validations";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendQuoteConfirmationEmail, sendQuoteAdminNotification } from "@/lib/email";
import { sendQuoteConfirmationSms } from "@/lib/sms";
import { upsertCrmContact, addToPipeline } from "@/lib/crm";
import { storeQuoteSubmission } from "@/lib/submission-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // ── 1. Rate limit ────────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const { success, reset } = await formRatelimit.limit(ip);
  if (!success) return rateLimitResponse(reset);

  // ── 2. Parse body ────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  // ── 3. Validate with Zod ─────────────────────────────────────────────────
  const parsed = quoteFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { success: false, message: "Validation failed", errors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ── 4. reCAPTCHA verification ────────────────────────────────────────────
  if (data.recaptchaToken) {
    const { valid, error } = await verifyRecaptcha(data.recaptchaToken);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: `Bot check failed: ${error}` },
        { status: 403 }
      );
    }
  }

  // ── 5. Save to database ──────────────────────────────────────────────────
  let submissionId: string;
  try {
    const submission = await storeQuoteSubmission(data, {
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
    submissionId = submission.id;
  } catch (err) {
    console.error("Quote storage error:", err);

    await Promise.allSettled([
      sendQuoteConfirmationEmail(data),
      sendQuoteAdminNotification(data),
    ]).catch(console.error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We received your request by email, but could not save it to the admin dashboard. Please call us if this is urgent.",
      },
      { status: 503 }
    );
  }

  // ── 6. Send required emails ───────────────────────────────────────────────
  const customerEmail = sendQuoteConfirmationEmail(data);
  const adminEmail = sendQuoteAdminNotification(data);
  const emailResults = await Promise.allSettled([customerEmail, adminEmail]);
  const failedEmail = emailResults.find((result) => result.status === "rejected");

  if (failedEmail?.status === "rejected") {
    console.error("Quote email failed:", failedEmail.reason);
    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't send the quote emails. Please call or email us and we'll help right away.",
      },
      { status: 502 }
    );
  }

  // ── 7. Fire optional side-effects (non-blocking) ──────────────────────────
  const firstName = data.fullName.split(" ")[0];
  const sms = data.smsOptIn
    ? sendQuoteConfirmationSms(data.phone, firstName, data.serviceType)
    : Promise.resolve();
  const crm = upsertCrmContact(data).then((contactId) => {
    if (contactId) {
      return addToPipeline(contactId, data.serviceType, data.city);
    }
  });

  Promise.allSettled([sms, crm]).catch(console.error);

  // ── 8. Respond ───────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      message: "Quote request received! We'll be in touch within 2 business hours.",
      data: { id: submissionId, savedToDatabase: true },
    },
    { status: 201 }
  );
}
