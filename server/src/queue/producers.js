import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const agentRunsQueue = new Queue("agent-runs", {
  connection: redisConnection,
});

export const imageJobsQueue = new Queue("image-jobs", {
  connection: redisConnection,
});

export async function enqueueAgentRun(payload) {
  return agentRunsQueue.add("agent-run", payload, {
    removeOnComplete: 100,
    removeOnFail: 100,
  });
}

export async function enqueueImageJob(payload) {
  return imageJobsQueue.add("image-job", payload, {
    removeOnComplete: 100,
    removeOnFail: 100,
  });
}