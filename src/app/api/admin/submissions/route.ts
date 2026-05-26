import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-auth";
import {
  listSubmissions,
  SubmissionStoreError,
  updateSubmissionStatus,
} from "@/lib/submission-store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authError = await requireAdminApiAccess();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "quote"; // "quote" | "contact"
  const status = searchParams.get("status"); // "NEW" | "READ" | "REPLIED" | "ARCHIVED"
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

  try {
    if (type !== "quote" && type !== "contact") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await listSubmissions({ type, status, page, limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Admin submissions error:", err);

    if (err instanceof SubmissionStoreError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }

    return NextResponse.json({ error: "Unable to load submissions" }, { status: 500 });
  }
}

// PATCH — update submission status
export async function PATCH(req: NextRequest) {
  const authError = await requireAdminApiAccess();
  if (authError) return authError;

  let body: { id: string; type: "quote" | "contact"; status: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, type, status } = body;
  if (!id || !type || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 422 });
  }

  if (type !== "quote" && type !== "contact") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    await updateSubmissionStatus({ id, type, status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Status update error:", err);

    if (err instanceof SubmissionStoreError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
