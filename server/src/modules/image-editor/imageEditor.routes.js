import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  createImageEditorJob,
  getImageEditorJob,
  getImageEditorJobs,
  getUploadUrl,
} from "./imageEditor.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/upload-url", getUploadUrl);
router.post("/jobs", createImageEditorJob);
router.get("/jobs", getImageEditorJobs);
router.get("/jobs/:jobId", getImageEditorJob);

export default router;