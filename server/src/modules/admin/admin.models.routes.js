import { Router } from "express";
import {
  deleteAdminModel,
  exportAdminModelsCsv,
  exportAdminModelUsageCsv,
  getAdminModelAnalytics,
  getAdminModelDetail,
  getAdminModels,
  getAdminModelStats,
  patchAdminModelStatus,
} from "./admin.models.controller.js";

const router = Router();

router.get("/", getAdminModels);
router.get("/stats", getAdminModelStats);
router.get("/analytics", getAdminModelAnalytics);
router.get("/export/csv", exportAdminModelsCsv);
router.get("/:modelId", getAdminModelDetail);
router.get("/:modelId/export/csv", exportAdminModelUsageCsv);
router.patch("/:modelId/status", patchAdminModelStatus);
router.delete("/:modelId", deleteAdminModel);

export default router;