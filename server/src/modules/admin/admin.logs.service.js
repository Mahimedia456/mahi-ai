import { supabaseAdmin } from "../../config/supabase.js";

const TABLE_MAP = {
  generation: "ai_generation_logs",
  api: "api_logs",
  errors: "error_logs",
  queue: "job_queue_logs",
  moderation: "moderation_logs",
};

export async function getLogsByType(type) {
  const table = TABLE_MAP[type];

  if (!table) {
    throw new Error("Invalid log type");
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  if (type === "api") {
    return (data || []).map((item) => ({
      id: item.id,
      endpoint: item.endpoint,
      method: item.method,
      status: item.status,
      latency: item.latency ? `${item.latency} ms` : "-",
      time: item.created_at,
      detail: item.user_agent || item.ip || "-",
    }));
  }

  if (type === "errors") {
    return (data || []).map((item) => ({
      id: item.id,
      severity: item.severity,
      source: item.source,
      status: item.status,
      time: item.created_at,
      detail: item.message,
    }));
  }

  if (type === "queue") {
    return (data || []).map((item) => ({
      id: item.id,
      queue: item.queue_name,
      state: item.state,
      worker: item.worker,
      time: item.created_at,
      detail: item.payload ? JSON.stringify(item.payload) : "-",
    }));
  }

  if (type === "moderation") {
    return (data || []).map((item) => ({
      id: item.id,
      user: item.user_id || "-",
      action: item.action,
      status: item.status,
      time: item.created_at,
      detail: item.prompt || "-",
    }));
  }

  return (data || []).map((item) => ({
    id: item.id,
    type: item.generation_type,
    user: item.user_id || "-",
    model: item.model_name,
    status: item.status,
    time: item.created_at,
    detail: item.prompt || "-",
  }));
}