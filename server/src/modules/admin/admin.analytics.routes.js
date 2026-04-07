import { Router } from "express";
import {
  getAdminAnalyticsStats,
  getAdminAnalyticsChart,
} from "./admin.analytics.controller.js";

const router = Router();

router.get("/stats", getAdminAnalyticsStats);
router.get("/chart", getAdminAnalyticsChart);

export default router;