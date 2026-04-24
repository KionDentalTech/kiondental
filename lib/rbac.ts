/**
 * Role-Based Access Control
 *
 * Security principle: deny by default.
 * Roles are ALWAYS fetched from the database — never trusted from JWT alone.
 * This prevents token manipulation attacks where a user modifies their role claim.
 */

import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

// Permission matrix — explicit allow list (deny everything not listed)
const PERMISSIONS: Record<string, UserRole[]> = {
  // Payments
  "payment:create":    [UserRole.ADMIN, UserRole.FINANCEIRO],
  "payment:read":      [UserRole.ADMIN, UserRole.FINANCEIRO, UserRole.APROVADOR, UserRole.CONSULTA],
  "payment:update":    [UserRole.ADMIN, UserRole.FINANCEIRO],
  "payment:delete":    [UserRole.ADMIN],
  "payment:approve":   [UserRole.ADMIN, UserRole.APROVADOR],
  "payment:reject":    [UserRole.ADMIN, UserRole.APROVADOR],
  "payment:export":    [UserRole.ADMIN, UserRole.FINANCEIRO],

  // Categories / Cost Centers
  "category:manage":   [UserRole.ADMIN, UserRole.FINANCEIRO],
  "costcenter:manage": [UserRole.ADMIN, UserRole.FINANCEIRO],

  // Email ingestion
  "email:manage":      [UserRole.ADMIN, UserRole.FINANCEIRO],
  "email:review":      [UserRole.ADMIN, UserRole.FINANCEIRO],

  // Audit logs
  "audit:read":        [UserRole.ADMIN],

  // Dashboard
  "dashboard:read":    [UserRole.ADMIN, UserRole.FINANCEIRO, UserRole.APROVADOR, UserRole.CONSULTA],
  "dashboard:export":  [UserRole.ADMIN, UserRole.FINANCEIRO],

  // User management
  "user:manage":       [UserRole.ADMIN],
  "user:read":         [UserRole.ADMIN],

  // Allowed senders
  "sender:manage":     [UserRole.ADMIN],
};

/**
 * Check if a role has a given permission.
 * Always call this server-side — never trust client-side checks.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false; // Unknown permission = deny
  return allowed.includes(role);
}

/**
 * Assert permission — throws 403-compatible error if denied.
 * Use in API route handlers after verifying session.
 */
export function assertPermission(role: UserRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError(`Permission denied: ${permission} requires role in [${PERMISSIONS[permission]?.join(", ")}]`);
  }
}

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Extract session from Next.js request context and validate it.
 * Throws UnauthorizedError if session is invalid/missing.
 */
export function requireSession(session: Session | null): asserts session is Session {
  if (!session?.user) {
    throw new UnauthorizedError();
  }
}

/**
 * Scoped query helper — ensures queries always filter by organizationId.
 * Prevents IDOR: user A can never see org B's data.
 */
export function scopeToOrg<T extends { organizationId?: string }>(
  filter: T,
  organizationId: string
): T & { organizationId: string } {
  return { ...filter, organizationId };
}
