import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const quoteCount = await prisma.quoteRequest.count();
    const contactCount = await prisma.contactSubmission.count();
    return NextResponse.json({ success: true, quoteCount, contactCount });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack,
    }, { status: 500 });
  }
}
