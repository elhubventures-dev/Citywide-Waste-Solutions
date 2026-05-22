import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema }          from "@/lib/validations";
import { prisma }                   from "@/lib/prisma";
import { verifyRecaptcha }          from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendQuoteConfirmationEmail, sendQuoteAdminNotification } from "@/lib/email";
import { sendQuoteConfirmationSms } from "@/lib/sms";
import { upsertCrmContact, addToPipeline } from "@/lib/crm";

export const runtime = "nodejs";

// ─── Service type → Prisma enum map ──────────────────────────────────────────
const SERVICE_ENUM_MAP: Record<string, string> = {
  "Residential Waste Collection":  "RESIDENTIAL_WASTE_COLLECTION",
  "Commercial Waste Management":   "COMMERCIAL_WASTE_MANAGEMENT",
  "Recycling Services":            "RECYCLING_SERVICES",
  "Dumpster & Bin Rental":         "DUMPSTER_BIN_RENTAL",
  "Junk Removal":                  "JUNK_REMOVAL",
  "Construction Waste Removal":    "CONSTRUCTION_WASTE_REMOVAL",
};

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
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
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
  let submission;
  try {
    submission = await prisma.quoteRequest.create({
      data: {
        fullName:        data.fullName,
        email:           data.email,
        phone:           data.phone,
        serviceType:     SERVICE_ENUM_MAP[data.serviceType] as any,
        city:            data.city,
        pickupFrequency: data.pickupFrequency,
        message:         data.message,
        smsOptIn:        data.smsOptIn,
        ipAddress:       ip,
        userAgent:       req.headers.get("user-agent") ?? undefined,
      },
    });
  } catch (err) {
    console.error("DB error saving quote:", err);
    return NextResponse.json(
      { success: false, message: "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }

  // ── 6. Fire async side-effects (non-blocking) ────────────────────────────
  const firstName = data.fullName.split(" ")[0];

  Promise.allSettled([
    // Email — customer confirmation
    sendQuoteConfirmationEmail(data),

    // Email — admin notification
    sendQuoteAdminNotification(data),

    // SMS — only if opted in
    data.smsOptIn
      ? sendQuoteConfirmationSms(data.phone, firstName, data.serviceType)
      : Promise.resolve(),

    // CRM — upsert contact + pipeline
    upsertCrmContact(data).then((contactId) => {
      if (contactId) {
        // Update DB record with CRM id
        prisma.quoteRequest
          .update({ where: { id: submission.id }, data: { crmContactId: contactId } })
          .catch(console.error);

        return addToPipeline(contactId, data.serviceType, data.city);
      }
    }),
  ]).catch(console.error);

  // ── 7. Respond ───────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      message: "Quote request received! We'll be in touch within 2 business hours.",
      data: { id: submission.id },
    },
    { status: 201 }
  );
}
