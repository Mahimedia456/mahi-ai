import api from "./client";
import { supabase } from "../lib/supabase";

export async function getImageEditorUploadUrl(kind, fileName) {
  const { data } = await api.post("/image-editor/upload-url", {
    kind,
    fileName,
  });

  return data;
}

export async function uploadToSignedUrl({ path, token, file }) {
  const { error } = await supabase.storage
    .from(import.meta.env.VITE_IMAGE_EDITOR_BUCKET || "image-editor")
    .uploadToSignedUrl(path, token, file);

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function uploadEditorFile(kind, file) {
  const upload = await getImageEditorUploadUrl(kind, file.name);

  await uploadToSignedUrl({
    path: upload.path,
    token: upload.token,
    file,
  });

  return upload.path;
}

export async function createImageEditorJob(payload) {
  const { data } = await api.post("/image-editor/jobs", payload);
  return data.job;
}

export async function getImageEditorJobs() {
  const { data } = await api.get("/image-editor/jobs");
  return data.jobs || [];
}

export async function getImageEditorJob(jobId) {
  const { data } = await api.get(`/image-editor/jobs/${jobId}`);
  return data.job;
}