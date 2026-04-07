import api from "./client";

export async function fetchAnalyticsStats(type = "platform") {
  const { data } = await api.get(`/admin/analytics/stats?type=${type}`);
  return data;
}

export async function fetchAnalyticsChart(type = "platform") {
  const { data } = await api.get(`/admin/analytics/chart?type=${type}`);
  return data;
}