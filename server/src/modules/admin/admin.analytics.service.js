import { supabaseAdmin } from "../../config/supabase.js";

export async function getAnalyticsStats(type) {
  const { data, error } = await supabaseAdmin
    .from("analytics_metrics")
    .select("*")
    .eq("metric_type", type)
    .order("recorded_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((item) => ({
    id: item.id,
    label: item.metric_key,
    value: item.metric_value,
    hint: item.metric_hint || "",
    recordedAt: item.recorded_at,
  }));
}

export async function getAnalyticsChart(type) {
  const { data, error } = await supabaseAdmin
    .from("analytics_timeseries")
    .select("*")
    .eq("metric_type", type)
    .order("recorded_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((item) => ({
    id: item.id,
    label: item.label,
    value: Number(item.value || 0),
    day: item.label,
    month: item.label,
    recordedAt: item.recorded_at,
  }));
}