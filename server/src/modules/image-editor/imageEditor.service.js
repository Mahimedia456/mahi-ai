import crypto from "crypto";
import { env } from "../../config/env.js";
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { imageEditorQueue } from "./imageEditor.queue.js";

function buildStoragePath(kind, userId, originalName = "file.png") {
  const ext = originalName.includes(".")
    ? originalName.split(".").pop().toLowerCase()
    : "png";

  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "png";
  const day = new Date().toISOString().slice(0, 10);

  return `${kind}/${userId}/${day}/${crypto.randomUUID()}.${safeExt}`;
}

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

export async function createSignedUploadUrl({ kind, userId, fileName }) {
  const path = buildStoragePath(kind, userId, fileName);

  const result = await withRetry(async () => {
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
    token: result.token,
  };
}

export async function createSignedReadUrl(path) {
  if (!path) return null;

  try {
    const data = await withRetry(async () => {
      const { data, error } = await supabaseAdmin.storage
        .from(env.imageEditorBucket)
        .createSignedUrl(path, env.imageEditorSignedUrlExpires);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    });

    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

export async function createJob({
  userId,
  toolType,
  prompt,
  negativePrompt,
  inputPath,
  maskPath,
  strength,
  scaleFactor,
  faceEnhance,
  denoise,
  meta,
}) {
  const payload = {
    user_id: userId,
    tool_type: toolType,
    prompt: prompt || null,
    negative_prompt: negativePrompt || null,
    input_path: inputPath,
    mask_path: maskPath || null,
    strength: strength ?? 0.65,
    scale_factor: scaleFactor || null,
    face_enhance: Boolean(faceEnhance),
    denoise: Boolean(denoise),
    meta: meta || {},
    status: "queued",
  };

  const { data, error } = await supabaseAdmin
    .from("image_editor_jobs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await imageEditorQueue.add(
    "image-editor-job",
    { jobId: data.id },
    {
      attempts: 1,
      removeOnComplete: 100,
      removeOnFail: 100,
    }
  );

  return data;
}

export async function listJobs(userId) {
  const { data, error } = await supabaseAdmin
    .from("image_editor_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all((data || []).map(enrichJobUrlsForList));
}

export async function getJobById(jobId, userId) {
  const { data, error } = await supabaseAdmin
    .from("image_editor_jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return enrichJobUrlsFull(data);
}

async function enrichJobUrlsForList(job) {
  const outputUrl =
    job.status === "completed" && job.output_path
      ? await createSignedReadUrl(job.output_path)
      : null;

  return {
    ...job,
    input_url: null,
    mask_url: null,
    output_url: outputUrl,
    preview_url: outputUrl,
  };
}

export async function enrichJobUrlsFull(job) {
  const [inputUrl, maskUrl, outputUrl, previewUrl] = await Promise.all([
    createSignedReadUrl(job.input_path),
    createSignedReadUrl(job.mask_path),
    createSignedReadUrl(job.output_path),
    createSignedReadUrl(job.preview_path),
  ]);

  return {
    ...job,
    input_url: inputUrl,
    mask_url: maskUrl,
    output_url: outputUrl,
    preview_url: previewUrl,
  };
}

export async function getInternalJob(jobId) {
  const { data, error } = await supabaseAdmin
    .from("image_editor_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data || null;
}

export async function markJobProcessing(jobId) {
  const { error } = await supabaseAdmin
    .from("image_editor_jobs")
    .update({
      status: "processing",
      error_message: null,
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function markJobCompleted(jobId, { outputPath, previewPath, meta }) {
  const { error } = await supabaseAdmin
    .from("image_editor_jobs")
    .update({
      status: "completed",
      output_path: outputPath,
      preview_path: previewPath || outputPath,
      meta: meta || {},
      completed_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function markJobFailed(jobId, errorMessage) {
  const { error } = await supabaseAdmin
    .from("image_editor_jobs")
    .update({
      status: "failed",
      error_message: String(errorMessage || "Unknown error").slice(0, 1000),
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }
}