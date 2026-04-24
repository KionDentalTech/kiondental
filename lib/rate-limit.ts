/**
 * Rate limiting using rate-limiter-flexible with Redis backend.
 *
 * Tiers:
 * - Global: 100 req/min per IP
 * - Auth endpoints: 5 attempts/min per IP (prevents brute force)
 * - API writes: 30 req/min per authenticated user
 * - Email ingest: 10 emails/min per sender
 */

import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { getRedisClient } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

function buildLimiter(keyPrefix: string, points: number, durationSec: number) {
  return new RateLimiterRedis({
    storeClient: getRedisClient(),
    keyPrefix,
    points,
    duration: durationSec,
    blockDuration: durationSec, // block for same window if exhausted
  });
}

// Lazy singletons — only init when Redis is available
let globalLimiter: RateLimiterRedis;
let authLimiter: RateLimiterRedis;
let writeLimiter: RateLimiterRedis;
let emailLimiter: RateLimiterRedis;

function getLimiters() {
  if (!globalLimiter) {
    const window = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? "60000", 10) / 1000;
    const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "100", 10);
    const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX ?? "5", 10);

    globalLimiter = buildLimiter("global", max, window);
    authLimiter   = buildLimiter("auth", authMax, window);
    writeLimiter  = buildLimiter("writes", 30, window);
    emailLimiter  = buildLimiter("email", 10, window);
  }
  return { globalLimiter, authLimiter, writeLimiter, emailLimiter };
}

function getClientIp(req: NextRequest): string {
  // Cloudflare / reverse proxy headers — validate these are actually set by proxy
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function rateLimitResponse(res: RateLimiterRes): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.round(res.msBeforeNext / 1000) || 1),
        "X-RateLimit-Limit": "N/A",
        "X-RateLimit-Remaining": String(res.remainingPoints ?? 0),
      },
    }
  );
}

export async function applyGlobalRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  try {
    await getLimiters().globalLimiter.consume(ip);
    return null;
  } catch (err) {
    if (err instanceof RateLimiterRes) return rateLimitResponse(err);
    throw err;
  }
}

export async function applyAuthRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  try {
    await getLimiters().authLimiter.consume(ip);
    return null;
  } catch (err) {
    if (err instanceof RateLimiterRes) return rateLimitResponse(err);
    throw err;
  }
}

export async function applyWriteRateLimit(userId: string): Promise<NextResponse | null> {
  try {
    await getLimiters().writeLimiter.consume(userId);
    return null;
  } catch (err) {
    if (err instanceof RateLimiterRes) return rateLimitResponse(err);
    throw err;
  }
}

export async function applyEmailRateLimit(sender: string): Promise<NextResponse | null> {
  try {
    await getLimiters().emailLimiter.consume(sender);
    return null;
  } catch (err) {
    if (err instanceof RateLimiterRes) return rateLimitResponse(err);
    throw err;
  }
}
