import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  listThreads,
  createThread,
  getThreadMessages,
  createMessage,
  streamRun,
} from "./chat.controller.js";

const router = Router();

router.get("/threads", requireAuth, listThreads);
router.post("/threads", requireAuth, createThread);
router.get("/threads/:threadId/messages", requireAuth, getThreadMessages);
router.post("/threads/:threadId/messages", requireAuth, createMessage);
router.get("/threads/:threadId/stream/:runId", requireAuth, streamRun);

export default router;