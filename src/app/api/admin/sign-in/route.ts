import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { isAdminEmail, isAuthConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid sign-in request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 422 });
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: "This email is not authorized for admin access." },
      { status: 403 }
    );
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Unable to complete sign-in. Check AUTH_SECRET and database connectivity.",
      },
      { status: 502 }
    );
  }
}
