import { Router } from "express";
import {
  deleteAdminMediaBucket,
  getAdminMediaBucketDetail,
  getAdminMediaBuckets,
  getAdminStorageSummary,
  getAdminUserStorage,
  patchAdminMediaBucketActivate,
  patchAdminMediaBucketDeactivate,
} from "./admin.storage.controller.js";

const router = Router();

router.get("/usage/summary", getAdminStorageSummary);
router.get("/usage/users", getAdminUserStorage);

router.get("/buckets", getAdminMediaBuckets);
router.get("/buckets/:bucketId", getAdminMediaBucketDetail);
router.patch("/buckets/:bucketId/deactivate", patchAdminMediaBucketDeactivate);
router.patch("/buckets/:bucketId/activate", patchAdminMediaBucketActivate);
router.delete("/buckets/:bucketId", deleteAdminMediaBucket);

export default router;