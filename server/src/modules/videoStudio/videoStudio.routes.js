import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  createVideoStudioJobController,
  getVideoStudioJobController,
  getVideoStudioUploadUrlController,
  listVideoStudioJobsController,
  listVideoStudioLibraryController,
  saveVideoStudioAssetController,
} from "./videoStudio.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/upload-url", getVideoStudioUploadUrlController);
router.post("/jobs", createVideoStudioJobController);
router.get("/jobs", listVideoStudioJobsController);
router.get("/jobs/:jobId", getVideoStudioJobController);
router.post("/assets/save", saveVideoStudioAssetController);
router.get("/library", listVideoStudioLibraryController);

export default router;