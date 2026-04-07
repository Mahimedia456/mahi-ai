import { Router } from "express";
import { testAiChat } from "./ai.controller.js";

const router = Router();

router.post("/test-chat", testAiChat);

export default router;