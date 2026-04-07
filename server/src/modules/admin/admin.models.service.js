import { supabaseAdmin } from "../../config/supabase.js";

const MODELS_TABLE = "ai_models";
const USAGE_TABLE = "ai_model_usage_daily";
const ACTIVITY_TABLE = "ai_model_activity";

function formatLatency(value) {
  return `${Number(value || 0)} ms`;
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function mapModel(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    type: row.type,
    version: row.version,
    deployment: row.deployment,
    status: row.status,
    endpoint: row.endpoint,
    description: row.description,
    avgLatency: formatLatency(row.avg_latency_ms),
    avgLatencyMs: Number(row.avg_latency_ms || 0),
    successRate: formatPercent(row.success_rate),
    successRateValue: Number(row.success_rate || 0),
    totalRequests: Number(row.total_requests || 0).toLocaleString(),
    totalRequestsValue: Number(row.total_requests || 0),
    todayRequests: Number(row.today_requests || 0).toLocaleString(),
    todayRequestsValue: Number(row.today_requests || 0),
    lastUsedAt: formatDateTime(row.last_used_at),
    config: row.config || {},
    createdAt: formatDateTime(row.created_at),
    updatedAt: formatDateTime(row.updated_at),
  };
}

async function logModelActivity(modelId, action, metadata = {}) {
  await supabaseAdmin.from(ACTIVITY_TABLE).insert({
    model_id: modelId,
    action,
    actor_name: "Admin",
    metadata,
  });
}

export async function getModels(filters = {}) {
  let query = supabaseAdmin
    .from(MODELS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data || []).map(mapModel);
}

export async function getModelStats() {
  const { data, error } = await supabaseAdmin.from(MODELS_TABLE).select("*");
  if (error) throw new Error(error.message);

  const rows = data || [];

  const totalRequests = rows.reduce((sum, item) => sum + Number(item.total_requests || 0), 0);
  const todayRequests = rows.reduce((sum, item) => sum + Number(item.today_requests || 0), 0);

  const imageLeader = [...rows]
    .filter((item) => item.type === "image")
    .sort((a, b) => Number(b.total_requests || 0) - Number(a.total_requests || 0))[0];

  const fastestAvg = [...rows].sort(
    (a, b) => Number(a.avg_latency_ms || 0) - Number(b.avg_latency_ms || 0)
  )[0];

  return {
    totalModels: rows.length,
    activeModels: rows.filter((item) => item.status === "active").length,
    warningModels: rows.filter((item) => item.status === "warning").length,
    totalRequests: totalRequests.toLocaleString(),
    totalRequestsValue: totalRequests,
    todayRequests: todayRequests.toLocaleString(),
    todayRequestsValue: todayRequests,
    imageLeader: imageLeader?.name || "-",
    fastestAvg: fastestAvg ? `${fastestAvg.avg_latency_ms} ms` : "-",
  };
}

export async function getModelById(modelId) {
  const { data, error } = await supabaseAdmin
    .from(MODELS_TABLE)
    .select("*")
    .eq("id", modelId)
    .single();

  if (error || !data) throw new Error("Model not found");

  return mapModel(data);
}

export async function getModelUsageSeries(modelId = null, days = 7) {
  const safeDays = Math.max(Number(days) || 7, 1);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (safeDays - 1));
  const start = startDate.toISOString().slice(0, 10);

  let query = supabaseAdmin
    .from(USAGE_TABLE)
    .select("*")
    .gte("usage_date", start)
    .order("usage_date", { ascending: true });

  if (modelId) query = query.eq("model_id", modelId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const grouped = new Map();

  for (let i = 0; i < safeDays; i += 1) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    grouped.set(key, 0);
  }

  for (const row of data || []) {
    const key = row.usage_date;
    grouped.set(key, Number(grouped.get(key) || 0) + Number(row.requests_count || 0));
  }

  return Array.from(grouped.entries()).map(([date, value]) => ({
    label: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
    date,
    value,
  }));
}

export async function getModelActivity(modelId) {
  const { data, error } = await supabaseAdmin
    .from(ACTIVITY_TABLE)
    .select("*")
    .eq("model_id", modelId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((item) => ({
    id: item.id,
    action: item.action,
    actorName: item.actor_name,
    createdAt: formatDateTime(item.created_at),
    metadata: item.metadata || {},
  }));
}

export async function getModelDetailBundle(modelId) {
  const [model, usage, activity] = await Promise.all([
    getModelById(modelId),
    getModelUsageSeries(modelId, 7),
    getModelActivity(modelId),
  ]);

  return {
    model,
    usage,
    activity,
  };
}

export async function updateModelStatus(modelId, status) {
  const allowed = ["active", "warning", "paused", "disabled"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid model status");
  }

  const { data, error } = await supabaseAdmin
    .from(MODELS_TABLE)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", modelId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to update model status");

  await logModelActivity(modelId, `Model status changed to ${status}`, { status });

  return mapModel(data);
}

export async function deleteModel(modelId) {
  const { error } = await supabaseAdmin.from(MODELS_TABLE).delete().eq("id", modelId);
  if (error) throw new Error(error.message);
  return { success: true };
}

function toCsv(rows) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");
}

export async function exportModelsCsv() {
  const models = await getModels();

  const rows = models.map((item) => ({
    id: item.id,
    name: item.name,
    provider: item.provider,
    type: item.type,
    version: item.version,
    deployment: item.deployment,
    latency_ms: item.avgLatencyMs,
    success_rate: item.successRateValue,
    total_requests: item.totalRequestsValue,
    today_requests: item.todayRequestsValue,
    status: item.status,
    last_used_at: item.lastUsedAt,
  }));

  return toCsv(rows);
}

export async function exportModelUsageCsv(modelId = null) {
  const series = await getModelUsageSeries(modelId, 30);
  const rows = series.map((item) => ({
    date: item.date,
    label: item.label,
    requests: item.value,
  }));

  return toCsv(rows);
}