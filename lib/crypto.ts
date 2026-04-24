/**
 * AES-256-GCM field-level encryption for sensitive data at rest.
 * Each encrypted value is self-contained: "iv:authTag:ciphertext" (base64).
 * Never share IVs — a fresh random IV is generated per encryption operation.
 */

import { createCipheriv, createDecipheriv, randomBytes, createHmac } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;    // 96-bit IV recommended for GCM
const TAG_LENGTH = 16;   // 128-bit auth tag

function getKey(): Buffer {
  const hex = process.env.APP_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("APP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypt a plaintext string. Returns "iv:authTag:ciphertext" in base64.
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Decrypt an encrypted string produced by `encrypt()`.
 * Throws on authentication failure — do not swallow this error.
 */
export function decrypt(encryptedValue: string): string {
  const key = getKey();
  const parts = encryptedValue.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value format");
  }
  const [ivB64, tagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Deterministic HMAC-SHA256 for deduplication hashes.
 * Uses a separate key so compromise of one doesn't expose the other.
 */
export function hmac(data: string): string {
  const key = process.env.AUDIT_HMAC_KEY;
  if (!key || key.length !== 64) {
    throw new Error("AUDIT_HMAC_KEY must be a 64-character hex string");
  }
  return createHmac("sha256", Buffer.from(key, "hex"))
    .update(data, "utf8")
    .digest("hex");
}

/**
 * Compute a deduplication hash for a payment.
 * Prevents identical payments from being registered twice.
 * Uses HMAC to make the hash unpredictable (prevents oracle attacks).
 */
export function paymentDeduplicationHash(
  fornecedor: string,
  valorCents: number,
  vencimento: Date
): string {
  const normalized = [
    fornecedor.trim().toLowerCase(),
    valorCents.toString(),
    vencimento.toISOString().slice(0, 10), // date only, YYYY-MM-DD
  ].join("|");
  return hmac(normalized);
}

/**
 * Compute audit log integrity hash.
 * Detects tampering of individual log entries.
 */
export function auditIntegrityHash(fields: Record<string, unknown>): string {
  const canonical = JSON.stringify(fields, Object.keys(fields).sort());
  return hmac(canonical);
}
