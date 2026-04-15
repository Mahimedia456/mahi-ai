import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import { env } from "../config/env.js";
import { pub } from "../queue/pubsub.js";
import {
  markRunStatusService,
  updateAssistantMessageService,
  touchThreadOnStreamService,
} from "../modules/chats/chat.service.js";

async function publishRunEvent(runId, payload) {
  await pub.publish(`run:${runId}`, JSON.stringify(payload));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForImageServiceReady(maxAttempts = 120, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await axios.get(`${env.pythonImageUrl}/health`, {
        timeout: 4000,
      });

      if (response?.data?.success) {
        return true;
      }
    } catch (_) {}

    await sleep(delayMs);
  }

  throw new Error("Python image service did not become ready in time");
}

const worker = new Worker(
  "image-jobs",
  async (job) => {
    const {
      runId,
      threadId,
      assistantMessageId,
      prompt,
      model = env.imageDefaultModel,
      width = env.imageDefaultWidth,
      height = env.imageDefaultHeight,
      steps = env.imageDefaultSteps,
      guidance = env.imageDefaultGuidance,
      seed = null,
      negativePrompt = "",
      quality = env.imageDefaultQuality,
    } = job.data;

    try {
      await markRunStatusService({
        runId,
        status: "generating",
        startedAt: new Date().toISOString(),
      });

      await publishRunEvent(runId, {
        type: "ready",
        message: "Preparing image generation",
      });

      await publishRunEvent(runId, {
        type: "progress",
        message: `Loading ${model} model`,
      });

      await waitForImageServiceReady();

      await publishRunEvent(runId, {
        type: "progress",
        message: "Generating image",
      });

      const res = await axios.post(
        `${env.pythonImageUrl}/generate_image`,
        {
          prompt,
          model,
          width,
          height,
          steps,
          guidance,
          seed,
          negativePrompt,
          quality,
        },
        {
          timeout: 0,
        }
      );

      const imageUrl = res?.data?.imageUrl || res?.data?.image || "";
      if (!imageUrl) {
        throw new Error("Image worker did not return an image URL");
      }

      const contentJson = {
        imageUrl,
        model: res?.data?.model || model,
        modelId: res?.data?.modelId || null,
        width: res?.data?.width || width,
        height: res?.data?.height || height,
        steps: res?.data?.steps || steps,
        guidance: res?.data?.guidance ?? guidance,
        quality: res?.data?.quality || quality,
        seed: res?.data?.seed ?? seed,
      };

      await updateAssistantMessageService({
        messageId: assistantMessageId,
        content: "Image generated successfully.",
        status: "completed",
        tokenOutput: 0,
        contentJson,
      });

      await touchThreadOnStreamService({ threadId });

      await publishRunEvent(runId, {
        type: "complete",
        content: "Image generated successfully.",
        contentJson,
      });

      await markRunStatusService({
        runId,
        status: "completed",
        finishedAt: new Date().toISOString(),
      });

      return {
        success: true,
        imageUrl,
      };
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Image generation failed";

      await updateAssistantMessageService({
        messageId: assistantMessageId,
        content: `Error: ${message}`,
        status: "failed",
        tokenOutput: 0,
      });

      await publishRunEvent(runId, {
        type: "error",
        message,
      });

      await markRunStatusService({
        runId,
        status: "failed",
        errorText: message,
        finishedAt: new Date().toISOString(),
      });

      throw error;
    }
  },
  { connection: redisConnection }
);

worker.on("ready", () => {
  console.log("✅ Image worker ready");
});

worker.on("completed", (job) => {
  console.log(`✅ Image job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`❌ Image job failed: ${job?.id}`, error.message);
});