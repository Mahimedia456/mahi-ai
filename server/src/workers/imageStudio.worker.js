import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { env } from "../config/env.js";

const IMAGE_STUDIO_WORKER_URL = env.imageStudioWorkerUrl || "http://127.0.0.1:8400";
const BUCKET = env.supabaseStorageBucket || "ai-content";

async function updateJob(jobId, patch) {
  const { error } = await supabaseAdmin
    .from("image_studio_jobs")
    .update(patch)
    .eq("id", jobId);

  if (error) throw error;
}

async function readStudioJob(jobId) {
  const { data, error } = await supabaseAdmin
    .from("image_studio_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) throw error;
  return data;
}

async function uploadBuffer(storagePath, buffer, contentType = "image/png") {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;
}

async function createOutputRows({ jobRecord, outputs }) {
  const rows = [];

  for (let i = 0; i < outputs.length; i += 1) {
    const output = outputs[i];
    const buffer = Buffer.from(output.base64, "base64");
    const storagePath = `image-studio/outputs/${jobRecord.user_id}/${jobRecord.id}/output-${i + 1}.png`;

    await uploadBuffer(storagePath, buffer, "image/png");

    rows.push({
      job_id: jobRecord.id,
      user_id: jobRecord.user_id,
      image_index: i,
      storage_bucket: BUCKET,
      storage_path: storagePath,
      preview_path: null,
      width: output.width || jobRecord.width,
      height: output.height || jobRecord.height,
      file_size_bytes: buffer.length,
      mime_type: "image/png",
      seed: output.seed || jobRecord.seed,
      meta: {
        model: output.model || null,
      },
    });
  }

  if (!rows.length) {
    throw new Error("Worker returned no outputs.");
  }

  const { error } = await supabaseAdmin
    .from("image_studio_outputs")
    .insert(rows);

  if (error) throw error;
}

export function startImageStudioWorker() {
  const worker = new Worker(
    "image-studio",
    async (bullJob) => {
      const { jobId } = bullJob.data;
      console.log(`[IMAGE_STUDIO_QUEUE] Processing job ${jobId}`);

      const jobRecord = await readStudioJob(jobId);

      if (
        jobRecord.status === "completed" ||
        jobRecord.status === "failed" ||
        jobRecord.status === "cancelled"
      ) {
        console.log(`[IMAGE_STUDIO_QUEUE] Skipping stale job ${jobId}`);
        return;
      }

      await updateJob(jobId, {
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
        error_message: null,
      });

      try {
        const { data } = await axios.post(
          `${IMAGE_STUDIO_WORKER_URL}/generate`,
          {
            job_id: jobRecord.id,
            prompt: jobRecord.prompt,
            negative_prompt: jobRecord.negative_prompt,
            exclusion_prompt: jobRecord.exclusion_prompt,
            style_key: jobRecord.style_key,
            aspect_ratio: jobRecord.aspect_ratio,
            width: jobRecord.width,
            height: jobRecord.height,
            steps: jobRecord.steps,
            guidance_scale: Number(jobRecord.guidance_scale),
            sample_count: jobRecord.sample_count,
            fidelity_level: jobRecord.fidelity_level,
            entropy: Number(jobRecord.entropy),
            seed: jobRecord.seed,
          },
          {
            timeout: 1000 * 60 * 90,
          }
        );

        const latestAfterGenerate = await readStudioJob(jobId);
        if (
          latestAfterGenerate.status === "failed" ||
          latestAfterGenerate.status === "cancelled"
        ) {
          console.log(
            `[IMAGE_STUDIO_QUEUE] Skipping output save for ${jobId} because status is ${latestAfterGenerate.status}`
          );
          return;
        }

        await updateJob(jobId, { progress: 80 });

        await createOutputRows({
          jobRecord,
          outputs: data.outputs || [],
        });

        const latestBeforeComplete = await readStudioJob(jobId);
        if (
          latestBeforeComplete.status === "failed" ||
          latestBeforeComplete.status === "cancelled"
        ) {
          console.log(
            `[IMAGE_STUDIO_QUEUE] Skipping complete update for ${jobId} because status is ${latestBeforeComplete.status}`
          );
          return;
        }

        await updateJob(jobId, {
          status: "completed",
          progress: 100,
          completed_at: new Date().toISOString(),
          worker_meta: {
            model: data.model || null,
            latency_ms: data.latency_ms || null,
          },
        });

        console.log(`[IMAGE_STUDIO_QUEUE] Completed job ${jobId}`);
      } catch (error) {
        const latestJob = await readStudioJob(jobId).catch(() => null);

        if (latestJob?.status === "cancelled") {
          console.log(`[IMAGE_STUDIO_QUEUE] Cancelled job ${jobId}`);
          return;
        }

        const message =
          error.code === "ECONNABORTED"
            ? "Generation timed out before completion."
            : error.response?.data?.detail ||
              error.message ||
              "Image Studio worker failed.";

        console.error(`[IMAGE_STUDIO_QUEUE] Failed job ${jobId}`, message);

        await updateJob(jobId, {
          status: "failed",
          failed_at: new Date().toISOString(),
          error_message: message,
        });

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[IMAGE_STUDIO_QUEUE] Job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[IMAGE_STUDIO_QUEUE] Job failed: ${job?.id}`, err?.message);
  });

  return worker;
}