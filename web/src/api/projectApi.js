import api from "./client";

export async function listProjects() {
  const { data } = await api.get("/projects");
  return data.data || [];
}