import { buildSystemPrompt } from "./ai.prompts.js";
import { generateChatCompletion } from "./ai.provider.js";

export function buildChatMessages({ history, userMessage }) {
  return [
    {
      role: "system",
      content: buildSystemPrompt(),
    },
    ...history,
    {
      role: "user",
      content: userMessage,
    },
  ];
}

export async function runBasicChatCompletion({ history, userMessage, model }) {
  const messages = buildChatMessages({
    history,
    userMessage,
  });

  const result = await generateChatCompletion({
    messages,
    model,
  });

  const content =
    result?.choices?.[0]?.message?.content ||
    "I could not generate a response right now.";

  return {
    raw: result,
    content,
    messages,
  };
}