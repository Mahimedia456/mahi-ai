import axios from "axios";
import { env } from "../../config/env.js";

function resolveModel(mode, explicitModel) {
  if (explicitModel) return explicitModel;
  if (mode === "code") return env.ollamaCodeModel;
  if (mode === "fast") return env.ollamaFastModel;
  return env.ollamaChatModel;
}

function buildOllamaOptions() {
  return {
    num_predict: env.ollamaNumPredict,
    num_ctx: env.ollamaNumCtx,
    temperature: env.ollamaTemperature,
    top_p: env.ollamaTopP,
    top_k: env.ollamaTopK,
    repeat_penalty: env.ollamaRepeatPenalty,
  };
}

export async function generateChatCompletion({ messages, model, mode = "chat" }) {
  const response = await axios.post(
    `${env.ollamaBaseUrl}/api/chat`,
    {
      model: resolveModel(mode, model),
      messages,
      stream: false,
      options: buildOllamaOptions(),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 300000,
    }
  );

  return response.data;
}