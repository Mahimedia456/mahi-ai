import api from "./client";

export async function listProjects() {
  const { data } = await api.get("/projects");
  return data.data || [];
}

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data.data;
}

export async function updateProject(projectId, payload) {
  const { data } = await api.patch(`/projects/${projectId}`, payload);
  return data.data;
}

export async function deleteProject(projectId) {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data.data;
}