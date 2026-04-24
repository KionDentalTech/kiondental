# Multi-stage build — minimizes attack surface by not shipping dev tools to prod
# Stage: deps → build → runner

FROM node:20-alpine AS base
# Security: use non-root user from the start
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app

# ─── DEPS ────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# ─── BUILD ───────────────────────────────────────────────────────────────────
FROM base AS builder
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
# Never bake secrets into the image — only pass at runtime
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

# ─── RUNNER (production) ─────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Only copy what's needed to run
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
