import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { formRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendQuoteConfirmationEmail, sendQuoteAdminNotification } from "@/lib/email";
import { sendQuoteConfirmationSms } from "@/lib/sms";
import { upsertCrmContact, addToPipeline } from "@/lib/crm";

export const runtime = "nodejs";

// ─── Service type → Prisma enum map ──────────────────────────────────────────
const SERVICE_ENUM_MAP: Record<string, string> = {
  "Residential Waste Collection": "RESIDENTIAL_WASTE_COLLECTION",
  "Commercial Waste Management": "COMMERCIAL_WASTE_MANAGEMENT",
  "Recycling Services": "RECYCLING_SERVICES",
  "Dumpster & Bin Rental": "DUMPSTER_BIN_RENTAL",
  "Junk Removal": "JUNK_REMOVAL",
  "Construction Waste Removal": "CONSTRUCTION_WASTE_REMOVAL",
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
  let submissionId: string | null = null;
  let savedToDatabase = true;
  try {
    const submission = await prisma.quoteRequest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        serviceType: SERVICE_ENUM_MAP[data.serviceType] as any,
        city: data.city,
        pickupFrequency: data.pickupFrequency,
        message: data.message,
        smsOptIn: data.smsOptIn,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });
    submissionId = submission.id;
  } catch (err) {
    savedToDatabase = false;
    console.error("DB error saving quote:", err);
  }

  // ── 6. Fire async side-effects (non-blocking) ────────────────────────────
  const firstName = data.fullName.split(" ")[0];
  const customerEmail = sendQuoteConfirmationEmail(data);
  const adminEmail = sendQuoteAdminNotification(data);
  const sms = data.smsOptIn
    ? sendQuoteConfirmationSms(data.phone, firstName, data.serviceType)
    : Promise.resolve();
  const crm = upsertCrmContact(data).then((contactId) => {
    if (contactId && submissionId) {
      // Update DB record with CRM id only when the lead was saved locally.
      return prisma.quoteRequest
        .update({ where: { id: submissionId }, data: { crmContactId: contactId } })
        .then(() => addToPipeline(contactId, data.serviceType, data.city));
    }

    if (contactId) {
      return addToPipeline(contactId, data.serviceType, data.city);
    }
  });

  if (!savedToDatabase) {
    const [, adminResult] = await Promise.allSettled([customerEmail, adminEmail]);

    if (adminResult.status === "rejected") {
      console.error("Fallback quote email failed:", adminResult.reason);
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't submit your request online. Please call or email us and we'll help right away.",
        },
        { status: 500 }
      );
    }

    Promise.allSettled([sms, crm]).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Quote request received! We'll be in touch within 2 business hours.",
        data: { id: null, savedToDatabase: false },
      },
      { status: 202 }
    );
  }

  Promise.allSettled([customerEmail, adminEmail, sms, crm]).catch(console.error);

  // ── 7. Respond ───────────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      message: "Quote request received! We'll be in touch within 2 business hours.",
      data: { id: submissionId },
    },
    { status: 201 }
  );
}
