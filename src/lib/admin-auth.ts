import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { isAdminEmail, isClerkConfigured } from "@/lib/auth";

export async function requireAdminPageAccess() {
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }

  let session;
  try {
    session = await auth();
  } catch {
    redirect("/sign-in");
  }

  if (!session.userId) {
    session.redirectToSignIn();
  }

  let user;
  try {
    user = await currentUser();
  } catch {
    redirect("/sign-in");
  }

  const emails = user?.emailAddresses.map((email) => email.emailAddress) ?? [];

  if (!emails.some(isAdminEmail)) {
    redirect("/sign-in");
  }
}

export async function requireAdminApiAccess() {
  if (!isClerkConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }

  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const emails = user?.emailAddresses.map((email) => email.emailAddress) ?? [];

    if (!emails.some(isAdminEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
