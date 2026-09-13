import { PrismaClient } from "@prisma/client";

// Neon Vercel integration may prefix vars (e.g. citywaste_DATABASE_URL).
// Prefer explicit DATABASE_URL / DIRECT_URL; fall back to integration names.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.citywaste_DATABASE_URL ||
    process.env.citywaste_POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.citywaste_DATABASE_URL_UNPOOLED ||
    process.env.citywaste_POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    "";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
