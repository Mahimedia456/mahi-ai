import crypto from "crypto";
import { supabaseAdmin } from "../../config/supabase.js";

const BUCKET_SETTINGS_TABLE = "storage_bucket_settings";
const BUCKET_ACTIVITY_TABLE = "storage_bucket_activity";

function formatBytes(bytes = 0) {
  const value = Number(bytes || 0);

  if (value < 1024) return `${value} B`;

  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  const gb = mb / 1024;
  if (gb < 1024) return `${gb.toFixed(2)} GB`;

  const tb = gb / 1024;
  return `${tb.toFixed(2)} TB`;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString();
}

function getBucketVisibility(bucket) {
  return bucket.public ? "public" : "private";
}

async function listAllBuckets() {
  const { data, error } = await supabaseAdmin.storage.listBuckets();

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function getBucketSettingsMap() {
  const { data, error } = await supabaseAdmin
    .from(BUCKET_SETTINGS_TABLE)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data || []).map((item) => [item.bucket_id, item]));
}

async function listAllObjectsForBucket(bucketName) {
  const allObjects = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .list("", {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw new Error(error.message);
    }

    const batch = data || [];
    allObjects.push(...batch);

    if (batch.length < limit) break;
    offset += limit;
  }

  return allObjects;
}

function summarizeBucket(bucket, settings, objects) {
  const fileObjects = (objects || []).filter((item) => !item.id?.endsWith?.("/"));
  const totalBytes = fileObjects.reduce((sum, item) => sum + Number(item.metadata?.size || 0), 0);

  const status = settings?.status || (bucket.public ? "healthy" : "warning");

  return {
    id: bucket.id,
    name: settings?.display_name || bucket.name,
    bucketId: bucket.id,
    description: settings?.description || "Storage bucket",
    region: settings?.region || "ap-south-1",
    visibility: settings?.visibility || getBucketVisibility(bucket),
    totalSize: formatBytes(totalBytes),
    totalBytes,
    fileCount: fileObjects.length,
    status,
    isActive: settings?.is_active ?? true,
    notes: settings?.notes || "",
    createdAt: bucket.created_at || null,
  };
}

export async function getStorageSummary() {
  const buckets = await listAllBuckets();
  const settingsMap = await getBucketSettingsMap();

  let totalBytes = 0;
  let imageBytes = 0;
  let videoBytes = 0;
  let archivedBytes = 0;
  let totalFiles = 0;

  for (const bucket of buckets) {
    const objects = await listAllObjectsForBucket(bucket.name);
    const settings = settingsMap.get(bucket.id) || settingsMap.get(bucket.name);

    const fileObjects = (objects || []).filter((item) => !item.id?.endsWith?.("/"));

    for (const object of fileObjects) {
      const size = Number(object.metadata?.size || 0);
      totalBytes += size;
      totalFiles += 1;

      const mimeType = object.metadata?.mimetype || object.metadata?.contentType || "";
      const path = object.name || "";

      if (mimeType.startsWith("image/")) imageBytes += size;
      else if (mimeType.startsWith("video/")) videoBytes += size;
      else if (path.startsWith("archive/")) archivedBytes += size;
    }

    if (settings?.is_active === false) {
      archivedBytes += fileObjects.reduce(
        (sum, item) => sum + Number(item.metadata?.size || 0),
        0
      );
    }
  }

  const totalCapacityBytes = 500 * 1024 * 1024 * 1024;
  const utilization = totalCapacityBytes
    ? ((totalBytes / totalCapacityBytes) * 100).toFixed(1)
    : "0.0";

  return {
    totalUsed: formatBytes(totalBytes),
    totalUsedBytes: totalBytes,
    totalCapacity: formatBytes(totalCapacityBytes),
    totalCapacityBytes,
    utilization,
    imageStorage: formatBytes(imageBytes),
    imageBytes,
    videoStorage: formatBytes(videoBytes),
    videoBytes,
    archivedStorage: formatBytes(archivedBytes),
    archivedBytes,
    activeBuckets: buckets.length,
    totalFiles,
    monthlyGrowth: "+8.2%",
  };
}

export async function getMediaBuckets() {
  const buckets = await listAllBuckets();
  const settingsMap = await getBucketSettingsMap();
  const result = [];

  for (const bucket of buckets) {
    const settings = settingsMap.get(bucket.id) || settingsMap.get(bucket.name);
    const objects = await listAllObjectsForBucket(bucket.name);
    result.push(summarizeBucket(bucket, settings, objects));
  }

  return result;
}

export async function getBucketById(bucketId) {
  const buckets = await listAllBuckets();
  const bucket = buckets.find((item) => item.id === bucketId || item.name === bucketId);

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  const settingsMap = await getBucketSettingsMap();
  const settings = settingsMap.get(bucket.id) || settingsMap.get(bucket.name);
  const objects = await listAllObjectsForBucket(bucket.name);

  const summary = summarizeBucket(bucket, settings, objects);

  const files = (objects || []).map((item) => ({
    id: item.id || item.name,
    name: item.name,
    size: formatBytes(Number(item.metadata?.size || 0)),
    sizeBytes: Number(item.metadata?.size || 0),
    mimeType: item.metadata?.mimetype || item.metadata?.contentType || "-",
    updatedAt: formatDate(item.updated_at || item.created_at),
    path: item.name,
  }));

  const { data: activityData, error: activityError } = await supabaseAdmin
    .from(BUCKET_ACTIVITY_TABLE)
    .select("*")
    .eq("bucket_id", bucket.id)
    .order("created_at", { ascending: false });

  if (activityError) {
    throw new Error(activityError.message);
  }

  return {
    bucket: summary,
    files,
    policies: {
      visibility: summary.visibility,
      activeState: summary.isActive ? "Active" : "Disabled",
      notes: summary.notes || "-",
    },
    activity: (activityData || []).map((item) => ({
      id: item.id,
      action: item.action,
      actorName: item.actor_name,
      createdAt: formatDate(item.created_at),
      metadata: item.metadata || {},
    })),
  };
}

export async function getUserStorageUsage() {
  const { data, error } = await supabaseAdmin
    .from("generated_content")
    .select("user_id,user_name,user_email,type,file_size_bytes,updated_at,created_at");

  if (error) {
    throw new Error(error.message);
  }

  const map = new Map();

  for (const row of data || []) {
    const key = row.user_email || row.user_id || row.user_name || crypto.randomUUID();

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: row.user_name || "Unknown User",
        email: row.user_email || "-",
        plan: "Free",
        totalBytes: 0,
        files: 0,
        lastUpdatedRaw: row.updated_at || row.created_at,
      });
    }

    const current = map.get(key);
    current.totalBytes += Number(row.file_size_bytes || 0);
    current.files += 1;

    const candidateDate = row.updated_at || row.created_at;
    if (candidateDate && (!current.lastUpdatedRaw || new Date(candidateDate) > new Date(current.lastUpdatedRaw))) {
      current.lastUpdatedRaw = candidateDate;
    }
  }

  return Array.from(map.values())
    .map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      plan: item.plan,
      storageUsed: formatBytes(item.totalBytes),
      storageUsedBytes: item.totalBytes,
      files: item.files,
      lastUpdated: formatDate(item.lastUpdatedRaw),
    }))
    .sort((a, b) => b.storageUsedBytes - a.storageUsedBytes);
}

async function logBucketActivity(bucketId, action, metadata = {}) {
  await supabaseAdmin.from(BUCKET_ACTIVITY_TABLE).insert({
    bucket_id: bucketId,
    action,
    actor_name: "Admin",
    metadata,
  });
}

export async function deactivateBucket(bucketId) {
  const buckets = await listAllBuckets();
  const bucket = buckets.find((item) => item.id === bucketId || item.name === bucketId);

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  const payload = {
    bucket_id: bucket.id,
    display_name: bucket.name,
    visibility: bucket.public ? "public" : "private",
    is_active: false,
    status: "disabled",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from(BUCKET_SETTINGS_TABLE)
    .upsert(payload, { onConflict: "bucket_id" });

  if (error) {
    throw new Error(error.message);
  }

  await logBucketActivity(bucket.id, "Bucket deactivated", { bucketName: bucket.name });

  return { success: true };
}

export async function activateBucket(bucketId) {
  const buckets = await listAllBuckets();
  const bucket = buckets.find((item) => item.id === bucketId || item.name === bucketId);

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  const payload = {
    bucket_id: bucket.id,
    display_name: bucket.name,
    visibility: bucket.public ? "public" : "private",
    is_active: true,
    status: "healthy",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from(BUCKET_SETTINGS_TABLE)
    .upsert(payload, { onConflict: "bucket_id" });

  if (error) {
    throw new Error(error.message);
  }

  await logBucketActivity(bucket.id, "Bucket activated", { bucketName: bucket.name });

  return { success: true };
}

export async function removeBucket(bucketId) {
  const buckets = await listAllBuckets();
  const bucket = buckets.find((item) => item.id === bucketId || item.name === bucketId);

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  const objects = await listAllObjectsForBucket(bucket.name);

  if ((objects || []).length > 0) {
    throw new Error("Bucket is not empty. Delete files first before removing the bucket.");
  }

  const { error: deleteBucketError } = await supabaseAdmin.storage.deleteBucket(bucket.name);

  if (deleteBucketError) {
    throw new Error(deleteBucketError.message);
  }

  await supabaseAdmin.from(BUCKET_SETTINGS_TABLE).delete().eq("bucket_id", bucket.id);
  await supabaseAdmin.from(BUCKET_ACTIVITY_TABLE).delete().eq("bucket_id", bucket.id);

  return { success: true };
}