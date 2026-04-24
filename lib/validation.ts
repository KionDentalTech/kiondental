/**
 * Zod schemas for all API inputs.
 *
 * Security rules:
 * - Use z.string().trim() to prevent leading/trailing whitespace injection
 * - Explicit max lengths to prevent DoS via large payloads
 * - Strict enum validation — no unexpected values pass through
 * - Monetary values stored as integers (cents) to avoid floating-point fraud
 * - Dates validated as ISO strings then converted to Date objects
 */

import { z } from "zod";
import { PaymentStatus, RecorrenciaType } from "@prisma/client";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// ─── SANITIZATION ────────────────────────────────────────────────────────────

const { window } = new JSDOM("");
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

/**
 * Strip all HTML tags from a string. Prevents XSS in stored data.
 */
export function sanitizeText(input: string): string {
  return purify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

const SafeString = (maxLen = 255) =>
  z.string().trim().min(1).max(maxLen).transform(sanitizeText);

const OptionalSafeString = (maxLen = 255) =>
  z.string().trim().max(maxLen).transform(sanitizeText).optional();

// Monetary value in cents — avoids float precision fraud
// E.g. R$ 1.234,56 → 123456
const MonetaryValueCents = z.number().int().positive().max(999_999_999_99);

const ISODate = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .transform((s) => new Date(s));

// ─── PAYMENT SCHEMAS ─────────────────────────────────────────────────────────

export const CreatePaymentSchema = z.object({
  fornecedor:     SafeString(200),
  valorCents:     MonetaryValueCents,
  vencimento:     ISODate,
  recorrencia:    z.nativeEnum(RecorrenciaType).default(RecorrenciaType.AVULSO),
  categoryId:     z.string().cuid().optional(),
  costCenterId:   z.string().cuid().optional(),
  responsibleId:  z.string().cuid().optional(),
  observacoes:    OptionalSafeString(1000),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export const UpdatePaymentSchema = CreatePaymentSchema.partial().extend({
  status: z.nativeEnum(PaymentStatus).optional(),
});

export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;

export const PaymentQuerySchema = z.object({
  page:         z.coerce.number().int().min(1).max(1000).default(1),
  pageSize:     z.coerce.number().int().min(1).max(100).default(20),
  status:       z.nativeEnum(PaymentStatus).optional(),
  categoryId:   z.string().cuid().optional(),
  costCenterId: z.string().cuid().optional(),
  from:         ISODate.optional(),
  to:           ISODate.optional(),
  search:       z.string().trim().max(100).optional(),
});

// ─── AUTH SCHEMAS ─────────────────────────────────────────────────────────────

export const SignInSchema = z.object({
  email:    z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(12).max(128),
  totpCode: z.string().length(6).regex(/^\d{6}$/).optional(),
});

export const MFASetupSchema = z.object({
  totpCode: z.string().length(6).regex(/^\d{6}$/),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword:     z.string()
    .min(12, "Minimum 12 characters")
    .max(128)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});

// ─── EMAIL INGESTION SCHEMA ───────────────────────────────────────────────────

export const EmailIngestSchema = z.object({
  messageId:   z.string().max(500),
  fromAddress: z.string().email().max(255),
  subject:     z.string().max(500).optional(),
  textBody:    z.string().max(50_000).optional(),
  htmlBody:    z.string().max(200_000).optional(),
  receivedAt:  z.string().datetime(),
  spfResult:   z.string().max(50).optional(),
  dkimResult:  z.string().max(50).optional(),
  dmarcResult: z.string().max(50).optional(),
});

// ─── ALLOWED SENDER SCHEMA ────────────────────────────────────────────────────

export const AllowedSenderSchema = z.object({
  emailPattern: z.string()
    .max(255)
    .refine(
      (v) => z.string().email().safeParse(v).success || /^@[\w.-]+\.\w{2,}$/.test(v),
      "Must be a valid email or @domain.com pattern"
    ),
  description: OptionalSafeString(500),
});

// ─── FILE UPLOAD VALIDATION ───────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MAX_FILE_SIZE = parseInt(process.env.MAX_ATTACHMENT_SIZE ?? "5242880", 10);

export function validateFileUpload(file: {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Validate by magic bytes, not just MIME type claim
  if (!checkMagicBytes(file.buffer, file.type)) {
    return { valid: false, error: "File content does not match declared type" };
  }

  // Sanitize filename — strip path traversal, control chars
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, "_")
    .slice(0, 255);

  if (!safeName || safeName === "_") {
    return { valid: false, error: "Invalid filename" };
  }

  return { valid: true };
}

const MAGIC_BYTES: Record<string, Buffer[]> = {
  "application/pdf": [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
  "image/jpeg":      [Buffer.from([0xFF, 0xD8, 0xFF])],
  "image/png":       [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
};

function checkMagicBytes(buf: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return true; // No signature check defined — allow but rely on AV scan
  return signatures.some((sig) => buf.slice(0, sig.length).equals(sig));
}
