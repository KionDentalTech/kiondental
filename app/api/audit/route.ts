/**
 * GET /api/audit — Audit trail access
 * Admin-only endpoint. Returns paginated audit log with decrypted metadata.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth, type AuthContext } from "@/lib/api-handler";
import { prisma } from "@/lib/db";
import { assertPermission } from "@/lib/rbac";
import { decrypt } from "@/lib/crypto";
import { z } from "zod";

const AuditQuerySchema = z.object({
  page:         z.coerce.number().int().min(1).default(1),
  pageSize:     z.coerce.number().int().min(1).max(100).default(50),
  userId:       z.string().cuid().optional(),
  resourceType: z.string().max(50).optional(),
  resourceId:   z.string().max(30).optional(),
  from:         z.string().datetime().optional(),
  to:           z.string().datetime().optional(),
});

export const GET = withAuth(async (req: NextRequest, ctx: AuthContext) => {
  assertPermission(ctx.role, "audit:read");

  const { searchParams } = req.nextUrl;
  const query = AuditQuerySchema.parse(Object.fromEntries(searchParams));

  const where = {
    organizationId: ctx.organizationId,
    ...(query.userId && { userId: query.userId }),
    ...(query.resourceType && { resourceType: query.resourceType }),
    ...(query.resourceId && { resourceId: query.resourceId }),
    ...(query.from || query.to
      ? {
          timestamp: {
            ...(query.from && { gte: new Date(query.from) }),
            ...(query.to && { lte: new Date(query.to) }),
          },
        }
      : {}),
  };

  const [total, logs] = await prisma.$transaction([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        resourceType: true,
        resourceId: true,
        timestamp: true,
        userAgent: true,
        user: { select: { name: true, email: true, role: true } },
        // encrypted fields decrypted below
        ipAddress: true,
        changesBefore: true,
        changesAfter: true,
        integrityHash: true,
      },
      orderBy: { timestamp: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  // Decrypt IP addresses and change diffs for admin view
  const decryptedLogs = logs.map((log) => ({
    ...log,
    ipAddress: log.ipAddress ? safeDecrypt(log.ipAddress) : null,
    changesBefore: log.changesBefore ? safeDecryptJson(log.changesBefore) : null,
    changesAfter: log.changesAfter ? safeDecryptJson(log.changesAfter) : null,
  }));

  return NextResponse.json({
    data: decryptedLogs,
    meta: { total, page: query.page, pageSize: query.pageSize },
  });
});

function safeDecrypt(value: string): string {
  try { return decrypt(value); } catch { return "[decrypt error]"; }
}

function safeDecryptJson(value: string): unknown {
  try { return JSON.parse(decrypt(value)); } catch { return null; }
}
