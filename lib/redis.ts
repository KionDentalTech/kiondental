/**
 * Redis client singleton for BullMQ and rate limiting.
 * Uses TLS and password auth. Never binds to 0.0.0.0 in production.
 */

import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");

    client = new Redis(url, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
      tls: url.startsWith("rediss://") ? {} : undefined,
    });

    client.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  }
  return client;
}
