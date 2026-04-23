import api from "./client";

export async function fetchImageStudioPresets() {
  const { data } = await api.get("/image-studio/presets");
  return data.items || [];
}

export async function createImageStudioJob(payload) {
  const { data } = await api.post("/image-studio/jobs", payload);
  return data.job;
}

export async function cancelImageStudioJob(jobId) {
  const { data } = await api.post(`/image-studio/jobs/${jobId}/cancel`);
  return data.job;
}

export async function fetchImageStudioJob(jobId) {
  const { data } = await api.get(`/image-studio/jobs/${jobId}`);
  return data.job;
}

export async function fetchImageStudioJobs(params = {}) {
  const { data } = await api.get("/image-studio/jobs", { params });
  return data;
}

export async function fetchImageStudioOutputs(params = {}) {
  const { data } = await api.get("/image-studio/outputs", { params });
  return data;
}

export async function fetchImageStudioAssets(params = {}) {
  const { data } = await api.get("/image-studio/assets", { params });
  return data.items || [];
}

export async function archiveImageStudioOutput(outputId, archived = true) {
  const { data } = await api.patch(`/image-studio/outputs/${outputId}/archive`, { archived });
  return data.output;
}

export async function deleteImageStudioOutput(outputId) {
  const { data } = await api.delete(`/image-studio/outputs/${outputId}`);
  return data;
}