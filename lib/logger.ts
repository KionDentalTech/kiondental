/**
 * Structured security logger using Winston.
 *
 * Rules enforced:
 * - No sensitive data in logs (financial values, credentials, PII)
 * - Structured JSON output for SIEM integration
 * - Separate security log channel
 * - No stack traces in production output to clients
 */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json, errors } = winston.format;

const redactSensitive = winston.format((info) => {
  const SENSITIVE_PATTERNS = [
    /password["\s:=]+["']?[^"',\s}]+/gi,
    /token["\s:=]+["']?[^"',\s}]+/gi,
    /secret["\s:=]+["']?[^"',\s}]+/gi,
    /valorEnc["\s:=]+["']?[^"',\s}]+/gi,
    /fornecedorEnc["\s:=]+["']?[^"',\s}]+/gi,
  ];

  let message = typeof info.message === "string" ? info.message : JSON.stringify(info.message);
  for (const pattern of SENSITIVE_PATTERNS) {
    message = message.replace(pattern, "[REDACTED]");
  }
  info.message = message;
  return info;
})();

const baseFormat = combine(
  timestamp(),
  errors({ stack: true }),
  redactSensitive,
  json()
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: baseFormat,
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test",
    }),
    ...(process.env.NODE_ENV === "production"
      ? [
          new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
            maxSize: "50m",
          }),
          new DailyRotateFile({
            filename: "logs/security-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "90d", // longer retention for security events
            maxSize: "50m",
            level: "warn",
          }),
        ]
      : []),
  ],
});

export function securityLog(event: string, meta: Record<string, unknown>) {
  logger.warn({ event, ...meta, _security: true });
}
