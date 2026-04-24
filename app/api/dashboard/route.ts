/**
 * GET /api/dashboard
 *
 * Returns aggregated payment metrics.
 * Security: scoped to org, no decryption of individual records,
 * returns only counts/aggregates — not raw encrypted values.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth, type AuthContext } from "@/lib/api-handler";
import { prisma } from "@/lib/db";
import { assertPermission } from "@/lib/rbac";
import { PaymentStatus } from "@prisma/client";
import { addDays, startOfDay, endOfDay } from "date-fns";

export const GET = withAuth(async (_req: NextRequest, ctx: AuthContext) => {
  assertPermission(ctx.role, "dashboard:read");

  const today = startOfDay(new Date());
  const in7Days = endOfDay(addDays(today, 7));
  const in30Days = endOfDay(addDays(today, 30));

  const orgFilter = { organizationId: ctx.organizationId, deletedAt: null };

  const [
    statusCounts,
    overdueCount,
    dueSoon7,
    dueSoon30,
    recentByCategory,
    pendingReview,
  ] = await prisma.$transaction([
    // Count by status
    prisma.payment.groupBy({
      by: ["status"],
      where: orgFilter,
      _count: { id: true },
    }),

    // Overdue
    prisma.payment.count({
      where: {
        ...orgFilter,
        status: PaymentStatus.ATRASADO,
      },
    }),

    // Due in 7 days
    prisma.payment.count({
      where: {
        ...orgFilter,
        status: { in: [PaymentStatus.PENDENTE, PaymentStatus.APROVADO] },
        vencimento: { gte: today, lte: in7Days },
      },
    }),

    // Due in 30 days
    prisma.payment.count({
      where: {
        ...orgFilter,
        status: { in: [PaymentStatus.PENDENTE, PaymentStatus.APROVADO] },
        vencimento: { gte: today, lte: in30Days },
      },
    }),

    // Breakdown by category (count only, no values)
    prisma.payment.groupBy({
      by: ["categoryId"],
      where: { ...orgFilter, status: { not: PaymentStatus.CANCELADO } },
      _count: { id: true },
    }),

    // Email ingestions awaiting review
    prisma.emailIngestion.count({
      where: {
        organizationId: ctx.organizationId,
        requiresReview: true,
        reviewedAt: null,
      },
    }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.id])
  );

  return NextResponse.json({
    summary: {
      total: Object.values(statusMap).reduce((a, b) => a + b, 0),
      byStatus: statusMap,
      overdue: overdueCount,
      dueSoon7,
      dueSoon30,
      pendingEmailReview: pendingReview,
    },
    byCategory: recentByCategory,
    generatedAt: new Date().toISOString(),
  });
});
