import { buildSystemPrompt } from "./ai.prompts.js";
import { generateChatCompletion } from "./ai.provider.js";
import { searchMemory } from "../../vector/searchMemory.js";
import { tools } from "../../tools/toolRegistry.js";

export function buildChatMessages({ history, userMessage, memoryContext = "" }) {
  const systemPrompt = buildSystemPrompt();

  const systemContent = memoryContext
    ? `${systemPrompt}\n\nRelevant memory:\n${memoryContext}`
    : systemPrompt;

  return [
    {
      role: "system",
      content: systemContent,
    },
    ...history,
    {
      role: "user",
      content: userMessage,
    },
  ];
}

export async function executeTool(toolName, args) {

  const tool = tools[toolName];

  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }

  return await tool(args);
}

export async function runBasicChatCompletion({
  history,
  userMessage,
  model,
  userId,
  projectId = null,
}) {
  let memoryContext = "";

  try {
    if (userId && userMessage) {
      const memories = await searchMemory({
        query: userMessage,
        userId,
        projectId,
      });

      if (Array.isArray(memories) && memories.length) {
        memoryContext = memories.join("\n");
      }
    }
  } catch (error) {
    console.error("Memory search failed:", error.message);
  }

  const messages = buildChatMessages({
    history,
    userMessage,
    memoryContext,
  });

  const result = await generateChatCompletion({
    messages,
    model,
  });

  const content =
    result?.message?.content ||
    result?.response ||
    "I could not generate a response right now.";

  return {
    raw: result,
    content,
    messages,
    memoryContext,
  };
}