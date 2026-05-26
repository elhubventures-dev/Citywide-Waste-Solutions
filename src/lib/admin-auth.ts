import "server-only";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { isAdminEmail, isSupabaseAuthConfigured } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminPageAccess() {
  if (!isSupabaseAuthConfigured()) {
    redirect("/sign-in");
  }

  let userEmail: string | undefined;
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      redirect("/sign-in");
    }

    userEmail = user.email;
  } catch {
    redirect("/sign-in");
  }

  if (!isAdminEmail(userEmail)) {
    redirect("/sign-in");
  }
}

export async function requireAdminApiAccess() {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }

  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
