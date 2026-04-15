import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  listProjects,
  createProject,
} from "./projects.controller.js";

const router = Router();

router.get("/", requireAuth, listProjects);
router.post("/", requireAuth, createProject);

export default router;