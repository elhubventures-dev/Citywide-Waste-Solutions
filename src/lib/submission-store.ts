import "server-only";

import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ContactFormData, QuoteFormData } from "@/types";
import { prisma } from "@/lib/prisma";

type SubmissionType = "quote" | "contact";
type SubmissionStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

type ListOptions = {
  type: SubmissionType;
  status?: string | null;
  page: number;
  limit: number;
};

type ListResult = {
  items: any[];
  total: number;
  page: number;
  pages: number;
  source: "prisma" | "supabase";
};

export class SubmissionStoreError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "SubmissionStoreError";
    this.cause = options?.cause;
  }
}

const SERVICE_ENUM_MAP: Record<string, string> = {
  "Residential Waste Collection": "RESIDENTIAL_WASTE_COLLECTION",
  "Commercial Waste Management": "COMMERCIAL_WASTE_MANAGEMENT",
  "Recycling Services": "RECYCLING_SERVICES",
  "Dumpster & Bin Rental": "DUMPSTER_BIN_RENTAL",
  "Junk Removal": "JUNK_REMOVAL",
  "Construction Waste Removal": "CONSTRUCTION_WASTE_REMOVAL",
};

const SERVICE_ENUM_VALUES = new Set(Object.values(SERVICE_ENUM_MAP));

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabaseAdmin;
}

function toStoreError(cause: unknown) {
  return new SubmissionStoreError(
    "Submission storage is unavailable. Confirm the Supabase database tables exist and the production database connection is configured.",
    { cause }
  );
}

function normalizeStatus(status?: string | null): SubmissionStatus | undefined {
  if (status === "NEW" || status === "READ" || status === "REPLIED" || status === "ARCHIVED") {
    return status;
  }

  return undefined;
}

function normalizeServiceType(serviceType?: string | null) {
  if (!serviceType) return undefined;
  if (SERVICE_ENUM_VALUES.has(serviceType)) return serviceType;
  return SERVICE_ENUM_MAP[serviceType];
}

function cleanUpdateData<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function nullableString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function requiredString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function storeQuoteSubmission(data: QuoteFormData, meta: RequestMeta) {
  const serviceType = SERVICE_ENUM_MAP[data.serviceType];
  const now = new Date().toISOString();

  if (!serviceType) {
    throw new SubmissionStoreError("Unsupported quote service type.");
  }

  try {
    const submission = await prisma.quoteRequest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        serviceType: serviceType as any,
        city: data.city,
        pickupFrequency: data.pickupFrequency,
        message: data.message,
        smsOptIn: data.smsOptIn,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return { id: submission.id, source: "prisma" as const };
  } catch (prismaError) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw toStoreError(prismaError);

    const { data: inserted, error } = await supabase
      .from("quote_requests")
      .insert({
        id: randomUUID(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        serviceType,
        city: data.city,
        pickupFrequency: data.pickupFrequency ?? null,
        message: data.message ?? null,
        smsOptIn: data.smsOptIn,
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .select("id")
      .single();

    if (error) throw toStoreError(error);

    return { id: inserted.id as string, source: "supabase" as const };
  }
}

export async function storeContactSubmission(data: ContactFormData, meta: RequestMeta) {
  const now = new Date().toISOString();

  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return { id: submission.id, source: "prisma" as const };
  } catch (prismaError) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw toStoreError(prismaError);

    const { data: inserted, error } = await supabase
      .from("contact_submissions")
      .insert({
        id: randomUUID(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .select("id")
      .single();

    if (error) throw toStoreError(error);

    return { id: inserted.id as string, source: "supabase" as const };
  }
}

export async function listSubmissions(options: ListOptions): Promise<ListResult> {
  const status = normalizeStatus(options.status);
  const skip = (options.page - 1) * options.limit;

  try {
    if (options.type === "quote") {
      const where = status ? { status } : {};
      const [items, total] = await Promise.all([
        prisma.quoteRequest.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: options.limit,
        }),
        prisma.quoteRequest.count({ where }),
      ]);

      return {
        items,
        total,
        page: options.page,
        pages: Math.ceil(total / options.limit),
        source: "prisma",
      };
    }

    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: options.limit,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return {
      items,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      source: "prisma",
    };
  } catch (prismaError) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw toStoreError(prismaError);

    const table = options.type === "quote" ? "quote_requests" : "contact_submissions";
    let query = supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range(skip, skip + options.limit - 1);

    if (status) query = query.eq("status", status);

    const { data, count, error } = await query;
    if (error) throw toStoreError(error);

    const total = count ?? data?.length ?? 0;

    return {
      items: data ?? [],
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      source: "supabase",
    };
  }
}

export async function updateSubmission({
  id,
  type,
  values,
}: {
  id: string;
  type: SubmissionType;
  values: Record<string, unknown>;
}) {
  const normalizedStatus =
    typeof values.status === "string" ? normalizeStatus(values.status) : undefined;

  if (values.status && !normalizedStatus) {
    throw new SubmissionStoreError("Invalid submission status.");
  }

  const normalizedServiceType =
    type === "quote" && typeof values.serviceType === "string"
      ? normalizeServiceType(values.serviceType)
      : undefined;

  if (type === "quote" && values.serviceType && !normalizedServiceType) {
    throw new SubmissionStoreError("Invalid quote service type.");
  }

  const updateData =
    type === "quote"
      ? cleanUpdateData({
          fullName: requiredString(values.fullName),
          email: requiredString(values.email),
          phone: requiredString(values.phone),
          serviceType: normalizedServiceType,
          city: requiredString(values.city),
          pickupFrequency: nullableString(values.pickupFrequency),
          message: nullableString(values.message),
          smsOptIn: typeof values.smsOptIn === "boolean" ? values.smsOptIn : undefined,
          status: normalizedStatus,
        })
      : cleanUpdateData({
          fullName: requiredString(values.fullName),
          email: requiredString(values.email),
          phone: nullableString(values.phone),
          subject: requiredString(values.subject),
          message: requiredString(values.message),
          status: normalizedStatus,
        });

  if (Object.keys(updateData).length === 0) {
    throw new SubmissionStoreError("No valid submission fields were provided.");
  }

  try {
    if (type === "quote") {
      await prisma.quoteRequest.update({ where: { id }, data: updateData as any });
    } else {
      await prisma.contactSubmission.update({ where: { id }, data: updateData as any });
    }

    return { source: "prisma" as const };
  } catch (prismaError) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw toStoreError(prismaError);

    const table = type === "quote" ? "quote_requests" : "contact_submissions";
    const { error } = await supabase
      .from(table)
      .update({ ...updateData, updatedAt: new Date().toISOString() })
      .eq("id", id);

    if (error) throw toStoreError(error);

    return { source: "supabase" as const };
  }
}

export async function updateSubmissionStatus({
  id,
  type,
  status,
}: {
  id: string;
  type: SubmissionType;
  status: string;
}) {
  return updateSubmission({ id, type, values: { status } });
}

export async function deleteSubmission({ id, type }: { id: string; type: SubmissionType }) {
  try {
    if (type === "quote") {
      await prisma.quoteRequest.delete({ where: { id } });
    } else {
      await prisma.contactSubmission.delete({ where: { id } });
    }

    return { source: "prisma" as const };
  } catch (prismaError) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw toStoreError(prismaError);

    const table = type === "quote" ? "quote_requests" : "contact_submissions";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw toStoreError(error);

    return { source: "supabase" as const };
  }
}
