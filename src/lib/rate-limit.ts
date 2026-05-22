import { Ratelimit } from "@upstash/ratelimit";
import { Redis }     from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// ─── Redis client ─────────────────────────────────────────────────────────────
let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

// ─── Rate limiters ────────────────────────────────────────────────────────────

/** Quote / Contact forms: 5 requests per 10 minutes per IP */
export const formRatelimit = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix:    "wq:form",
});

/** Newsletter: 3 per hour per IP */
export const newsletterRatelimit = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix:    "wq:newsletter",
});

/** Stripe webhook: 100 per minute (Stripe sends many) */
export const webhookRatelimit = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix:    "wq:webhook",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitResponse(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After":       String(retryAfter),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
