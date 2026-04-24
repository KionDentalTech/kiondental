/**
 * Next.js global middleware — runs on every request.
 *
 * Responsibilities:
 * 1. Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * 2. Authentication guard for /financeiro/* routes
 * 3. Global rate limiting
 * 4. Cache control for sensitive routes
 * 5. CSRF protection (SameSite=Strict + origin check)
 *
 * OWASP: A05 Security Misconfiguration, A07 Identification/Auth failures
 */

import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { applyGlobalRateLimit } from "@/lib/rate-limit";

// Routes requiring authentication
const PROTECTED_PREFIXES = ["/financeiro", "/api/payments", "/api/dashboard", "/api/audit", "/api/email"];
// Routes that bypass auth (login page, public API health check)
const PUBLIC_PATHS = new Set(["/financeiro/login", "/api/auth", "/api/health"]);

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
  !Array.from(PUBLIC_PATHS).some((pub) => pathname.startsWith(pub));

/**
 * Build strict Content-Security-Policy.
 * Blocks inline scripts, external sources, framing — prevents XSS and clickjacking.
 */
function buildCSP(): string {
  const directives: Record<string, string> = {
    "default-src":     "'none'",
    "script-src":      "'self'",
    "style-src":       "'self' 'unsafe-inline'", // Tailwind requires inline styles
    "img-src":         "'self' data: blob:",
    "font-src":        "'self'",
    "connect-src":     "'self'",
    "frame-ancestors": "'none'",
    "form-action":     "'self'",
    "base-uri":        "'self'",
    "object-src":      "'none'",
    "upgrade-insecure-requests": "",
  };
  return Object.entries(directives)
    .map(([k, v]) => (v ? `${k} ${v}` : k))
    .join("; ");
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("Content-Security-Policy", buildCSP());
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  // Remove server fingerprinting
  res.headers.delete("X-Powered-By");
  return res;
}

/**
 * CSRF origin check for state-mutating requests.
 * SameSite=Strict on cookies is the primary defense; this is defense-in-depth.
 */
function checkOrigin(req: NextRequest): boolean {
  const method = req.method;
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false; // Reject missing origin on mutations

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Rate limiting (skip for static assets)
  if (!pathname.startsWith("/_next") && !pathname.startsWith("/static")) {
    const rateLimitRes = await applyGlobalRateLimit(req);
    if (rateLimitRes) return addSecurityHeaders(rateLimitRes);
  }

  // 2. CSRF check on mutations
  if (!checkOrigin(req)) {
    return addSecurityHeaders(
      NextResponse.json({ error: "CSRF validation failed" }, { status: 403 })
    );
  }

  // 3. Auth guard
  if (isProtected(pathname)) {
    const session = await auth();
    if (!session?.user?.id) {
      if (pathname.startsWith("/api/")) {
        return addSecurityHeaders(
          NextResponse.json({ error: "Authentication required" }, { status: 401 })
        );
      }
      const loginUrl = new URL("/financeiro/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Force password reset redirect
    if (session.user.forcePasswordReset && pathname !== "/financeiro/alterar-senha") {
      return NextResponse.redirect(new URL("/financeiro/alterar-senha", req.url));
    }
  }

  // 4. Cache control for sensitive routes — prevent caching of financial data
  const res = NextResponse.next();
  if (isProtected(pathname)) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.headers.set("Pragma", "no-cache");
  }

  return addSecurityHeaders(res);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
