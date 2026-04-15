import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { initSSE, sendSSE, startSSEHeartbeat } from "../../utils/sse.js";
import { sub } from "../../queue/pubsub.js";
import {
  createThreadSchema,
  updateThreadSchema,
  createMessageSchema,
  listThreadsSchema,
} from "./chat.validation.js";
import {
  resolveAppUserIdService,
  listThreadsService,
  createThreadService,
  updateThreadService,
  deleteThreadService,
  getThreadMessagesService,
  createMessageAndRunService,
  getRunByIdService,
} from "./chat.service.js";

function getAuthContext(req) {
  return {
    authUserId: req.user?.userId || req.user?.id || null,
    email: req.user?.email || null,
    fullName: req.user?.fullName || req.user?.name || null,
  };
}

export const listThreads = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const parsed = listThreadsSchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid query params", parsed.error.flatten());
  }

  const threads = await listThreadsService({
    appUserId: appUser.id,
    projectId: parsed.data.projectId,
  });

  return res.json({
    success: true,
    data: threads,
  });
});

export const createThread = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const parsed = createThreadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid request body", parsed.error.flatten());
  }

  const thread = await createThreadService({
    appUserId: appUser.id,
    projectId: parsed.data.projectId ?? null,
    title: parsed.data.title,
    mode: parsed.data.mode || "chat",
  });

  return res.status(201).json({
    success: true,
    data: thread,
  });
});

export const updateThread = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const parsed = updateThreadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid request body", parsed.error.flatten());
  }

  const thread = await updateThreadService({
    threadId: req.params.threadId,
    appUserId: appUser.id,
    payload: parsed.data,
  });

  return res.json({
    success: true,
    data: thread,
  });
});

export const deleteThread = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const thread = await deleteThreadService({
    threadId: req.params.threadId,
    appUserId: appUser.id,
  });

  return res.json({
    success: true,
    data: thread,
  });
});

export const getThreadMessages = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const messages = await getThreadMessagesService({
    threadId: req.params.threadId,
    appUserId: appUser.id,
  });

  return res.json({
    success: true,
    data: messages,
  });
});

export const createMessage = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const parsed = createMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Invalid request body", parsed.error.flatten());
  }

  const result = await createMessageAndRunService({
    threadId: req.params.threadId,
    appUserId: appUser.id,
    content: parsed.data.content,
    model: parsed.data.model,
    mode: parsed.data.mode || "chat",
    options: parsed.data.options || {},
  });

  return res.status(201).json({
    success: true,
    data: result,
  });
});

export const streamRun = asyncHandler(async (req, res) => {
  const authContext = getAuthContext(req);
  const appUser = await resolveAppUserIdService(authContext);

  const run = await getRunByIdService({
    runId: req.params.runId,
    threadId: req.params.threadId,
    appUserId: appUser.id,
  });

  if (!run) {
    throw new ApiError(404, "Run not found");
  }

  initSSE(res);

  const channel = `run:${run.id}`;
  await sub.subscribe(channel);

  sendSSE(res, "ready", {
    type: "ready",
    runId: run.id,
    status: run.status,
  });

  const heartbeat = startSSEHeartbeat(res);

  const handleMessage = (incomingChannel, message) => {
    if (incomingChannel !== channel) return;

    let parsed = null;

    try {
      parsed = JSON.parse(message);
    } catch {
      parsed = { type: "error", message: "Invalid stream payload" };
    }

    const eventName =
      parsed?.type === "ready"
        ? "ready"
        : parsed?.type === "progress"
        ? "progress"
        : parsed?.type === "complete"
        ? "complete"
        : parsed?.type === "error"
        ? "error"
        : "delta";

    sendSSE(res, eventName, parsed);
  };

  sub.on("message", handleMessage);

  req.on("close", async () => {
    clearInterval(heartbeat);
    sub.off("message", handleMessage);
    await sub.unsubscribe(channel);
    res.end();
  });
});