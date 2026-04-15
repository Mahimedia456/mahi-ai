import { pool } from "../../config/db.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import { estimateTokens } from "../../utils/tokens.js";
import { enqueueAgentRun, enqueueImageJob } from "../../queue/producers.js";

const VALID_TEXT_MODES = new Set(["chat", "fast", "code"]);

function isModeValue(value) {
  return VALID_TEXT_MODES.has(String(value || "").trim().toLowerCase());
}

function normalizeTextModel({ requestedModel, mode, threadModelSlug }) {
  const explicit = String(requestedModel || "").trim();

  // If frontend/backend sends model="fast" or "chat" or "code",
  // treat it as mode, not as an actual Ollama model.
  if (explicit && !isModeValue(explicit)) {
    return explicit;
  }

  const resolvedMode = String(mode || explicit || threadModelSlug || "chat")
    .trim()
    .toLowerCase();

  if (resolvedMode === "code") {
    return env.ollamaCodeModel || "qwen2.5-coder:14b";
  }

  if (resolvedMode === "fast") {
    return env.ollamaFastModel || "phi3:mini";
  }

  return env.ollamaChatModel || "phi3:mini";
}

function normalizeImageModel(requestedModel) {
  const value = String(requestedModel || "").trim().toLowerCase();
  const defaultModel = String(env.imageDefaultModel || "realvisxl")
    .trim()
    .toLowerCase();

  if (!value) return defaultModel;

  if (
    value === "realvisxl" ||
    value === "realvis" ||
    value === "realvis xl" ||
    value === "sg161222/realvisxl_v5.0"
  ) {
    return "realvisxl";
  }

  if (
    value === "sdxl-turbo" ||
    value === "sdxl turbo" ||
    value === "stabilityai/sdxl-turbo"
  ) {
    return "sdxl-turbo";
  }

  if (
    value === "sdxl-base" ||
    value === "sdxl base" ||
    value === "stabilityai/stable-diffusion-xl-base-1.0"
  ) {
    return "sdxl-base";
  }

  return defaultModel;
}

function buildImageOptions(options = {}) {
  const width = Math.max(
    512,
    Math.min(Number(options.width || env.imageDefaultWidth), env.imageMaxWidth)
  );

  const height = Math.max(
    512,
    Math.min(Number(options.height || env.imageDefaultHeight), env.imageMaxHeight)
  );

  const quality =
    options.quality === "high" || options.quality === "fast"
      ? options.quality
      : env.imageDefaultQuality;

  const defaultSteps =
    quality === "high"
      ? Math.max(Number(env.imageDefaultSteps || 30), 24)
      : Number(env.imageDefaultSteps || 18);

  const maxSteps =
    quality === "high"
      ? Math.max(Number(env.imageMaxSteps || 50), 24)
      : Math.max(Number(env.imageFastMaxSteps || 20), 8);

  const minSteps = quality === "high" ? 12 : 1;

  const steps = Math.max(
    minSteps,
    Math.min(Number(options.steps || defaultSteps), maxSteps)
  );

  const guidance =
    options.guidance !== undefined
      ? Number(options.guidance)
      : Number(env.imageDefaultGuidance || 6);

  const seed =
    options.seed === undefined || options.seed === null
      ? null
      : Number.isFinite(Number(options.seed))
      ? Number(options.seed)
      : null;

  return {
    width,
    height,
    steps,
    guidance,
    seed,
    negativePrompt: String(options.negativePrompt || "").trim(),
    quality,
  };
}

export async function resolveAppUserIdService({
  authUserId,
  email = null,
  fullName = null,
}) {
  if (!authUserId && !email) {
    throw new ApiError(401, "Unauthorized user context missing");
  }

  if (authUserId) {
    const byAuthUser = await pool.query(
      `
        select id, auth_user_id, email, full_name
        from app_users
        where auth_user_id = $1
        limit 1
      `,
      [authUserId]
    );

    if (byAuthUser.rows[0]) return byAuthUser.rows[0];
  }

  if (email) {
    const byEmail = await pool.query(
      `
        select id, auth_user_id, email, full_name
        from app_users
        where email = $1
        limit 1
      `,
      [email]
    );

    if (byEmail.rows[0]) {
      if (!byEmail.rows[0].auth_user_id && authUserId) {
        const updated = await pool.query(
          `
            update app_users
            set auth_user_id = $1,
                updated_at = now()
            where id = $2
            returning id, auth_user_id, email, full_name
          `,
          [authUserId, byEmail.rows[0].id]
        );

        return updated.rows[0];
      }

      return byEmail.rows[0];
    }
  }

  const generatedEmail =
    email || (authUserId ? `${String(authUserId)}@mahi-ai.local` : null);

  if (!generatedEmail) {
    throw new ApiError(404, "Unable to resolve or create app user");
  }

  const created = await pool.query(
    `
      insert into app_users (
        auth_user_id,
        full_name,
        email,
        role,
        status,
        created_at,
        updated_at
      )
      values ($1, $2, $3, 'user', 'active', now(), now())
      returning id, auth_user_id, email, full_name
    `,
    [authUserId || null, fullName || "Mahi AI User", generatedEmail]
  );

  return created.rows[0];
}

export async function listThreadsService({ appUserId, projectId }) {
  const values = [appUserId];
  let query = `
    select *
    from chat_threads
    where user_id = $1
      and archived = false
  `;

  if (projectId) {
    values.push(projectId);
    query += ` and project_id = $${values.length}`;
  }

  query += ` order by coalesce(last_message_at, created_at) desc`;

  const result = await pool.query(query, values);
  return result.rows;
}

export async function createThreadService({
  appUserId,
  projectId = null,
  title,
  mode = "chat",
}) {
  const result = await pool.query(
    `
      insert into chat_threads (
        project_id,
        user_id,
        title,
        title_source,
        mode,
        visibility,
        pinned,
        archived,
        last_message_at,
        metadata,
        created_at,
        updated_at
      )
      values ($1, $2, $3, 'auto', $4, 'private', false, false, now(), '{}'::jsonb, now(), now())
      returning *
    `,
    [projectId, appUserId, title || "New Chat", mode]
  );

  return result.rows[0];
}

export async function updateThreadService({ threadId, appUserId, payload }) {
  const fields = [];
  const values = [];
  let index = 1;

  if (payload.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(payload.title);
    fields.push(`title_source = $${index++}`);
    values.push("user");
  }

  if (payload.projectId !== undefined) {
    fields.push(`project_id = $${index++}`);
    values.push(payload.projectId || null);
  }

  if (payload.archived !== undefined) {
    fields.push(`archived = $${index++}`);
    values.push(payload.archived);
  }

  fields.push(`updated_at = now()`);

  values.push(threadId);
  values.push(appUserId);

  const result = await pool.query(
    `
      update chat_threads
      set ${fields.join(", ")}
      where id = $${index++} and user_id = $${index}
      returning *
    `,
    values
  );

  if (!result.rows[0]) {
    throw new ApiError(404, "Thread not found");
  }

  return result.rows[0];
}

export async function deleteThreadService({ threadId, appUserId }) {
  const result = await pool.query(
    `
      update chat_threads
      set archived = true,
          updated_at = now()
      where id = $1 and user_id = $2
      returning *
    `,
    [threadId, appUserId]
  );

  if (!result.rows[0]) {
    throw new ApiError(404, "Thread not found");
  }

  return result.rows[0];
}

export async function getThreadByIdService({ threadId, appUserId }) {
  const result = await pool.query(
    `
      select *
      from chat_threads
      where id = $1 and user_id = $2
      limit 1
    `,
    [threadId, appUserId]
  );

  return result.rows[0] || null;
}

export async function getThreadMessagesService({ threadId, appUserId }) {
  const thread = await getThreadByIdService({ threadId, appUserId });

  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const result = await pool.query(
    `
      select *
      from chat_messages
      where thread_id = $1
      order by created_at asc
    `,
    [threadId]
  );

  return result.rows;
}

export async function createMessageAndRunService({
  threadId,
  appUserId,
  content,
  model,
  mode = "chat",
  options = {},
}) {
  const thread = await getThreadByIdService({ threadId, appUserId });

  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const resolvedImageModel =
    mode === "image" ? normalizeImageModel(model || thread.model_slug) : null;

  const resolvedTextModel =
    mode !== "image"
      ? normalizeTextModel({
          requestedModel: model,
          mode,
          threadModelSlug: thread.model_slug,
        })
      : null;

  const modelName = mode === "image" ? resolvedImageModel : resolvedTextModel;

  const userMessageResult = await pool.query(
    `
      insert into chat_messages (
        thread_id,
        user_id,
        role,
        kind,
        content,
        content_json,
        status,
        model_name,
        token_input,
        token_output,
        created_at,
        updated_at
      )
      values ($1, $2, 'user', 'text', $3, '{}'::jsonb, 'completed', $4, $5, 0, now(), now())
      returning *
    `,
    [threadId, appUserId, content, modelName, estimateTokens(content)]
  );

  const userMessage = userMessageResult.rows[0];

  const assistantKind = mode === "image" ? "image" : "text";

  const assistantResult = await pool.query(
    `
      insert into chat_messages (
        thread_id,
        user_id,
        role,
        kind,
        content,
        content_json,
        status,
        model_name,
        token_input,
        token_output,
        created_at,
        updated_at
      )
      values ($1, null, 'assistant', $2, '', '{}'::jsonb, 'streaming', $3, 0, 0, now(), now())
      returning *
    `,
    [threadId, assistantKind, modelName]
  );

  const assistantMessage = assistantResult.rows[0];

  const runResult = await pool.query(
    `
      insert into agent_runs (
        thread_id,
        trigger_message_id,
        assistant_message_id,
        user_id,
        status,
        model_name,
        route_name,
        usage_json,
        trace_json,
        started_at,
        created_at
      )
      values ($1, $2, $3, $4, 'queued', $5, $6, '{}'::jsonb, '{}'::jsonb, null, now())
      returning *
    `,
    [
      threadId,
      userMessage.id,
      assistantMessage.id,
      appUserId,
      modelName,
      mode === "image" ? "image_generation" : "general_chat",
    ]
  );

  const run = runResult.rows[0];

  await pool.query(
    `
      update chat_threads
      set last_message_at = now(),
          updated_at = now(),
          mode = $2
      where id = $1
    `,
    [threadId, mode]
  );

  if (mode === "image") {
    const imageOptions = buildImageOptions(options);

    await enqueueImageJob({
      runId: run.id,
      threadId,
      userId: appUserId,
      projectId: thread.project_id || null,
      triggerMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
      prompt: content,
      model: resolvedImageModel,
      mode,
      ...imageOptions,
    });
  } else {
    await enqueueAgentRun({
      runId: run.id,
      threadId,
      userId: appUserId,
      projectId: thread.project_id || null,
      triggerMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
      model: modelName,
      mode,
    });
  }

  return {
    userMessage,
    assistantMessage,
    run,
  };
}

export async function getRunByIdService({ runId, threadId, appUserId }) {
  const result = await pool.query(
    `
      select r.*
      from agent_runs r
      inner join chat_threads t on t.id = r.thread_id
      where r.id = $1
        and r.thread_id = $2
        and t.user_id = $3
      limit 1
    `,
    [runId, threadId, appUserId]
  );

  return result.rows[0] || null;
}

export async function getRecentMessagesForAiService({ threadId, limit = 40 }) {
  const result = await pool.query(
    `
      select id, role, content, created_at
      from chat_messages
      where thread_id = $1
        and role in ('user', 'assistant')
      order by created_at desc
      limit $2
    `,
    [threadId, limit]
  );

  return result.rows.reverse();
}

export async function markRunStatusService({
  runId,
  status,
  errorText = null,
  startedAt = null,
  finishedAt = null,
}) {
  await pool.query(
    `
      update agent_runs
      set status = $2,
          error_text = $3,
          started_at = coalesce($4, started_at),
          finished_at = $5
      where id = $1
    `,
    [runId, status, errorText, startedAt, finishedAt]
  );
}

export async function touchThreadOnStreamService({ threadId }) {
  await pool.query(
    `
      update chat_threads
      set last_message_at = now(),
          updated_at = now()
      where id = $1
    `,
    [threadId]
  );
}

export async function updateAssistantMessageService({
  messageId,
  content,
  status = "completed",
  tokenOutput = 0,
  contentJson = null,
}) {
  const result = await pool.query(
    `
      update chat_messages
      set content = $2,
          status = $3,
          token_output = $4,
          content_json = coalesce($5, content_json),
          updated_at = now()
      where id = $1
      returning *
    `,
    [messageId, content, status, tokenOutput, contentJson]
  );

  return result.rows[0];
}