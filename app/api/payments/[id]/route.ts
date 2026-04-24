/**
 * /api/payments/[id] — Get, Update, Delete single payment
 *
 * IDOR prevention: always scope to organizationId + check ownership.
 * Encrypted fields are decrypted only on explicit detail fetch (GET).
 * Diff stored in audit log on every mutation.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth, type AuthContext } from "@/lib/api-handler";
import { prisma } from "@/lib/db";
import { assertPermission } from "@/lib/rbac";
import { encrypt, paymentDeduplicationHash, decrypt } from "@/lib/crypto";
import { writeAuditLog, auditPaymentChange } from "@/lib/audit";
import { UpdatePaymentSchema } from "@/lib/validation";
import { AuditAction, PaymentStatus } from "@prisma/client";
import { applyWriteRateLimit } from "@/lib/rate-limit";

type RouteCtx = { params: { id: string } };

// GET /api/payments/[id]
export const GET = withAuth(async (req: NextRequest, ctx: AuthContext, { params }: RouteCtx) => {
  assertPermission(ctx.role, "payment:read");

  const payment = await prisma.payment.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId, deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      costCenter: { select: { id: true, code: true, name: true } },
      responsible: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      approvedBy: { select: { id: true, name: true } },
      attachments: {
        where: { scanStatus: "CLEAN" }, // never expose unscanned/malicious attachments
        select: { id: true, originalName: true, mimeType: true, sizeBytes: true, createdAt: true },
      },
      reminders: {
        orderBy: { sentAt: "desc" },
        take: 10,
        select: { type: true, sentAt: true, success: true },
      },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // Decrypt sensitive fields for response
  const decrypted = {
    ...payment,
    fornecedor: decrypt(payment.fornecedorEnc),
    valorCents: parseInt(decrypt(payment.valorEnc), 10),
    observacoes: payment.observacoesEnc ? decrypt(payment.observacoesEnc) : null,
    // Strip raw encrypted fields from response
    fornecedorEnc: undefined,
    valorEnc: undefined,
    observacoesEnc: undefined,
    deduplicationHash: undefined, // never expose
  };

  return NextResponse.json(decrypted);
});

// PATCH /api/payments/[id]
export const PATCH = withAuth(async (req: NextRequest, ctx: AuthContext, { params }: RouteCtx) => {
  assertPermission(ctx.role, "payment:update");

  const rateLimitRes = await applyWriteRateLimit(ctx.userId);
  if (rateLimitRes) return rateLimitRes;

  const existing = await prisma.payment.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId, deletedAt: null },
  });

  if (!existing) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const body = await req.json();
  const input = UpdatePaymentSchema.parse(body);

  // Prevent unauthorized status transitions
  if (input.status) {
    const allowedTransitions: Record<string, string[]> = {
      RASCUNHO:   ["PENDENTE", "CANCELADO"],
      PENDENTE:   ["APROVADO", "CANCELADO", "SUSPENSO"],
      APROVADO:   ["PAGO", "CANCELADO", "SUSPENSO"],
      ATRASADO:   ["PAGO", "CANCELADO"],
      PAGO:       [], // terminal state — cannot be changed without admin
      CANCELADO:  [], // terminal state
    };
    const current = existing.status;
    if (!allowedTransitions[current]?.includes(input.status)) {
      return NextResponse.json(
        { error: `Invalid status transition: ${current} → ${input.status}` },
        { status: 422 }
      );
    }
  }

  const updateData: Record<string, unknown> = {};
  let newDedupHash = existing.deduplicationHash;

  if (input.fornecedor !== undefined || input.valorCents !== undefined || input.vencimento !== undefined) {
    const currentFornecedor = input.fornecedor ?? decrypt(existing.fornecedorEnc);
    const currentValor = input.valorCents ?? parseInt(decrypt(existing.valorEnc), 10);
    const currentVenc = input.vencimento ?? existing.vencimento;

    newDedupHash = paymentDeduplicationHash(currentFornecedor, currentValor, currentVenc);

    // Check dedup collision (excluding current record)
    const collision = await prisma.payment.findFirst({
      where: { deduplicationHash: newDedupHash, id: { not: params.id } },
      select: { id: true },
    });
    if (collision) {
      return NextResponse.json({ error: "Update would create a duplicate payment" }, { status: 409 });
    }

    if (input.fornecedor) updateData.fornecedorEnc = encrypt(input.fornecedor);
    if (input.valorCents) updateData.valorEnc = encrypt(input.valorCents.toString());
    updateData.deduplicationHash = newDedupHash;
  }

  if (input.vencimento) updateData.vencimento = input.vencimento;
  if (input.observacoes !== undefined) {
    updateData.observacoesEnc = input.observacoes ? encrypt(input.observacoes) : null;
  }
  if (input.status) updateData.status = input.status;
  if (input.recorrencia) updateData.recorrencia = input.recorrencia;
  if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
  if (input.costCenterId !== undefined) updateData.costCenterId = input.costCenterId;
  if (input.responsibleId !== undefined) updateData.responsibleId = input.responsibleId;
  if (input.status === PaymentStatus.PAGO) updateData.paidAt = new Date();

  const updated = await prisma.payment.update({
    where: { id: params.id },
    data: updateData,
    select: { id: true, status: true, vencimento: true, updatedAt: true },
  });

  await auditPaymentChange(
    {
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: AuditAction.UPDATE,
      ipAddress: ctx.ipAddress,
      sessionId: ctx.sessionId,
      resourceId: params.id,
    },
    {
      status: existing.status,
      vencimento: existing.vencimento.toISOString(),
      recorrencia: existing.recorrencia,
    },
    {
      status: updated.status,
      vencimento: updated.vencimento.toISOString(),
      ...input,
    }
  );

  return NextResponse.json(updated);
});

// DELETE /api/payments/[id] — soft delete only
export const DELETE = withAuth(async (req: NextRequest, ctx: AuthContext, { params }: RouteCtx) => {
  assertPermission(ctx.role, "payment:delete");

  const rateLimitRes = await applyWriteRateLimit(ctx.userId);
  if (rateLimitRes) return rateLimitRes;

  const existing = await prisma.payment.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId, deletedAt: null },
    select: { id: true, status: true, vencimento: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // Block deletion of PAGO payments — financial integrity
  if (existing.status === "PAGO") {
    return NextResponse.json(
      { error: "Paid payments cannot be deleted. Use cancellation instead." },
      { status: 422 }
    );
  }

  await prisma.payment.update({
    where: { id: params.id },
    data: { deletedAt: new Date(), deletedById: ctx.userId },
  });

  await writeAuditLog({
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    action: AuditAction.DELETE,
    resourceType: "Payment",
    resourceId: params.id,
    changesBefore: { status: existing.status, vencimento: existing.vencimento },
    ipAddress: ctx.ipAddress,
    sessionId: ctx.sessionId,
  });

  return new NextResponse(null, { status: 204 });
});
