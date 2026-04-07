import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getDashboard } from "./user.controller.js";

const router = Router();

router.get("/dashboard", requireAuth, getDashboard);

export default router;