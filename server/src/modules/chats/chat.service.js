import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { estimateTokens } from "../../utils/tokens.js";
import { enqueueAgentRun } from "../../queue/producers.js";

export async function listThreadsService({ userId, projectId }) {
  const values = [userId];
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
  userId,
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
    [projectId, userId, title || "New Chat", mode]
  );

  return result.rows[0];
}

export async function getThreadByIdService({ threadId, userId }) {
  const result = await pool.query(
    `
      select *
      from chat_threads
      where id = $1 and user_id = $2
      limit 1
    `,
    [threadId, userId]
  );

  return result.rows[0] || null;
}

export async function getThreadMessagesService({ threadId, userId }) {
  const thread = await getThreadByIdService({ threadId, userId });

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
  userId,
  content,
  model,
}) {
  const thread = await getThreadByIdService({ threadId, userId });

  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const modelName = model || thread.model_slug || "mahi-chat";

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
    [threadId, userId, content, modelName, estimateTokens(content)]
  );

  const userMessage = userMessageResult.rows[0];

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
      values ($1, null, 'assistant', 'text', '', '{}'::jsonb, 'streaming', $2, 0, 0, now(), now())
      returning *
    `,
    [threadId, modelName]
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
      values ($1, $2, $3, $4, 'queued', $5, 'general_chat', '{}'::jsonb, '{}'::jsonb, null, now())
      returning *
    `,
    [threadId, userMessage.id, assistantMessage.id, userId, modelName]
  );

  const run = runResult.rows[0];

  await pool.query(
    `
      update chat_threads
      set last_message_at = now(),
          updated_at = now()
      where id = $1
    `,
    [threadId]
  );

  await enqueueAgentRun({
    runId: run.id,
    threadId,
    userId,
    triggerMessageId: userMessage.id,
    assistantMessageId: assistantMessage.id,
    model: modelName,
  });

  return {
    userMessage,
    assistantMessage,
    run,
  };
}

export async function getRunByIdService({ runId, threadId, userId }) {
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
    [runId, threadId, userId]
  );

  return result.rows[0] || null;
}

export async function getRecentMessagesForAiService({
  threadId,
  limit = 20,
}) {
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

export async function updateAssistantMessageService({
  messageId,
  content,
  status = "completed",
  tokenOutput = 0,
}) {
  const result = await pool.query(
    `
      update chat_messages
      set content = $2,
          status = $3,
          token_output = $4,
          updated_at = now()
      where id = $1
      returning *
    `,
    [messageId, content, status, tokenOutput]
  );

  return result.rows[0];
}

export async function appendAssistantMessageDeltaService({
  messageId,
  delta,
}) {
  const result = await pool.query(
    `
      update chat_messages
      set content = coalesce(content, '') || $2,
          updated_at = now()
      where id = $1
      returning *
    `,
    [messageId, delta]
  );

  return result.rows[0];
}