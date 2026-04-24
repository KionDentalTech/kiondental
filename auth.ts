/**
 * NextAuth v5 configuration.
 *
 * Security hardening applied:
 * - Credentials provider with bcrypt (cost 12)
 * - MFA (TOTP) verified before session is issued
 * - Account lockout after 5 failed attempts
 * - Role fetched from DB — never trusted from JWT
 * - Short session lifetime with inactivity timeout
 * - Secure, HttpOnly, SameSite=Strict cookies
 * - Session invalidated on logout (DB-backed)
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { writeAuditLog } from "@/lib/audit";
import { securityLog } from "@/lib/logger";
import { AuditAction, UserRole } from "@prisma/client";
import { SignInSchema } from "@/lib/validation";

const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE ?? "1800", 10);

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: 60, // refresh session every 60s of activity
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/financeiro/login",
    error: "/financeiro/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        totpCode: { type: "text" },
      },
      async authorize(credentials, req) {
        // 1. Validate input shape
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password, totpCode } = parsed.data;

        const ipAddress =
          (req as Request & { headers?: Headers }).headers?.get("x-forwarded-for") ??
          "unknown";

        // 2. Find user
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            organizationId: true,
            isActive: true,
            mfaEnabled: true,
            mfaSecret: true,
            failedLoginAttempts: true,
            lockedUntil: true,
            forcePasswordReset: true,
          },
        });

        const recordFailure = async () => {
          if (!user) return;
          const attempts = user.failedLoginAttempts + 1;
          const lockedUntil = attempts >= 5
            ? new Date(Date.now() + 15 * 60 * 1000) // 15-min lockout
            : null;
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: attempts, lockedUntil },
          });
          securityLog("LOGIN_FAILED", {
            userId: user.id,
            email: user.email,
            attempts,
            locked: !!lockedUntil,
            ip: ipAddress,
          });
          await writeAuditLog({
            organizationId: user.organizationId,
            userId: user.id,
            action: AuditAction.LOGIN_FAILED,
            resourceType: "Session",
            ipAddress,
          });
        };

        if (!user || !user.isActive) {
          // Constant-time check even when user not found — prevents user enumeration
          await bcrypt.compare(password, "$2b$12$invalidhashfortimingattackprevention.valid");
          return null;
        }

        // 3. Check lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          securityLog("LOGIN_ATTEMPT_LOCKED_ACCOUNT", { email, ip: ipAddress });
          return null;
        }

        // 4. Verify password
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
          await recordFailure();
          return null;
        }

        // 5. Verify MFA (mandatory if enabled)
        if (user.mfaEnabled) {
          if (!totpCode) return null; // Require MFA code
          const secret = decrypt(user.mfaSecret!);
          const tokenValid = authenticator.check(totpCode, secret);
          if (!tokenValid) {
            await recordFailure();
            return null;
          }
        }

        // 6. Successful login — reset failure counter
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ipAddress,
          },
        });

        await writeAuditLog({
          organizationId: user.organizationId,
          userId: user.id,
          action: AuditAction.LOGIN,
          resourceType: "Session",
          ipAddress,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          forcePasswordReset: user.forcePasswordReset,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Always fetch role from DB — never trust stored session role
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true, organizationId: true, isActive: true, forcePasswordReset: true },
      });

      if (!dbUser?.isActive) {
        // Revoke session for deactivated users
        await prisma.session.deleteMany({ where: { userId: user.id } });
        return { ...session, user: { ...session.user, id: "" } };
      }

      session.user.id = user.id;
      session.user.role = dbUser.role as UserRole;
      session.user.organizationId = dbUser.organizationId;
      session.user.forcePasswordReset = dbUser.forcePasswordReset;

      return session;
    },
  },
  events: {
    async signOut({ session }) {
      await writeAuditLog({
        organizationId: (session as { organizationId?: string }).organizationId ?? "unknown",
        userId: session.userId as string,
        action: AuditAction.LOGOUT,
        resourceType: "Session",
      });
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
