import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type   = searchParams.get("type") ?? "quote";   // "quote" | "contact"
  const status = searchParams.get("status");             // "NEW" | "READ" | "REPLIED" | "ARCHIVED"
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const skip   = (page - 1) * limit;

  try {
    if (type === "quote") {
      const where = status ? { status: status as any } : {};
      const [items, total] = await Promise.all([
        prisma.quoteRequest.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.quoteRequest.count({ where }),
      ]);
      return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
    }

    if (type === "contact") {
      const where = status ? { status: status as any } : {};
      const [items, total] = await Promise.all([
        prisma.contactSubmission.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.contactSubmission.count({ where }),
      ]);
      return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Admin submissions error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — update submission status
export async function PATCH(req: NextRequest) {
  let body: { id: string; type: "quote" | "contact"; status: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const { id, type, status } = body;
  if (!id || !type || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 422 });
  }

  try {
    if (type === "quote") {
      await prisma.quoteRequest.update({ where: { id }, data: { status: status as any } });
    } else {
      await prisma.contactSubmission.update({ where: { id }, data: { status: status as any } });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
