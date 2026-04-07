import api from "./client";

export async function fetchAdminModels(params = {}) {
  const { data } = await api.get("/admin/models", { params });
  return data;
}

export async function fetchAdminModelStats() {
  const { data } = await api.get("/admin/models/stats");
  return data;
}

export async function fetchAdminModelAnalytics() {
  const { data } = await api.get("/admin/models/analytics");
  return data;
}

export async function fetchAdminModelDetail(modelId) {
  const { data } = await api.get(`/admin/models/${modelId}`);
  return data;
}

export async function updateAdminModelStatus(modelId, status) {
  const { data } = await api.patch(`/admin/models/${modelId}/status`, { status });
  return data;
}

export async function deleteAdminModel(modelId) {
  const { data } = await api.delete(`/admin/models/${modelId}`);
  return data;
}

export async function downloadModelsCsv() {
  const response = await api.get("/admin/models/export/csv", {
    responseType: "blob",
  });
  return response.data;
}

export async function downloadModelUsageCsv(modelId) {
  const response = await api.get(`/admin/models/${modelId}/export/csv`, {
    responseType: "blob",
  });
  return response.data;
}