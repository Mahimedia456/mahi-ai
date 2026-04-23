import client from "./client";

export async function createVideoStudioUploadUrl(payload) {
  const { data } = await client.post("/video-studio/upload-url", payload);
  return data;
}

export async function createVideoStudioJob(payload) {
  const { data } = await client.post("/video-studio/jobs", payload);
  return data;
}

export async function getVideoStudioJobs(params = {}) {
  const { data } = await client.get("/video-studio/jobs", { params });
  return data;
}

export async function getVideoStudioJob(jobId) {
  const { data } = await client.get(`/video-studio/jobs/${jobId}`);
  return data;
}

export async function getVideoStudioLibrary(params = {}) {
  const { data } = await client.get("/video-studio/library", { params });
  return data;
}

export async function saveVideoStudioAsset(payload) {
  const { data } = await client.post("/video-studio/assets/save", payload);
  return data;
}

export async function uploadFileToSignedUrl({
  signedUrl,
  token,
  file,
  contentType,
}) {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType || file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to signed URL.");
  }

  return { success: true, token };
}