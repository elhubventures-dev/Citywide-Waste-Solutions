import "server-only";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail, isAuthConfigured } from "@/lib/auth";

export async function requireAdminPageAccess() {
  if (!isAuthConfigured()) {
    redirect("/sign-in");
  }

  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail || !isAdminEmail(userEmail)) {
    redirect("/sign-in");
  }
}

export async function requireAdminApiAccess() {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }

  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminEmail(userEmail)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
