import {
  activateBucket,
  deactivateBucket,
  getBucketById,
  getMediaBuckets,
  getStorageSummary,
  getUserStorageUsage,
  removeBucket,
} from "./admin.storage.service.js";

export async function getAdminStorageSummary(req, res) {
  try {
    const summary = await getStorageSummary();
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("getAdminStorageSummary error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminUserStorage(req, res) {
  try {
    const items = await getUserStorageUsage();
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("getAdminUserStorage error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminMediaBuckets(req, res) {
  try {
    const items = await getMediaBuckets();
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("getAdminMediaBuckets error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminMediaBucketDetail(req, res) {
  try {
    const result = await getBucketById(req.params.bucketId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("getAdminMediaBucketDetail error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function patchAdminMediaBucketDeactivate(req, res) {
  try {
    await deactivateBucket(req.params.bucketId);
    return res.status(200).json({ success: true, message: "Bucket deactivated successfully" });
  } catch (error) {
    console.error("patchAdminMediaBucketDeactivate error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function patchAdminMediaBucketActivate(req, res) {
  try {
    await activateBucket(req.params.bucketId);
    return res.status(200).json({ success: true, message: "Bucket activated successfully" });
  } catch (error) {
    console.error("patchAdminMediaBucketActivate error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteAdminMediaBucket(req, res) {
  try {
    await removeBucket(req.params.bucketId);
    return res.status(200).json({ success: true, message: "Bucket removed successfully" });
  } catch (error) {
    console.error("deleteAdminMediaBucket error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}