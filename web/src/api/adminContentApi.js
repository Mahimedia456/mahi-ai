import api from "./client";

export async function fetchAdminContent(params = {}) {
  const { data } = await api.get("/admin/content", { params });
  return data;
}

export async function fetchAdminContentStats(params = {}) {
  const { data } = await api.get("/admin/content/stats", { params });
  return data;
}

export async function fetchAdminContentById(contentId) {
  const { data } = await api.get(`/admin/content/${contentId}`);
  return data;
}

export async function updateAdminContent(contentId, payload) {
  const { data } = await api.patch(`/admin/content/${contentId}`, payload);
  return data;
}

export async function deleteAdminContent(contentId) {
  const { data } = await api.delete(`/admin/content/${contentId}`);
  return data;
}

export async function uploadAdminContent(formData) {
  const { data } = await api.post("/admin/content/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}