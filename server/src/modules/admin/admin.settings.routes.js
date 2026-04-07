import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import {
  getSettings,
  updateSettings,
  getAiLimits,
  updateAiLimits,
  getBlockedWords,
  addBlockedWord,
  deleteBlockedWord
} from "./admin.settings.controller.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getSettings);
router.post("/", requireAuth, requireAdmin, updateSettings);

router.get("/ai-limits", requireAuth, requireAdmin, getAiLimits);
router.post("/ai-limits", requireAuth, requireAdmin, updateAiLimits);

router.get("/blocked-words", requireAuth, requireAdmin, getBlockedWords);
router.post("/blocked-words", requireAuth, requireAdmin, addBlockedWord);
router.delete("/blocked-words/:id", requireAuth, requireAdmin, deleteBlockedWord);

export default router;