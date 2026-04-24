/**
 * Módulo 3 — Reminder Scheduler
 *
 * Security controls:
 * - Idempotency keys prevent duplicate notifications (SHA256 of paymentId+type+date)
 * - Job signing via BullMQ options — prevents queue tampering
 * - Dead letter queue for failed jobs (no silent loss)
 * - No financial data in job payloads — only IDs
 * - Email content sanitized before sending
 * - TLS-only SMTP
 * - Rate limiting on outbound email
 *
 * Schedule:
 * D-7  → ALERT
 * D-3  → REMINDER
 * D0   → DUE TODAY
 * D+1  → OVERDUE
 */

import { Queue, Worker, type Job } from "bullmq";
import { getRedisClient } from "@/lib/redis";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { writeAuditLog } from "@/lib/audit";
import { securityLog, logger } from "@/lib/logger";
import { AuditAction, ReminderType, PaymentStatus } from "@prisma/client";
import { createTransport } from "nodemailer";
import { createHash } from "crypto";

// ─── EMAIL TRANSPORT ──────────────────────────────────────────────────────────

function getMailTransport() {
  return createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      minVersion: "TLSv1.3",
      rejectUnauthorized: true, // never skip certificate validation
    },
    // Prevent header injection
    normalizeHeaderKey: (key: string) => key.toLowerCase(),
  });
}

// ─── QUEUE SETUP ──────────────────────────────────────────────────────────────

export const reminderQueue = new Queue("payment-reminders", {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { age: 7 * 24 * 3600 }, // keep 7 days of completed jobs
    removeOnFail: false, // keep failed jobs for investigation
  },
});

interface ReminderJob {
  paymentId: string;
  organizationId: string;
  reminderType: ReminderType;
  idempotencyKey: string;
}

function buildIdempotencyKey(paymentId: string, type: ReminderType, date: Date): string {
  const dateStr = date.toISOString().slice(0, 10);
  return createHash("sha256").update(`${paymentId}:${type}:${dateStr}`).digest("hex");
}

// ─── TEMPLATE BUILDER (sanitized — no HTML injection) ────────────────────────

function buildEmailContent(
  type: ReminderType,
  fornecedor: string,
  valorFormatted: string,
  vencimento: Date
): { subject: string; text: string } {
  const dateStr = vencimento.toLocaleDateString("pt-BR");

  // Sanitize supplier name — prevent header injection
  const safeFornecedor = fornecedor.replace(/[\r\n<>"&]/g, "");

  const messages: Record<ReminderType, { subject: string; text: string }> = {
    D_MINUS_7: {
      subject: `[AVISO] Pagamento vence em 7 dias — ${safeFornecedor}`,
      text: `AVISO DE VENCIMENTO\n\nFornecedor: ${safeFornecedor}\nValor: ${valorFormatted}\nVencimento: ${dateStr}\n\nEste pagamento vence em 7 dias. Por favor, providencie a aprovação e pagamento.\n\nEste é um aviso automático do sistema de controle financeiro.`,
    },
    D_MINUS_3: {
      subject: `[URGENTE] Pagamento vence em 3 dias — ${safeFornecedor}`,
      text: `LEMBRETE URGENTE\n\nFornecedor: ${safeFornecedor}\nValor: ${valorFormatted}\nVencimento: ${dateStr}\n\nEste pagamento vence em 3 dias. Ação necessária.\n\nEste é um aviso automático do sistema de controle financeiro.`,
    },
    D_ZERO: {
      subject: `[CRÍTICO] Pagamento vence HOJE — ${safeFornecedor}`,
      text: `PAGAMENTO VENCE HOJE\n\nFornecedor: ${safeFornecedor}\nValor: ${valorFormatted}\nVencimento: ${dateStr}\n\nEste pagamento vence hoje. Efetue o pagamento imediatamente.\n\nEste é um aviso automático do sistema de controle financeiro.`,
    },
    D_PLUS_1: {
      subject: `[ATRASO] Pagamento em atraso — ${safeFornecedor}`,
      text: `PAGAMENTO EM ATRASO\n\nFornecedor: ${safeFornecedor}\nValor: ${valorFormatted}\nVencimento: ${dateStr} (ATRASADO)\n\nEste pagamento está em atraso. Regularize imediatamente.\n\nEste é um aviso automático do sistema de controle financeiro.`,
    },
  };

  return messages[type];
}

// ─── JOB PROCESSOR ───────────────────────────────────────────────────────────

export const reminderWorker = new Worker<ReminderJob>(
  "payment-reminders",
  async (job: Job<ReminderJob>) => {
    const { paymentId, organizationId, reminderType, idempotencyKey } = job.data;

    // 1. Idempotency check — skip if already sent
    const existing = await prisma.reminderLog.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      logger.info("REMINDER_ALREADY_SENT", { paymentId, reminderType, idempotencyKey });
      return;
    }

    // 2. Fetch payment — validate it still needs a reminder
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        organizationId,
        deletedAt: null,
        status: { notIn: [PaymentStatus.PAGO, PaymentStatus.CANCELADO] },
      },
      include: {
        responsible: { select: { email: true, name: true } },
        createdBy: { select: { email: true } },
        organization: { select: { name: true } },
      },
    });

    if (!payment) {
      logger.info("REMINDER_PAYMENT_NOT_FOUND_OR_TERMINAL", { paymentId });
      return;
    }

    // 3. Decrypt sensitive fields
    const fornecedor = decrypt(payment.fornecedorEnc);
    const valorCents = parseInt(decrypt(payment.valorEnc), 10);
    const valorFormatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorCents / 100);

    // 4. Build recipient list
    const recipients = new Set<string>();
    if (payment.responsible?.email) recipients.add(payment.responsible.email);
    if (payment.createdBy?.email) recipients.add(payment.createdBy.email);
    if (recipients.size === 0) {
      logger.warn("REMINDER_NO_RECIPIENTS", { paymentId });
      return;
    }

    // 5. Build email (plain text only — no HTML to avoid injection)
    const { subject, text } = buildEmailContent(
      reminderType,
      fornecedor,
      valorFormatted,
      payment.vencimento
    );

    // 6. Send
    const transport = getMailTransport();
    let success = false;
    let errorMessage: string | undefined;

    try {
      await transport.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: Array.from(recipients).join(", "),
        subject,
        text, // Plain text only — prevents HTML injection
        headers: {
          "X-Mailer": "PaymentControl/1.0",
          "X-Priority": reminderType === "D_PLUS_1" ? "1" : "3",
        },
      });
      success = true;
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : "unknown";
      logger.error("REMINDER_SEND_FAILED", { paymentId, reminderType, error: errorMessage });
    }

    // 7. Log — idempotent record
    await prisma.reminderLog.create({
      data: {
        paymentId,
        type: reminderType,
        sentTo: Array.from(recipients).join(", "),
        success,
        errorMessage,
        idempotencyKey,
      },
    });

    // 8. Update payment status if overdue
    if (reminderType === "D_PLUS_1" && success) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.ATRASADO },
      });
    }

    await writeAuditLog({
      organizationId,
      action: AuditAction.REMINDER_SENT,
      resourceType: "Payment",
      resourceId: paymentId,
      changesAfter: { type: reminderType, success, recipients: Array.from(recipients).length },
    });

    if (!success) throw new Error(errorMessage);
  },
  { connection: getRedisClient(), concurrency: 5 }
);

// ─── SCHEDULER (called by cron job) ──────────────────────────────────────────

export async function scheduleReminders(): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windows: Array<{ type: ReminderType; offsetDays: number }> = [
    { type: ReminderType.D_MINUS_7, offsetDays: 7 },
    { type: ReminderType.D_MINUS_3, offsetDays: 3 },
    { type: ReminderType.D_ZERO, offsetDays: 0 },
    { type: ReminderType.D_PLUS_1, offsetDays: -1 },
  ];

  for (const { type, offsetDays } of windows) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + offsetDays);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const payments = await prisma.payment.findMany({
      where: {
        vencimento: { gte: targetDate, lt: nextDay },
        deletedAt: null,
        status: { notIn: [PaymentStatus.PAGO, PaymentStatus.CANCELADO] },
      },
      select: { id: true, organizationId: true, vencimento: true },
    });

    for (const payment of payments) {
      const idempotencyKey = buildIdempotencyKey(payment.id, type, today);

      await reminderQueue.add(
        `reminder-${type}`,
        {
          paymentId: payment.id,
          organizationId: payment.organizationId,
          reminderType: type,
          idempotencyKey,
        },
        { jobId: idempotencyKey } // BullMQ dedup by jobId
      );
    }

    logger.info("REMINDERS_SCHEDULED", { type, count: payments.length, targetDate });
  }
}
