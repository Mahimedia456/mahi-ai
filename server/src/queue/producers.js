import { agentQueue, imageQueue, ingestQueue } from "./queues.js";

export async function enqueueAgentRun(payload) {
  return agentQueue.add("process-run", payload, {
    removeOnComplete: 50,
    removeOnFail: 100,
  });
}

export async function enqueueImageJob(payload) {
  return imageQueue.add("generate-image", payload, {
    removeOnComplete: 50,
    removeOnFail: 100,
  });
}

export async function enqueueIngestJob(payload) {
  return ingestQueue.add("ingest-file", payload, {
    removeOnComplete: 50,
    removeOnFail: 100,
  });
}