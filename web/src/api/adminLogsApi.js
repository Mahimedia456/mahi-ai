import api from "./client";

export async function fetchAdminLogs(type = "generation") {
  const { data } = await api.get(`/admin/logs?type=${type}`);
  return data;
}