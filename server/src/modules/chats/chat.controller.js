import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { initSSE, sendSSE, startSSEHeartbeat } from "../../utils/sse.js";
import {
  createThreadSchema,
  createMessageSchema,
  listThreadsSchema,
} from "./chat.validation.js";
import {
  listThreadsService,
  createThreadService,
  getThreadMessagesService,
  createMessageAndRunService,
  getRunByIdService,
} from "./chat.service.js";

function getUserId(req) {
  return req.user?.userId || req.user?.id || req.headers["x-user-id"];
}

export const listThreads = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsed = listThreadsSchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid query params", parsed.error.flatten());
  }

  const threads = await listThreadsService({
    userId,
    projectId: parsed.data.projectId,
  });

  return res.json({
    success: true,
    data: threads,
  });
});

export const createThread = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsed = createThreadSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid request body", parsed.error.flatten());
  }

  const thread = await createThreadService({
    userId,
    projectId: parsed.data.projectId ?? null,
    title: parsed.data.title,
    mode: parsed.data.mode || "chat",
  });

  return res.status(201).json({
    success: true,
    data: thread,
  });
});

export const getThreadMessages = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const messages = await getThreadMessagesService({
    threadId: req.params.threadId,
    userId,
  });

  return res.json({
    success: true,
    data: messages,
  });
});

export const createMessage = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsed = createMessageSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid request body", parsed.error.flatten());
  }

  const result = await createMessageAndRunService({
    threadId: req.params.threadId,
    userId,
    content: parsed.data.content,
    model: parsed.data.model,
  });

  return res.status(201).json({
    success: true,
    data: result,
  });
});

export const streamRun = asyncHandler(async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const run = await getRunByIdService({
    runId: req.params.runId,
    threadId: req.params.threadId,
    userId,
  });

  if (!run) {
    throw new ApiError(404, "Run not found");
  }

  initSSE(res);
  sendSSE(res, "ready", {
    success: true,
    runId: run.id,
    status: run.status,
  });

  const heartbeat = startSSEHeartbeat(res);

  req.on("close", () => {
    clearInterval(heartbeat);
    res.end();
  });
});