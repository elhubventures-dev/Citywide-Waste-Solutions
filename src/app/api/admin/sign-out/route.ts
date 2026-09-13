import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await signOut({ redirect: false });
  } catch {
    // Treat sign-out as idempotent so users can always leave the admin area.
  }

  return NextResponse.json({ success: true });
}
