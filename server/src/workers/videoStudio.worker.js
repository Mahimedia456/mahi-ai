import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import { env } from "../config/env.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import {
  getVideoStudioJobById,
  markVideoJobCompleted,
  markVideoJobFailed,
  markVideoJobProcessing,
  saveVideoStudioAsset,
} from "../modules/videoStudio/videoStudio.service.js";

const VIDEO_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "ai-content";

async function getSignedReadUrl(storagePath, expiresIn = 60 * 60) {
  const { data, error } = await supabaseAdmin.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    throw new Error(error.message || "Failed to create signed URL.");
  }

  return data?.signedUrl || null;
}

function extractWorkerErrorMessage(error) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Video generation worker failed."
  );
}

export function startVideoStudioWorker() {
  const worker = new Worker(
    "video-studio",
    async (job) => {
      const { videoJobId, userId } = job.data;

      try {
        const dbJob = await getVideoStudioJobById({
          userId,
          jobId: videoJobId,
        });

        await markVideoJobProcessing({ jobId: videoJobId });

        let inputImageSignedUrl = null;
        if (dbJob.inputImagePath) {
          inputImageSignedUrl = await getSignedReadUrl(dbJob.inputImagePath);
        }

        const payload = {
          jobId: dbJob.id,
          userId: dbJob.userId,
          title: dbJob.title,
          mode: dbJob.mode,
          prompt: dbJob.prompt,
          negativePrompt: dbJob.negativePrompt,
          motionPrompt: dbJob.motionPrompt,
          durationSeconds: dbJob.durationSeconds,
          aspectRatio: dbJob.aspectRatio,
          fps: dbJob.fps,
          resolution: dbJob.resolution,
          style: dbJob.style,
          modelKey: dbJob.modelKey,
          seed: dbJob.seed,
          guidanceScale: dbJob.guidanceScale,
          steps: dbJob.steps,
          motionStrength: dbJob.motionStrength,
          inputImagePath: dbJob.inputImagePath,
          inputImageUrl: inputImageSignedUrl,
          meta: dbJob.meta || {},
        };

        console.log("[VIDEO_STUDIO_WORKER] sending payload to python worker:", {
          jobId: payload.jobId,
          mode: payload.mode,
          fps: payload.fps,
          steps: payload.steps,
          guidanceScale: payload.guidanceScale,
          hasPrompt: Boolean(payload.prompt),
          hasMotionPrompt: Boolean(payload.motionPrompt),
          hasInputImage: Boolean(payload.inputImagePath),
        });

        const response = await axios.post(
          `${env.videoStudioWorkerUrl}/generate_video`,
          payload,
          {
            timeout: env.videoStudioWorkerTimeoutMs,
          }
        );

        const result = response.data?.data || response.data;

        console.log("[VIDEO_STUDIO_WORKER] python worker success response:", result);

        const completed = await markVideoJobCompleted({
          jobId: dbJob.id,
          outputVideoPath: result.outputVideoPath || result.output_path || null,
          outputVideoUrl: result.outputVideoUrl || null,
          previewImagePath: result.previewImagePath || null,
          previewImageUrl: result.previewImageUrl || null,
          thumbnailPath: result.thumbnailPath || null,
          thumbnailUrl: result.thumbnailUrl || null,
          fileSizeBytes:
            result.fileSizeBytes ?? result.file_size_bytes ?? null,
          durationMs: result.durationMs ?? null,
          meta: {
            ...(dbJob.meta || {}),
            ...(result.meta || {}),
            pythonResult: result,
          },
        });

        if (result.outputVideoPath || result.output_path) {
          await saveVideoStudioAsset({
            userId: dbJob.userId,
            payload: {
              jobId: dbJob.id,
              assetType: "output_video",
              title: dbJob.title || "Generated video",
              storagePath: result.outputVideoPath || result.output_path,
              publicUrl: result.outputVideoUrl || null,
              mimeType: "video/mp4",
              fileSizeBytes:
                result.fileSizeBytes ?? result.file_size_bytes ?? null,
              durationMs: result.durationMs ?? null,
              fps: dbJob.fps,
              isLibraryItem: true,
              tags: [dbJob.mode, dbJob.style || "default"].filter(Boolean),
              meta: {
                source: "video_studio_worker",
              },
            },
          });
        }

        if (result.thumbnailPath) {
          await saveVideoStudioAsset({
            userId: dbJob.userId,
            payload: {
              jobId: dbJob.id,
              assetType: "thumbnail",
              title: `${dbJob.title || "Generated video"} thumbnail`,
              storagePath: result.thumbnailPath,
              publicUrl: result.thumbnailUrl || null,
              mimeType: "image/png",
              isLibraryItem: false,
              tags: [dbJob.mode],
              meta: {
                source: "video_studio_worker",
              },
            },
          });
        }

        return completed;
      } catch (error) {
        const workerMessage = extractWorkerErrorMessage(error);

        console.error("[VIDEO_STUDIO_WORKER] full error message:", error?.message);

        if (error?.response?.status) {
          console.error(
            "[VIDEO_STUDIO_WORKER] python response status:",
            error.response.status
          );
        }

        if (error?.response?.data) {
          console.error(
            "[VIDEO_STUDIO_WORKER] python response data:",
            error.response.data
          );
        }

        await markVideoJobFailed({
          jobId: videoJobId,
          errorMessage: workerMessage,
          meta: {
            queueJobId: job.id,
            responseData: error?.response?.data || null,
            responseStatus: error?.response?.status || null,
          },
        });

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: env.videoStudioWorkerConcurrency,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[VIDEO_STUDIO_WORKER] completed job ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[VIDEO_STUDIO_WORKER] failed job ${job?.id}:`, err.message);

    if (err?.response?.status) {
      console.error(
        "[VIDEO_STUDIO_WORKER] failed response status:",
        err.response.status
      );
    }

    if (err?.response?.data) {
      console.error(
        "[VIDEO_STUDIO_WORKER] failed response data:",
        err.response.data
      );
    }
  });

  return worker;
}