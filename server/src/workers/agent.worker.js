import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import { env } from "../config/env.js";
import {
  getRecentMessagesForAiService,
  markRunStatusService,
  updateAssistantMessageService,
} from "../modules/chats/chat.service.js";
import { estimateTokens } from "../utils/tokens.js";

const worker = new Worker(
  "agent-runs",
  async (job) => {
    const {
      runId,
      threadId,
      triggerMessageId,
      assistantMessageId,
      model,
    } = job.data;

    try {
      await markRunStatusService({
        runId,
        status: "planning",
        startedAt: new Date().toISOString(),
      });

      const recentMessages = await getRecentMessagesForAiService({
        threadId,
        limit: 20,
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

      await markRunStatusService({
        runId,
        status: "generating",
      });

      const response = await axios.post(
        `${env.pythonAgentUrl}/generate`,
        {
          history,
          prompt: userMessage,
          model: model || env.aiDefaultModel,
        },
        {
          timeout: 120000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const content =
        response.data?.data?.content ||
        response.data?.content ||
        "I could not generate a response right now.";

      await updateAssistantMessageService({
        messageId: assistantMessageId,
        content,
        status: "completed",
        tokenOutput: estimateTokens(content),
      });

      await markRunStatusService({
        runId,
        status: "completed",
        finishedAt: new Date().toISOString(),
      });

      return {
        success: true,
        runId,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Agent worker failed";

      await updateAssistantMessageService({
        messageId: assistantMessageId,
        content: `Error: ${message}`,
        status: "failed",
        tokenOutput: 0,
      });

      await markRunStatusService({
        runId,
        status: "failed",
        errorText: message,
        finishedAt: new Date().toISOString(),
      });

      throw error;
    }
  },
  {
    connection: redisConnection,
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