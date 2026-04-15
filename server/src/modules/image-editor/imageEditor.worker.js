import crypto from "crypto";
import axios from "axios";
import { Worker } from "bullmq";
import { env } from "../../config/env.js";
import { redisConnection } from "../../queue/redis.js";
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import {
  createSignedReadUrl,
  getInternalJob,
  markJobCompleted,
  markJobFailed,
  markJobProcessing,
} from "./imageEditor.service.js";

async function withRetry(fn, retries = 3, delayMs = 700) {
  let lastError;

  for (let i = 0; i < retries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }

  throw lastError;
}

async function createResultUploadUrl(path) {
  const data = await withRetry(async () => {
    const { data, error } = await supabaseAdmin.storage
      .from(env.imageEditorBucket)
      .createSignedUploadUrl(path);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  });

  return {
    path,
    token: data.token,
  };
}

export function startImageEditorWorker() {
  const worker = new Worker(
    "image-editor",
    async (queueJob) => {
      const { jobId } = queueJob.data;

      const dbJob = await getInternalJob(jobId);

      if (!dbJob) {
        console.warn(`[IMAGE_EDITOR_WORKER] skipping stale queue job: ${jobId}`);
        return { skipped: true };
      }

      try {
        await markJobProcessing(jobId);

        const inputUrl = await createSignedReadUrl(dbJob.input_path);
        const maskUrl = dbJob.mask_path
          ? await createSignedReadUrl(dbJob.mask_path)
          : null;

        const outputPath = `outputs/${dbJob.user_id}/${jobId}-${crypto.randomUUID()}.png`;
        const previewPath = `previews/${dbJob.user_id}/${jobId}-${crypto.randomUUID()}.png`;

        const outputUpload = await createResultUploadUrl(outputPath);
        const previewUpload = await createResultUploadUrl(previewPath);

        const response = await axios.post(
          `${env.pythonImageEditorUrl}/edit`,
          {
            job_id: dbJob.id,
            tool_type: dbJob.tool_type,
            prompt: dbJob.prompt,
            negative_prompt: dbJob.negative_prompt,
            input_url: inputUrl,
            mask_url: maskUrl,
            strength: dbJob.strength,
            scale_factor: dbJob.scale_factor,
            face_enhance: dbJob.face_enhance,
            denoise: dbJob.denoise,
            meta: dbJob.meta || {},
            output_upload: outputUpload,
            preview_upload: previewUpload,
            bucket: env.imageEditorBucket,
          },
          {
            timeout: 0,
          }
        );

        await markJobCompleted(jobId, {
          outputPath,
          previewPath,
          meta: response.data?.meta || {},
        });

        return { success: true };
      } catch (error) {
        const detail =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error.message ||
          "Image editor processing failed";

        console.error("[IMAGE_EDITOR_WORKER] error:", detail);

        try {
          await markJobFailed(jobId, detail);
        } catch (updateError) {
          console.error("[IMAGE_EDITOR_WORKER] failed to mark job failed:", updateError.message);
        }

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[IMAGE_EDITOR_WORKER] completed job ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[IMAGE_EDITOR_WORKER] failed job ${job?.id}`, err.message);
  });

  return worker;
}