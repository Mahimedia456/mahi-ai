import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead
} from "./admin.notifications.controller.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAdminNotifications);
router.patch("/:id/read", requireAuth, requireAdmin, markAdminNotificationRead);
router.patch("/read-all", requireAuth, requireAdmin, markAllAdminNotificationsRead);

export default router;