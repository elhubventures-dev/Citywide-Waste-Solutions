import { NextRequest, NextResponse } from "next/server";
import { movingQuoteFormSchema } from "@/lib/validations";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendMovingQuoteConfirmationEmail, sendMovingQuoteAdminNotification } from "@/lib/email";
import { storeContactSubmission } from "@/lib/submission-store";
import type { ContactFormData, MovingQuoteFormData } from "@/types";

export const runtime = "nodejs";

function toContactPayload(data: MovingQuoteFormData): ContactFormData {
  const details = [
    `Moving Service: ${data.serviceType}`,
    `Preferred Move Date: ${data.moveDate}`,
    `Moving From: ${data.fromCity}`,
    `Moving To: ${data.toCity}`,
    `Property Size: ${data.homeSize}`,
    `SMS Updates: ${data.smsOptIn ? "Yes" : "No"}`,
    data.message ? `\nAdditional Notes:\n${data.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    subject: `Moving Quote — ${data.serviceType}`,
    message: details,
    recaptchaToken: data.recaptchaToken,
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { success, reset } = await formRatelimit.limit(`moving-quote:${ip}`);
  if (!success) return rateLimitResponse(reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const parsed = movingQuoteFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (data.recaptchaToken) {
    const { valid } = await verifyRecaptcha(data.recaptchaToken);
    if (!valid) {
      return NextResponse.json({ success: false, message: "Bot check failed" }, { status: 403 });
    }
  }

  const contactData = toContactPayload(data);

  let submissionId: string;
  try {
    const submission = await storeContactSubmission(contactData, {
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
    submissionId = submission.id;
  } catch (err) {
    console.error("Moving quote storage error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "We couldn't save your request. Please call us directly and we'll help right away.",
      },
      { status: 503 }
    );
  }

  const [customerEmail, adminEmail] = await Promise.allSettled([
    sendMovingQuoteConfirmationEmail(data),
    sendMovingQuoteAdminNotification(data),
  ]);

  const failedEmail = [customerEmail, adminEmail].find((r) => r.status === "rejected");
  if (failedEmail?.status === "rejected") {
    console.error("Moving quote email failed:", failedEmail.reason);
    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't send the quote emails. Please call or email us and we'll help right away.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Your moving quote request was received! We'll contact you within 2 business hours.",
      data: { id: submissionId },
    },
    { status: 201 }
  );
}
