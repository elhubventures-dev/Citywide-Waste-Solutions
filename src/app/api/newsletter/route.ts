import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { newsletterRatelimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { success, reset } = await newsletterRatelimit.limit(ip);
  if (!success) return rateLimitResponse(reset);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address" },
      { status: 422 }
    );
  }

  const { email, name } = parsed.data;

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true, name: name ?? undefined },
      create: { email, name, source: (req.headers.get("referer") ?? "").slice(0, 100) },
    });
  } catch (err) {
    console.error("Newsletter DB error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "You're subscribed! 🌱" }, { status: 201 });
}
