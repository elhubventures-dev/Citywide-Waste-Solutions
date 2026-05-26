import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendContactConfirmationEmail, sendContactAdminNotification } from "@/lib/email";
import { storeContactSubmission } from "@/lib/submission-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const { success, reset } = await formRatelimit.limit(`contact:${ip}`);
  if (!success) return rateLimitResponse(reset);

  // ── Parse ──────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  // ── Validate ───────────────────────────────────────────────────────────
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ── reCAPTCHA ──────────────────────────────────────────────────────────
  if (data.recaptchaToken) {
    const { valid } = await verifyRecaptcha(data.recaptchaToken);
    if (!valid) {
      return NextResponse.json({ success: false, message: "Bot check failed" }, { status: 403 });
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────
  let submissionId: string;
  try {
    const submission = await storeContactSubmission(data, {
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
    submissionId = submission.id;
  } catch (err) {
    console.error("Contact storage error:", err);

    await Promise.allSettled([
      sendContactConfirmationEmail(data),
      sendContactAdminNotification(data),
    ]).catch(console.error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We received your message by email, but could not save it to the admin dashboard. Please call us if this is urgent.",
      },
      { status: 503 }
    );
  }

  // ── Emails ──────────────────────────────────────────────────────────────
  const customerEmail = sendContactConfirmationEmail(data);
  const adminEmail = sendContactAdminNotification(data);
  const emailResults = await Promise.allSettled([customerEmail, adminEmail]);
  const failedEmail = emailResults.find((result) => result.status === "rejected");

  if (failedEmail?.status === "rejected") {
    console.error("Contact email failed:", failedEmail.reason);
    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't send the contact emails. Please call or email us and we'll help right away.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Message sent! We'll respond within 2 business hours.",
      data: { id: submissionId, savedToDatabase: true },
    },
    { status: 201 }
  );
}
