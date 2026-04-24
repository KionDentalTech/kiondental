/**
 * Secure API handler wrapper.
 *
 * Every API route goes through this — ensures:
 * - Consistent error responses (no stack traces to client)
 * - Audit logging on exceptions
 * - Role fetched fresh from DB (no JWT-only trust)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ForbiddenError, UnauthorizedError } from "@/lib/rbac";
import { securityLog, logger } from "@/lib/logger";
import { UserRole } from "@prisma/client";
import { ZodError } from "zod";

export interface AuthContext {
  userId: string;
  role: UserRole;
  organizationId: string;
  sessionId: string;
  ipAddress: string;
}

type Handler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>;

export function withAuth(handler: Handler): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Fetch role from DB — never trust token alone
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id, isActive: true },
      select: { role: true, organizationId: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const ctx: AuthContext = {
      userId: session.user.id,
      role: dbUser.role,
      organizationId: dbUser.organizationId,
      sessionId: (session as { sessionToken?: string }).sessionToken ?? "",
      ipAddress:
        req.headers.get("cf-connecting-ip") ??
        req.headers.get("x-real-ip") ??
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown",
    };

    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      if (err instanceof ForbiddenError) {
        securityLog("ACCESS_DENIED", {
          userId: ctx.userId,
          path: req.nextUrl.pathname,
          method: req.method,
          ip: ctx.ipAddress,
        });
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: err.flatten().fieldErrors },
          { status: 422 }
        );
      }
      // Unknown error — log with details, return generic to client
      logger.error("API_ERROR", {
        path: req.nextUrl.pathname,
        method: req.method,
        userId: ctx.userId,
        error: err instanceof Error ? err.message : "unknown",
        stack: err instanceof Error ? err.stack : undefined,
      });
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
