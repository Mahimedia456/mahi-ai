import crypto from "crypto";
import axios from "axios";
import { supabaseAdmin } from "../../lib/supabaseAdmin.js";
import { imageStudioQueue } from "../../queue/queues.js";
import { env } from "../../config/env.js";
import { validateCreateStudioJob } from "./imageStudio.validation.js";

function buildPublicUrl(path) {
  if (!path) return null;
  return `${env.supabaseStoragePublicUrl}/${env.supabaseStorageBucket}/${path}`;
}

function mapOutput(output) {
  return {
    ...output,
    public_url: buildPublicUrl(output.storage_path),
    preview_url: output.preview_path
      ? buildPublicUrl(output.preview_path)
      : buildPublicUrl(output.storage_path),
  };
}

function mapAsset(asset) {
  return {
    ...asset,
    public_url: buildPublicUrl(asset.storage_path),
  };
}

export async function createImageStudioJob({ userId, body }) {
  const normalized = validateCreateStudioJob(body);

  const insertPayload = {
    user_id: userId,
    preset_id: normalized.presetId,
    title: normalized.title,
    prompt: normalized.prompt,
    negative_prompt: normalized.negativePrompt,
    exclusion_prompt: normalized.exclusionPrompt,
    style_key: normalized.styleKey,
    aspect_ratio: normalized.aspectRatio,
    width: normalized.width,
    height: normalized.height,
    sample_count: normalized.sampleCount,
    steps: normalized.steps,
    guidance_scale: normalized.guidanceScale,
    seed: normalized.seed,
    fidelity_level: normalized.fidelityLevel,
    entropy: normalized.entropy,
    status: "queued",
    progress: 0,
  };

  const { data: job, error } = await supabaseAdmin
    .from("image_studio_jobs")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) throw error;

  await imageStudioQueue.add(
    "generate-image-studio",
    {
      jobId: job.id,
      userId,
    },
    {
      attempts: 1,
      removeOnComplete: 50,
      removeOnFail: 100,
    }
  );

  return job;
}

export async function cancelImageStudioJob({ userId, jobId }) {
  const { data: job, error } = await supabaseAdmin
    .from("image_studio_jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  if (job.status === "completed" || job.status === "failed" || job.status === "cancelled") {
    return job;
  }

  await supabaseAdmin
    .from("image_studio_jobs")
    .update({
      status: "cancelled",
      error_message: "Cancelled by user",
      failed_at: new Date().toISOString(),
      progress: 0,
    })
    .eq("id", jobId)
    .eq("user_id", userId);

  try {
    await axios.post(
      `${env.imageStudioWorkerUrl}/cancel`,
      { job_id: jobId },
      { timeout: 15000 }
    );
  } catch (error) {
    console.error("[IMAGE_STUDIO_CANCEL] Worker cancel request failed:", error.message);
  }

  try {
    const bullJob = await imageStudioQueue.getJobs(["waiting", "delayed", "active"]);
    for (const item of bullJob) {
      if (item?.data?.jobId === jobId) {
        try {
          await item.remove();
        } catch (error) {
          // active job remove fail ho sakta hai, ignore
        }
      }
    }
  } catch (error) {
    console.error("[IMAGE_STUDIO_CANCEL] Queue cleanup failed:", error.message);
  }

  const { data: updated } = await supabaseAdmin
    .from("image_studio_jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  return updated;
}

export async function getImageStudioJob({ userId, jobId }) {
  const { data: job, error } = await supabaseAdmin
    .from("image_studio_jobs")
    .select(`
      *,
      outputs:image_studio_outputs(*)
    `)
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return {
    ...job,
    outputs: (job.outputs || []).map(mapOutput),
  };
}

export async function listImageStudioJobs({ userId, status, limit = 24, page = 1 }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin
    .from("image_studio_jobs")
    .select(`
      *,
      outputs:image_studio_outputs(*)
    `, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    items: (data || []).map((job) => ({
      ...job,
      outputs: (job.outputs || []).map(mapOutput),
    })),
    pagination: {
      page,
      limit,
      total: count || 0,
    },
  };
}

export async function listImageStudioOutputs({ userId, archived = false, limit = 24, page = 1 }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from("image_studio_outputs")
    .select(`
      *,
      job:image_studio_jobs(id, prompt, style_key, aspect_ratio, created_at)
    `, { count: "exact" })
    .eq("user_id", userId)
    .eq("is_archived", archived)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: (data || []).map(mapOutput),
    pagination: {
      page,
      limit,
      total: count || 0,
    },
  };
}

export async function listImageStudioAssets({ userId, limit = 50 }) {
  const { data, error } = await supabaseAdmin
    .from("image_studio_assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(mapAsset);
}

export async function listImageStudioPresets({ userId }) {
  let query = supabaseAdmin
    .from("image_studio_presets")
    .select("*")
    .eq("is_active", true)
    .order("is_system", { ascending: false })
    .order("name", { ascending: true });

  if (userId) {
    query = query.or(`user_id.is.null,user_id.eq.${userId}`);
  } else {
    query = query.is("user_id", null);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function toggleArchiveOutput({ userId, outputId, archived }) {
  const { data, error } = await supabaseAdmin
    .from("image_studio_outputs")
    .update({ is_archived: archived })
    .eq("id", outputId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;

  return mapOutput(data);
}

export async function deleteImageStudioOutput({ userId, outputId }) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("image_studio_outputs")
    .select("*")
    .eq("id", outputId)
    .eq("user_id", userId)
    .single();

  if (existingError) throw existingError;

  const pathsToRemove = [existing.storage_path, existing.preview_path].filter(Boolean);

  if (pathsToRemove.length) {
    const { error: storageError } = await supabaseAdmin.storage
      .from(env.supabaseStorageBucket)
      .remove(pathsToRemove);

    if (storageError) throw storageError;
  }

  const { error } = await supabaseAdmin
    .from("image_studio_outputs")
    .delete()
    .eq("id", outputId)
    .eq("user_id", userId);

  if (error) throw error;

  return { success: true };
}

export async function createStudioAssetUpload({ userId, fileName, contentType }) {
  const safeName = String(fileName || "asset.bin").replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `image-studio/assets/${userId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(env.supabaseStorageBucket)
    .createSignedUploadUrl(storagePath);

  if (error) throw error;

  return {
    bucket: env.supabaseStorageBucket,
    storagePath,
    token: data.token,
    path: data.path,
    signedUrl: data.signedUrl,
    contentType: contentType || "application/octet-stream",
  };
}

export async function registerStudioAsset({ userId, body }) {
  const payload = {
    user_id: userId,
    name: body.name,
    asset_type: body.assetType || "image",
    storage_bucket: body.bucket || env.supabaseStorageBucket,
    storage_path: body.storagePath,
    mime_type: body.mimeType || null,
    file_size_bytes: body.fileSizeBytes || null,
    width: body.width || null,
    height: body.height || null,
    source: body.source || "upload",
    linked_output_id: body.linkedOutputId || null,
    meta: body.meta || {},
  };

  const { data, error } = await supabaseAdmin
    .from("image_studio_assets")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;

  return mapAsset(data);
}