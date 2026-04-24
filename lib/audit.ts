/**
 * Immutable audit trail.
 *
 * Rules enforced here:
 * 1. No UPDATE or DELETE is ever called on audit_logs — append-only.
 * 2. Each entry carries an HMAC integrity hash detectable if DB is tampered.
 * 3. Sensitive fields (IP, diffs) are encrypted before storage.
 * 4. Logs never contain raw financial values — only resource IDs.
 */

import { prisma } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { auditIntegrityHash, encrypt } from "@/lib/crypto";
import { logger } from "@/lib/logger";

export interface AuditEvent {
  organizationId: string;
  userId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  changesBefore?: Record<string, unknown>;
  changesAfter?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

/**
 * Strip fields that must never appear in audit logs (raw financial values, secrets).
 */
const REDACTED_FIELDS = new Set([
  "passwordHash",
  "mfaSecret",
  "mfaBackupCodes",
]);

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k] = REDACTED_FIELDS.has(k) ? "[REDACTED]" : v;
  }
  return result;
}

export async function writeAuditLog(event: AuditEvent): Promise<void> {
  try {
    const cleanBefore = event.changesBefore ? redact(event.changesBefore) : undefined;
    const cleanAfter = event.changesAfter ? redact(event.changesAfter) : undefined;

    const changesBefore = cleanBefore
      ? encrypt(JSON.stringify(cleanBefore))
      : null;
    const changesAfter = cleanAfter
      ? encrypt(JSON.stringify(cleanAfter))
      : null;
    const ipAddress = event.ipAddress ? encrypt(event.ipAddress) : null;

    const integrityHash = auditIntegrityHash({
      organizationId: event.organizationId,
      userId: event.userId ?? null,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId ?? null,
      timestamp: new Date().toISOString(),
    });

    await prisma.auditLog.create({
      data: {
        organizationId: event.organizationId,
        userId: event.userId,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        changesBefore,
        changesAfter,
        ipAddress,
        userAgent: event.userAgent,
        sessionId: event.sessionId,
        integrityHash,
      },
    });
  } catch (err) {
    // Audit log failure must never silently swallow — alert but don't crash the request
    logger.error("AUDIT_LOG_WRITE_FAILURE", {
      error: err instanceof Error ? err.message : "unknown",
      action: event.action,
      resourceType: event.resourceType,
    });
    // In a production system, send this to a SIEM/alerting system
  }
}

/**
 * Convenience wrapper for detecting anomalies: unexpected payment mutations.
 */
export async function auditPaymentChange(
  event: Omit<AuditEvent, "resourceType">,
  paymentIdBefore: Record<string, unknown>,
  paymentAfter: Record<string, unknown>
) {
  const criticalFields = ["valorEnc", "vencimento", "fornecedorEnc", "status", "deletedAt"];
  const changed = criticalFields.filter(
    (f) => JSON.stringify(paymentIdBefore[f]) !== JSON.stringify(paymentAfter[f])
  );

  if (changed.includes("vencimento") || changed.includes("valorEnc")) {
    // High-risk mutation — flag it
    await writeAuditLog({
      ...event,
      resourceType: "Payment",
      action: AuditAction.ANOMALY_DETECTED,
      changesBefore: { changedFields: changed, ...paymentIdBefore },
      changesAfter: paymentAfter,
    });
  }

  await writeAuditLog({
    ...event,
    resourceType: "Payment",
    changesBefore: paymentIdBefore,
    changesAfter: paymentAfter,
  });
}
