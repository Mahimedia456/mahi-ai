import { ZodError } from "zod";
import {
  createVideoStudioJobSchema,
  getUploadUrlSchema,
  listVideoStudioJobsQuerySchema,
  listVideoStudioLibraryQuerySchema,
  saveAssetSchema,
} from "./videoStudio.validation.js";
import {
  createVideoStudioJob,
  createVideoStudioUploadUrl,
  getVideoStudioJobById,
  listVideoStudioJobs,
  listVideoStudioLibrary,
  saveVideoStudioAsset,
} from "./videoStudio.service.js";

function getAuthUserId(req) {
  return req.user?.id;
}

function handleControllerError(res, error, fallbackMessage, statusCode = 400) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues?.[0]?.message || fallbackMessage,
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || fallbackMessage,
  });
}

export async function getVideoStudioUploadUrlController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const payload = getUploadUrlSchema.parse(req.body);

    const result = await createVideoStudioUploadUrl({
      userId,
      kind: payload.kind,
      fileName: payload.fileName,
      contentType: payload.contentType,
    });

    return res.status(200).json({
      success: true,
      message: "Upload URL created successfully.",
      data: result,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to create upload URL."
    );
  }
}

export async function createVideoStudioJobController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const payload = createVideoStudioJobSchema.parse(req.body);

    const job = await createVideoStudioJob({ userId, payload });

    return res.status(201).json({
      success: true,
      message: "Video generation job created successfully.",
      data: job,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to create video job."
    );
  }
}

export async function listVideoStudioJobsController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const query = listVideoStudioJobsQuerySchema.parse(req.query);

    const result = await listVideoStudioJobs({
      userId,
      ...query,
    });

    return res.status(200).json({
      success: true,
      message: "Video jobs fetched successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to fetch video jobs."
    );
  }
}

export async function getVideoStudioJobController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const { jobId } = req.params;

    const job = await getVideoStudioJobById({ userId, jobId });

    return res.status(200).json({
      success: true,
      message: "Video job fetched successfully.",
      data: job,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Video job not found.",
      404
    );
  }
}

export async function saveVideoStudioAssetController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const payload = saveAssetSchema.parse(req.body);

    const asset = await saveVideoStudioAsset({ userId, payload });

    return res.status(201).json({
      success: true,
      message: "Video asset saved successfully.",
      data: asset,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to save video asset."
    );
  }
}

export async function listVideoStudioLibraryController(req, res) {
  try {
    const userId = getAuthUserId(req);
    const query = listVideoStudioLibraryQuerySchema.parse(req.query);

    const result = await listVideoStudioLibrary({
      userId,
      ...query,
    });

    return res.status(200).json({
      success: true,
      message: "Video library fetched successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to fetch video library."
    );
  }
}