import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const agentQueue = new Queue("agent-runs", {
  connection: redisConnection,
});

export const imageQueue = new Queue("image-jobs", {
  connection: redisConnection,
});

export const ingestQueue = new Queue("ingest-jobs", {
  connection: redisConnection,
});