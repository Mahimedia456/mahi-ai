import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import {
  getAdminProfile,
  updateAdminProfile
} from "./admin.profile.controller.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAdminProfile);
router.patch("/", requireAuth, requireAdmin, updateAdminProfile);

export default router;