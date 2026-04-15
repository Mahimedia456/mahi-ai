import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import { pub } from "../queue/pubsub.js";
import { env } from "../config/env.js";
import {
  getRecentMessagesForAiService,
  markRunStatusService,
  touchThreadOnStreamService,
  updateAssistantMessageService,
} from "../modules/chats/chat.service.js";
import { estimateTokens } from "../utils/tokens.js";

const STREAM_FLUSH_MS = 120;
const STREAM_FLUSH_MIN_CHARS = 16;
const PROGRESS_REGEX = /\[\[PROGRESS:(.*?)\]\]/g;

async function publishRunEvent(runId, payload) {
  await pub.publish(`run:${runId}`, JSON.stringify(payload));
}

function extractProgressMarkers(text) {
  const progressMessages = [];
  let cleanText = text;

  for (const match of text.matchAll(PROGRESS_REGEX)) {
    progressMessages.push(match[1]);
  }

  cleanText = cleanText.replace(PROGRESS_REGEX, "");
  return { cleanText, progressMessages };
}

const worker = new Worker(
  "agent-runs",
  async (job) => {
    const {
      runId,
      threadId,
      triggerMessageId,
      assistantMessageId,
      model,
      mode = "chat",
      userId,
      projectId,
    } = job.data;

    let fullText = "";

    try {
      await markRunStatusService({
        runId,
        status: "generating",
        startedAt: new Date().toISOString(),
      });

      await publishRunEvent(runId, {
        type: "ready",
        message: "Preparing answer",
      });

      const recentMessages = await getRecentMessagesForAiService({
        threadId,
        limit: 16,
      });

      const history = recentMessages
        .filter((item) => item.id !== triggerMessageId)
        .map((item) => ({
          role: item.role,
          content: item.content || "",
        }));

      const currentUserMessage = recentMessages.find(
        (item) => item.id === triggerMessageId
      );

      const userMessage = currentUserMessage?.content || "";

      const response = await axios.post(
        `${env.pythonAgentUrl}/generate_stream`,
        {
          history,
          prompt: userMessage,
          model,
          mode,
          userId,
          projectId: projectId || null,
        },
        {
          responseType: "stream",
          timeout: 0,
        }
      );

      let lastFlushAt = 0;
      let lastFlushedLength = 0;
      let flushQueue = Promise.resolve();

      const flushPartial = async (force = false) => {
        const now = Date.now();
        const grownBy = fullText.length - lastFlushedLength;

        if (!force) {
          if (grownBy <= 0) return;
          if (
            grownBy < STREAM_FLUSH_MIN_CHARS &&
            now - lastFlushAt < STREAM_FLUSH_MS
          ) {
            return;
          }
        }

        lastFlushAt = now;
        lastFlushedLength = fullText.length;

        await updateAssistantMessageService({
          messageId: assistantMessageId,
          content: fullText,
          status: "streaming",
          tokenOutput: estimateTokens(fullText),
        });

        await touchThreadOnStreamService({ threadId });
      };

      await new Promise((resolve, reject) => {
        response.data.on("data", (chunk) => {
          flushQueue = flushQueue
            .then(async () => {
              const raw = chunk?.toString?.("utf8") || "";
              if (!raw) return;

              const { cleanText, progressMessages } = extractProgressMarkers(raw);

              for (const progress of progressMessages) {
                await publishRunEvent(runId, {
                  type: "progress",
                  message: progress,
                });
              }

              if (!cleanText) return;

              fullText += cleanText;

              await publishRunEvent(runId, {
                type: "delta",
                token: cleanText,
              });

              await flushPartial(false);
            })
            .catch(reject);
        });

        response.data.on("end", () => {
          flushQueue = flushQueue
            .then(async () => {
              await flushPartial(true);

              await updateAssistantMessageService({
                messageId: assistantMessageId,
                content: fullText,
                status: "completed",
                tokenOutput: estimateTokens(fullText),
              });

              await publishRunEvent(runId, {
                type: "complete",
                content: fullText,
              });

              await markRunStatusService({
                runId,
                status: "completed",
                finishedAt: new Date().toISOString(),
              });

              resolve();
            })
            .catch(reject);
        });

        response.data.on("error", (error) => {
          flushQueue = flushQueue
            .then(async () => {
              const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Stream failed";

              await updateAssistantMessageService({
                messageId: assistantMessageId,
                content: fullText || `Error: ${message}`,
                status: "failed",
                tokenOutput: estimateTokens(fullText),
              });

              await publishRunEvent(runId, {
                type: "error",
                message,
              });

              await markRunStatusService({
                runId,
                status: "failed",
                errorText: message,
                finishedAt: new Date().toISOString(),
              });

              reject(error);
            })
            .catch(reject);
        });
      });

      return { success: true, runId };
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Agent worker failed";

      try {
        await updateAssistantMessageService({
          messageId: assistantMessageId,
          content: fullText || `Error: ${message}`,
          status: "failed",
          tokenOutput: estimateTokens(fullText),
        });

        await publishRunEvent(runId, {
          type: "error",
          message,
        });

        await markRunStatusService({
          runId,
          status: "failed",
          errorText: message,
          finishedAt: new Date().toISOString(),
        });
      } catch (_) {}

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

worker.on("ready", () => {
  console.log("✅ Agent worker ready");
});

worker.on("completed", (job) => {
  console.log(`✅ Agent job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`❌ Agent job failed: ${job?.id}`, error.message);
});