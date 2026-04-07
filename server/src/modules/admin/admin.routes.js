import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import {
  getOverview,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserActivity,
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getTransactions,
  getRefunds
} from "./admin.controller.js";
import adminContentRoutes from "./admin.content.routes.js";
import adminStorageRoutes from "./admin.storage.routes.js";
import adminModelsRoutes from "./admin.models.routes.js";
import adminAnalyticsRoutes from "./admin.analytics.routes.js";
import adminLogsRoutes from "./admin.logs.routes.js";
import adminSettingsRoutes from "./admin.settings.routes.js";
import adminNotificationsRoutes from "./admin.notifications.routes.js";
import adminProfileRoutes from "./admin.profile.routes.js";

const router = Router();

router.get("/overview", requireAuth, requireAdmin, getOverview);

router.get("/users", requireAuth, requireAdmin, getUsers);
router.get("/users/activity", requireAuth, requireAdmin, getUserActivity);
router.get("/users/:id", requireAuth, requireAdmin, getUserById);
router.post("/users", requireAuth, requireAdmin, createUser);
router.patch("/users/:id", requireAuth, requireAdmin, updateUser);
router.delete("/users/:id", requireAuth, requireAdmin, deleteUser);

router.get("/plans", requireAuth, requireAdmin, getPlans);
router.get("/plans/:id", requireAuth, requireAdmin, getPlanById);
router.post("/plans", requireAuth, requireAdmin, createPlan);
router.patch("/plans/:id", requireAuth, requireAdmin, updatePlan);
router.delete("/plans/:id", requireAuth, requireAdmin, deletePlan);

router.get("/transactions", requireAuth, requireAdmin, getTransactions);
router.get("/refunds", requireAuth, requireAdmin, getRefunds);

router.use("/content", requireAuth, requireAdmin, adminContentRoutes);
router.use("/storage", requireAuth, requireAdmin, adminStorageRoutes);
router.use("/models", requireAuth, requireAdmin, adminModelsRoutes);
router.use("/analytics", requireAuth, requireAdmin, adminAnalyticsRoutes);
router.use("/logs", requireAuth, requireAdmin, adminLogsRoutes);
router.use("/settings", requireAuth, requireAdmin, adminSettingsRoutes);
router.use("/notifications", requireAuth, requireAdmin, adminNotificationsRoutes);
router.use("/profile", requireAuth, requireAdmin, adminProfileRoutes);

export default router;