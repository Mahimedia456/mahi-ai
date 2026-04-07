import IORedis from "ioredis";
import { env } from "../config/env.js";

export const redisConnection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword || undefined,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("error", (error) => {
  console.error("❌ Redis connection error:", error.message);
});