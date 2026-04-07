import { Router } from "express";
import {
  getAdminLogs,
} from "./admin.logs.controller.js";

const router = Router();

router.get("/", getAdminLogs);

export default router;