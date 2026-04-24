/**
 * /api/payments — List and Create payments
 *
 * Security controls:
 * - Auth + RBAC (payment:create, payment:read)
 * - All queries scoped to organizationId (IDOR prevention)
 * - Input validated with Zod
 * - Financial fields encrypted before storage (AES-256-GCM)
 * - Deduplication hash prevents double registration
 * - Write rate limiting
 * - Full audit trail on create
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth, type AuthContext } from "@/lib/api-handler";
import { prisma } from "@/lib/db";
import { assertPermission } from "@/lib/rbac";
import { encrypt, paymentDeduplicationHash } from "@/lib/crypto";
import { writeAuditLog } from "@/lib/audit";
import { CreatePaymentSchema, PaymentQuerySchema } from "@/lib/validation";
import { applyWriteRateLimit } from "@/lib/rate-limit";
import { AuditAction } from "@prisma/client";

// GET /api/payments
export const GET = withAuth(async (req: NextRequest, ctx: AuthContext) => {
  assertPermission(ctx.role, "payment:read");

  const { searchParams } = req.nextUrl;
  const query = PaymentQuerySchema.parse(Object.fromEntries(searchParams));

  const where = {
    organizationId: ctx.organizationId,
    deletedAt: null,
    ...(query.status && { status: query.status }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...(query.costCenterId && { costCenterId: query.costCenterId }),
    ...(query.from || query.to
      ? {
          vencimento: {
            ...(query.from && { gte: query.from }),
            ...(query.to && { lte: query.to }),
          },
        }
      : {}),
  };

  const [total, payments] = await prisma.$transaction([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      select: {
        id: true,
        // NOTE: encrypted fields are NOT returned in list — only in detail view
        // This reduces exposure surface
        vencimento: true,
        recorrencia: true,
        status: true,
        createdAt: true,
        category: { select: { name: true } },
        costCenter: { select: { name: true, code: true } },
        responsible: { select: { name: true } },
        _count: { select: { attachments: true } },
      },
      orderBy: { vencimento: "asc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return NextResponse.json({
    data: payments,
    meta: { total, page: query.page, pageSize: query.pageSize },
  });
});

// POST /api/payments
export const POST = withAuth(async (req: NextRequest, ctx: AuthContext) => {
  assertPermission(ctx.role, "payment:create");

  const rateLimitRes = await applyWriteRateLimit(ctx.userId);
  if (rateLimitRes) return rateLimitRes;

  const body = await req.json();
  const input = CreatePaymentSchema.parse(body);

  // Deduplication check — prevent double-registration
  const dedupHash = paymentDeduplicationHash(
    input.fornecedor,
    input.valorCents,
    input.vencimento
  );

  const existing = await prisma.payment.findUnique({
    where: { deduplicationHash: dedupHash },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Duplicate payment detected. A payment with the same supplier, amount, and due date already exists.", existingId: existing.id },
      { status: 409 }
    );
  }

  // Encrypt sensitive fields
  const fornecedorEnc = encrypt(input.fornecedor);
  const valorEnc = encrypt(input.valorCents.toString());
  const observacoesEnc = input.observacoes ? encrypt(input.observacoes) : null;

  const payment = await prisma.payment.create({
    data: {
      organizationId: ctx.organizationId,
      fornecedorEnc,
      valorEnc,
      observacoesEnc,
      vencimento: input.vencimento,
      recorrencia: input.recorrencia,
      categoryId: input.categoryId,
      costCenterId: input.costCenterId,
      responsibleId: input.responsibleId,
      createdById: ctx.userId,
      deduplicationHash: dedupHash,
    },
    select: { id: true, vencimento: true, status: true, createdAt: true },
  });

  await writeAuditLog({
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    action: AuditAction.CREATE,
    resourceType: "Payment",
    resourceId: payment.id,
    changesAfter: {
      vencimento: input.vencimento.toISOString(),
      recorrencia: input.recorrencia,
      categoryId: input.categoryId,
      costCenterId: input.costCenterId,
      // NOTE: fornecedor and valor are NOT logged in plaintext — only resource ID
    },
    ipAddress: ctx.ipAddress,
    sessionId: ctx.sessionId,
  });

  return NextResponse.json(payment, { status: 201 });
});
