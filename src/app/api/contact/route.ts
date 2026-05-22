import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema }         from "@/lib/validations";
import { prisma }                    from "@/lib/prisma";
import { verifyRecaptcha }           from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendContactConfirmationEmail, sendContactAdminNotification } from "@/lib/email";

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
  try {
    await prisma.contactSubmission.create({
      data: {
        fullName:  data.fullName,
        email:     data.email,
        phone:     data.phone ?? null,
        subject:   data.subject,
        message:   data.message,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });
  } catch (err) {
    console.error("DB error saving contact:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save. Please try again." },
      { status: 500 }
    );
  }

  // ── Emails (non-blocking) ──────────────────────────────────────────────
  Promise.allSettled([
    sendContactConfirmationEmail(data),
    sendContactAdminNotification(data),
  ]).catch(console.error);

  return NextResponse.json(
    { success: true, message: "Message sent! We'll respond within 2 business hours." },
    { status: 201 }
  );
}
