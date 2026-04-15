// server/src/queue/pubsub.js

import IORedis from "ioredis";
import { env } from "../config/env.js";

export const pub = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword || undefined,
});

export const sub = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword || undefined,
});