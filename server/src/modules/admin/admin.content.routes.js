import { Router } from "express";
import multer from "multer";
import {
  getAdminContentStats,
  getAdminContentList,
  getAdminContentDetail,
  patchAdminContent,
  removeAdminContent,
  postAdminContentUpload,
} from "./admin.content.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.get("/stats", getAdminContentStats);
router.get("/", getAdminContentList);
router.get("/:contentId", getAdminContentDetail);
router.patch("/:contentId", patchAdminContent);
router.delete("/:contentId", removeAdminContent);
router.post("/upload", upload.single("file"), postAdminContentUpload);

export default router;