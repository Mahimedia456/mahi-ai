import api from "./client";

export async function fetchStorageSummary() {
  const { data } = await api.get("/admin/storage/usage/summary");
  return data;
}

export async function fetchUserStorageUsage() {
  const { data } = await api.get("/admin/storage/usage/users");
  return data;
}

export async function fetchMediaBuckets() {
  const { data } = await api.get("/admin/storage/buckets");
  return data;
}

export async function fetchMediaBucketDetail(bucketId) {
  const { data } = await api.get(`/admin/storage/buckets/${bucketId}`);
  return data;
}

export async function deactivateMediaBucket(bucketId) {
  const { data } = await api.patch(`/admin/storage/buckets/${bucketId}/deactivate`);
  return data;
}

export async function activateMediaBucket(bucketId) {
  const { data } = await api.patch(`/admin/storage/buckets/${bucketId}/activate`);
  return data;
}

export async function deleteMediaBucket(bucketId) {
  const { data } = await api.delete(`/admin/storage/buckets/${bucketId}`);
  return data;
}