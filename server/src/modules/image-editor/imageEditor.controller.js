import {
  createJob,
  createSignedUploadUrl,
  getJobById,
  listJobs,
} from "./imageEditor.service.js";

const allowedKinds = ["inputs", "masks"];
const allowedTools = [
  "generative_fill",
  "remove_background",
  "replace_background",
  "add_object",
  "erase_element",
  "upscale",
  "face_enhance",
  "noise_reduction",
];

export async function getUploadUrl(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    const { kind, fileName } = req.body;

    if (!allowedKinds.includes(kind)) {
      return res.status(400).json({
        success: false,
        message: "Invalid upload kind",
      });
    }

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "fileName is required",
      });
    }

    const result = await createSignedUploadUrl({
      kind,
      userId,
      fileName,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function createImageEditorJob(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      toolType,
      prompt,
      negativePrompt,
      inputPath,
      maskPath,
      strength,
      scaleFactor,
      faceEnhance,
      denoise,
      meta,
    } = req.body;

    if (!allowedTools.includes(toolType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid toolType",
      });
    }

    if (!inputPath) {
      return res.status(400).json({
        success: false,
        message: "inputPath is required",
      });
    }

    const needsMask = ["generative_fill", "add_object", "erase_element"];
    if (needsMask.includes(toolType) && !maskPath) {
      return res.status(400).json({
        success: false,
        message: "maskPath is required for this tool",
      });
    }

    const job = await createJob({
      userId,
      toolType,
      prompt,
      negativePrompt,
      inputPath,
      maskPath,
      strength,
      scaleFactor,
      faceEnhance,
      denoise,
      meta,
    });

    return res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
}

export async function getImageEditorJobs(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    const jobs = await listJobs(userId);

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(error);
  }
}

export async function getImageEditorJob(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    const { jobId } = req.params;

    const job = await getJobById(jobId, userId);

    return res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
}