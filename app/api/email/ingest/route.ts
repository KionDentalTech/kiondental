/**
 * POST /api/email/ingest
 *
 * Webhook endpoint called by the IMAP poller or email gateway.
 *
 * Security:
 * - HMAC-SHA256 signature verification (not just auth token)
 * - Rate limiting per sender
 * - No raw email body stored
 * - All processing delegated to isolated service
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { processIncomingEmail } from "@/services/email-parser";
import { applyEmailRateLimit } from "@/lib/rate-limit";
import { securityLog, logger } from "@/lib/logger";
import { EmailIngestSchema } from "@/lib/validation";
import { ZodError } from "zod";

function verifyHmacSignature(body: string, signature: string): boolean {
  const secret = process.env.EMAIL_WEBHOOK_SECRET;
  if (!secret) throw new Error("EMAIL_WEBHOOK_SECRET not configured");

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuf = Buffer.from(`sha256=${expected}`);
  const receivedBuf = Buffer.from(signature);

  if (expectedBuf.length !== receivedBuf.length) return false;
  return timingSafeEqual(expectedBuf, receivedBuf);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature") ?? "";

  // 1. Verify HMAC signature — prevents replay and unauthorized injection
  if (!verifyHmacSignature(rawBody, signature)) {
    securityLog("EMAIL_WEBHOOK_INVALID_SIGNATURE", {
      ip: req.headers.get("x-forwarded-for") ?? "unknown",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Validate and extract organizationId from payload
  // In production this comes from the IMAP poller which knows the org
  const orgId = (payload as Record<string, unknown>).organizationId as string | undefined;
  if (!orgId || typeof orgId !== "string") {
    return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
  }

  // 3. Rate limit per sender
  let fromAddress: string;
  try {
    const partial = EmailIngestSchema.pick({ fromAddress: true }).parse(payload);
    fromAddress = partial.fromAddress;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const rateLimitRes = await applyEmailRateLimit(fromAddress);
  if (rateLimitRes) return rateLimitRes;

  // 4. Process
  try {
    const result = await processIncomingEmail({
      ...(payload as Parameters<typeof processIncomingEmail>[0]),
      organizationId: orgId,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.flatten() }, { status: 422 });
    }
    logger.error("EMAIL_INGEST_ERROR", {
      error: err instanceof Error ? err.message : "unknown",
      from: fromAddress,
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
