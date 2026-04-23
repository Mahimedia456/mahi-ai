import crypto from "crypto";
import path from "path";
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { videoStudioQueue } from "../../queue/videoStudio.queue.js";

const VIDEO_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "ai-content";

function sanitizeFileName(fileName = "") {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function extFromFileName(fileName = "") {
  return path.extname(fileName || "").toLowerCase();
}

function buildStoragePath({ userId, kind, fileName }) {
  const safeName = sanitizeFileName(fileName);
  const ext = extFromFileName(safeName);
  const baseName = safeName.replace(ext, "");
  const random = crypto.randomBytes(8).toString("hex");
  return `video-studio/${kind}/${userId}/${Date.now()}-${baseName}-${random}${ext}`;
}

function mapJob(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    mode: row.mode,
    status: row.status,
    prompt: row.prompt,
    negativePrompt: row.negative_prompt,
    motionPrompt: row.motion_prompt,
    durationSeconds: row.duration_seconds,
    aspectRatio: row.aspect_ratio,
    fps: row.fps,
    resolution: row.resolution,
    style: row.style,
    modelKey: row.model_key,
    seed: row.seed,
    guidanceScale: row.guidance_scale,
    steps: row.steps,
    motionStrength: row.motion_strength,
    inputImagePath: row.input_image_path,
    inputImageUrl: row.input_image_url,
    outputVideoPath: row.output_video_path,
    outputVideoUrl: row.output_video_url,
    previewImagePath: row.preview_image_path,
    previewImageUrl: row.preview_image_url,
    thumbnailPath: row.thumbnail_path,
    thumbnailUrl: row.thumbnail_url,
    fileSizeBytes: row.file_size_bytes,
    durationMs: row.duration_ms,
    errorMessage: row.error_message,
    workerJobId: row.worker_job_id,
    provider: row.provider,
    meta: row.meta || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

function mapAsset(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    jobId: row.job_id,
    assetType: row.asset_type,
    title: row.title,
    description: row.description,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    mimeType: row.mime_type,
    fileSizeBytes: row.file_size_bytes,
    width: row.width,
    height: row.height,
    durationMs: row.duration_ms,
    fps: row.fps,
    isLibraryItem: row.is_library_item,
    tags: row.tags || [],
    meta: row.meta || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createVideoStudioUploadUrl({
  userId,
  kind,
  fileName,
  contentType,
}) {
  const storagePath = buildStoragePath({ userId, kind, fileName });

  const { data, error } = await supabaseAdmin.storage
    .from(VIDEO_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error) {
    throw new Error(error.message || "Failed to create signed upload URL.");
  }

  return {
    bucket: VIDEO_BUCKET,
    path: storagePath,
    token: data.token,
    signedUrl: data.signedUrl,
    contentType,
  };
}

export async function createVideoStudioJob({ userId, payload }) {
  const insertData = {
    user_id: userId,
    title: payload.title || null,
    mode: payload.mode,
    status: "queued",

    prompt: payload.prompt || null,
    negative_prompt: payload.negativePrompt || null,
    motion_prompt: payload.motionPrompt || null,

    duration_seconds: payload.durationSeconds,
    aspect_ratio: payload.aspectRatio,
    fps: payload.fps,
    resolution: payload.resolution,

    style: payload.style || null,
    model_key: payload.modelKey || null,
    seed: payload.seed ?? null,
    guidance_scale: payload.guidanceScale ?? null,
    steps: payload.steps ?? null,
    motion_strength: payload.motionStrength ?? 50,

    input_image_path: payload.inputImagePath || null,
    input_image_url: payload.inputImageUrl || null,

    provider: "local_python",
    meta: payload.meta || {},
  };

  const { data, error } = await supabaseAdmin
    .from("video_studio_jobs")
    .insert(insertData)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create video studio job.");
  }

  const queueJob = await videoStudioQueue.add(
    "generate-video",
    {
      videoJobId: data.id,
      userId,
    },
    {
      attempts: 2,
      removeOnComplete: 50,
      removeOnFail: 50,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    }
  );

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("video_studio_jobs")
    .update({
      worker_job_id: String(queueJob.id),
    })
    .eq("id", data.id)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(updateError.message || "Failed to update queued video job.");
  }

  return mapJob(updated);
}

export async function listVideoStudioJobs({
  userId,
  page,
  limit,
  status,
  mode,
  search,
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("video_studio_jobs")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (mode) query = query.eq("mode", mode);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,prompt.ilike.%${search}%,motion_prompt.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch video jobs.");
  }

  return {
    items: (data || []).map(mapJob),
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

export async function getVideoStudioJobById({ userId, jobId }) {
  const { data, error } = await supabaseAdmin
    .from("video_studio_jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message || "Video job not found.");
  }

  return mapJob(data);
}

export async function saveVideoStudioAsset({ userId, payload }) {
  const insertData = {
    user_id: userId,
    job_id: payload.jobId || null,
    asset_type: payload.assetType,
    title: payload.title || null,
    description: payload.description || null,
    storage_path: payload.storagePath,
    public_url: payload.publicUrl || null,
    mime_type: payload.mimeType || null,
    file_size_bytes: payload.fileSizeBytes ?? null,
    width: payload.width ?? null,
    height: payload.height ?? null,
    duration_ms: payload.durationMs ?? null,
    fps: payload.fps ?? null,
    is_library_item: payload.isLibraryItem ?? false,
    tags: payload.tags || [],
    meta: payload.meta || {},
  };

  const { data, error } = await supabaseAdmin
    .from("video_studio_assets")
    .insert(insertData)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to save video studio asset.");
  }

  return mapAsset(data);
}

export async function listVideoStudioLibrary({
  userId,
  page,
  limit,
  assetType,
  search,
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("video_studio_assets")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("is_library_item", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (assetType) query = query.eq("asset_type", assetType);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,storage_path.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch video library.");
  }

  return {
    items: (data || []).map(mapAsset),
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

export async function markVideoJobProcessing({ jobId }) {
  const { data, error } = await supabaseAdmin
    .from("video_studio_jobs")
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to mark video job processing.");
  }

  return mapJob(data);
}

export async function markVideoJobCompleted({
  jobId,
  outputVideoPath,
  outputVideoUrl,
  previewImagePath,
  previewImageUrl,
  thumbnailPath,
  thumbnailUrl,
  fileSizeBytes,
  durationMs,
  meta,
}) {
  const { data, error } = await supabaseAdmin
    .from("video_studio_jobs")
    .update({
      status: "completed",
      output_video_path: outputVideoPath || null,
      output_video_url: outputVideoUrl || null,
      preview_image_path: previewImagePath || null,
      preview_image_url: previewImageUrl || null,
      thumbnail_path: thumbnailPath || null,
      thumbnail_url: thumbnailUrl || null,
      file_size_bytes: fileSizeBytes ?? null,
      duration_ms: durationMs ?? null,
      completed_at: new Date().toISOString(),
      meta: meta || {},
    })
    .eq("id", jobId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to mark video job completed.");
  }

  return mapJob(data);
}

export async function markVideoJobFailed({ jobId, errorMessage, meta }) {
  const { data, error } = await supabaseAdmin
    .from("video_studio_jobs")
    .update({
      status: "failed",
      error_message: errorMessage || "Video generation failed.",
      completed_at: new Date().toISOString(),
      meta: meta || {},
    })
    .eq("id", jobId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to mark video job failed.");
  }

  return mapJob(data);
}

export async function createSignedReadUrl(storagePath, expiresIn = 60 * 60) {
  const { data, error } = await supabaseAdmin.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    throw new Error(error.message || "Failed to create signed read URL.");
  }

  return data?.signedUrl || null;
}