import crypto from "crypto";
import { supabaseAdmin, getStoragePublicUrl } from "../../config/supabase.js";
import { env } from "../../config/env.js";

const TABLE = "generated_content";

function formatBytes(bytes = 0) {
  if (!bytes || Number(bytes) <= 0) return "0 MB";

  const mb = Number(bytes) / (1024 * 1024);
  if (mb < 1) {
    const kb = Number(bytes) / 1024;
    return `${kb.toFixed(2)} KB`;
  }

  return `${mb.toFixed(2)} MB`;
}

function normalizeActivity(activity) {
  if (Array.isArray(activity)) return activity;
  return [];
}

function isValidUuid(value) {
  if (!value || typeof value !== "string") return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

function sanitizeUuid(value) {
  if (!isValidUuid(value)) return null;
  return value.trim();
}

function mapRow(row = {}) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    model: row.model,
    prompt: row.prompt,
    status: row.status,
    visibility: row.visibility,
    flagged: row.flagged,
    moderationNote: row.moderation_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolution: row.resolution,
    format: row.format,
    size: row.file_size_label,
    fileSizeBytes: row.file_size_bytes,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    previewUrl:
      row.preview_url ||
      (row.storage_path
        ? getStoragePublicUrl(
            row.storage_path,
            row.storage_bucket || env.supabaseStorageBucket
          )
        : ""),
    metadata: row.metadata || {},
    activity: normalizeActivity(row.activity),
  };
}

async function getExistingColumns() {
  const { data, error } = await supabaseAdmin.from(TABLE).select("*").limit(1);

  if (error) {
    throw new Error(`Could not inspect ${TABLE} schema: ${error.message}`);
  }

  if (Array.isArray(data) && data.length > 0) {
    return new Set(Object.keys(data[0]));
  }

  return new Set([
    "id",
    "title",
    "type",
    "user_id",
    "user_name",
    "user_email",
    "model",
    "prompt",
    "status",
    "visibility",
    "flagged",
    "moderation_note",
    "resolution",
    "format",
    "file_size_bytes",
    "file_size_label",
    "storage_bucket",
    "storage_path",
    "preview_url",
    "metadata",
    "activity",
    "created_at",
    "updated_at",
  ]);
}

function pickAllowedColumns(payload, allowedColumns) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      if (!allowedColumns.has(key)) return false;
      if (value === undefined) return false;
      return true;
    })
  );
}

export async function getContentStats({ type } = {}) {
  let query = supabaseAdmin.from(TABLE).select("*", { count: "exact" });

  if (type) query = query.eq("type", type);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows = data || [];

  return {
    total: count || 0,
    approved: rows.filter((row) => row.status === "approved").length,
    reported: rows.filter((row) => row.status === "reported").length,
    deleted: rows.filter((row) => row.status === "deleted").length,
    hidden: rows.filter((row) => row.visibility === "private").length,
    visible: rows.filter((row) => row.visibility !== "private").length,
  };
}

export async function getContentList({
  type,
  status,
  search,
  page = 1,
  limit = 12,
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.max(Number(limit) || 12, 1);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  let query = supabaseAdmin
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    items: (data || []).map(mapRow),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count || 0,
    },
  };
}

export async function getContentById(contentId) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", contentId)
    .single();

  if (error || !data) {
    throw new Error("Content item not found");
  }

  return mapRow(data);
}

export async function updateContent(contentId, payload = {}) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", contentId)
    .single();

  if (existingError || !existing) {
    throw new Error("Content item not found");
  }

  const currentActivity = normalizeActivity(existing.activity);
  const allowedColumns = await getExistingColumns();

  const rawUpdates = {
    updated_at: new Date().toISOString(),
  };

  if (payload.status) rawUpdates.status = payload.status;
  if (payload.visibility) rawUpdates.visibility = payload.visibility;
  if (typeof payload.moderationNote === "string") {
    rawUpdates.moderation_note = payload.moderationNote;
  }
  if (typeof payload.flagged === "boolean") {
    rawUpdates.flagged = payload.flagged;
  }

  if (payload.actionLabel) {
    rawUpdates.activity = [
      {
        id: crypto.randomUUID(),
        text: payload.actionLabel,
        time: new Date().toISOString(),
      },
      ...currentActivity,
    ];
  }

  const updates = pickAllowedColumns(rawUpdates, allowedColumns);

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update(updates)
    .eq("id", contentId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update content");
  }

  return mapRow(data);
}

export async function deleteContent(contentId) {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", contentId)
    .single();

  if (fetchError || !existing) {
    throw new Error("Content item not found");
  }

  const bucket = existing.storage_bucket || env.supabaseStorageBucket;
  const storagePath = existing.storage_path || "";

  if (storagePath) {
    await supabaseAdmin.storage.from(bucket).remove([storagePath]);
  }

  const { error: deleteError } = await supabaseAdmin
    .from(TABLE)
    .delete()
    .eq("id", contentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return { success: true };
}

export async function uploadContentAsset(file, body = {}) {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const type = body.type === "video" ? "video" : "image";
  const bucket = env.supabaseStorageBucket || "ai-content";
  const ext = file.originalname.includes(".")
    ? file.originalname.split(".").pop()
    : type === "video"
      ? "mp4"
      : "png";

  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const storagePath = `${type === "video" ? "videos" : "images"}/${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const previewUrl = getStoragePublicUrl(storagePath, bucket);
  const now = new Date().toISOString();
  const allowedColumns = await getExistingColumns();

  const safeUserId = sanitizeUuid(body.userId);

  const rawInsertPayload = {
    title: body.title || file.originalname,
    type,
    user_id: safeUserId,
    user_name: body.userName || "Unknown User",
    user_email: body.userEmail || "",
    model: body.model || "",
    prompt: body.prompt || "",
    status: body.status || "approved",
    visibility: body.visibility || "private",
    flagged: body.status === "reported",
    moderation_note: body.moderationNote || "",
    resolution: body.resolution || "",
    format: body.format || file.mimetype || "",
    file_size_bytes: file.size || 0,
    file_size_label: formatBytes(file.size || 0),
    storage_bucket: bucket,
    storage_path: storagePath,
    preview_url: previewUrl,
    metadata: {
      mimeType: file.mimetype,
      originalName: file.originalname,
    },
    activity: [
      {
        id: crypto.randomUUID(),
        text: "Asset uploaded",
        time: now,
      },
    ],
    created_at: now,
    updated_at: now,
  };

  const insertPayload = pickAllowedColumns(rawInsertPayload, allowedColumns);

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert(insertPayload)
    .select("*")
    .single();

  if (error || !data) {
    await supabaseAdmin.storage.from(bucket).remove([storagePath]);
    throw new Error(`DB insert failed: ${error?.message || "Failed to save content"}`);
  }

  return mapRow(data);
}