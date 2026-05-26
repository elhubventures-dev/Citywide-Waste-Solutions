import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending?: Promise<unknown>;
};

type RateLimiter = {
  limit: (identifier: string) => Promise<RateLimitResult>;
};

// ─── Redis client ─────────────────────────────────────────────────────────────
let redis: Redis | null = null;

function hasUsableValue(value: string | undefined): value is string {
  return Boolean(
    value &&
    !value.includes("...") &&
    !value.includes("[") &&
    !value.toLowerCase().includes("placeholder") &&
    !value.toLowerCase().startsWith("your_") &&
    !value.toLowerCase().startsWith("your-")
  );
}

function isUpstashConfigured() {
  return (
    hasUsableValue(process.env.UPSTASH_REDIS_REST_URL) &&
    hasUsableValue(process.env.UPSTASH_REDIS_REST_TOKEN) &&
    /^https?:\/\//.test(process.env.UPSTASH_REDIS_REST_URL)
  );
}

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

function allowWithoutRateLimit(): RateLimitResult {
  return {
    success: true,
    limit: 0,
    remaining: 0,
    reset: Date.now(),
    pending: Promise.resolve(),
  };
}

function createRateLimiter(
  limit: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string
): RateLimiter {
  let ratelimit: Ratelimit | null = null;

  return {
    async limit(identifier: string) {
      if (!isUpstashConfigured()) {
        return allowWithoutRateLimit();
      }

      ratelimit ??= new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(limit, window),
        analytics: true,
        prefix,
      });

      try {
        return await ratelimit.limit(identifier);
      } catch {
        // Keep lead capture available if the external rate-limit service is unavailable.
        return allowWithoutRateLimit();
      }
    },
  };
}

// ─── Rate limiters ────────────────────────────────────────────────────────────

/** Quote / Contact forms: 5 requests per 10 minutes per IP */
export const formRatelimit = createRateLimiter(5, "10 m", "wq:form");

/** Newsletter: 3 per hour per IP */
export const newsletterRatelimit = createRateLimiter(3, "1 h", "wq:newsletter");

/** Stripe webhook: 100 per minute (Stripe sends many) */
export const webhookRatelimit = createRateLimiter(100, "1 m", "wq:webhook");

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitResponse(reset: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
