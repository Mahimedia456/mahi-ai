import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import * as controller from "./imageStudio.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/presets", controller.listPresets);
router.get("/jobs", controller.listJobs);
router.post("/jobs", controller.createJob);
router.get("/jobs/:jobId", controller.getJob);
router.post("/jobs/:jobId/cancel", controller.cancelJob);

router.get("/outputs", controller.listOutputs);
router.patch("/outputs/:outputId/archive", controller.archiveOutput);
router.delete("/outputs/:outputId", controller.deleteOutput);

router.get("/assets", controller.listAssets);
router.post("/assets/upload-url", controller.createAssetUpload);
router.post("/assets/register", controller.registerAsset);

export default router;