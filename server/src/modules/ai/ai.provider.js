import axios from "axios";
import { env } from "../../config/env.js";

export async function generateChatCompletion({ messages, model }) {
  const response = await axios.post(
    `${env.vllmBaseUrl}/chat/completions`,
    {
      model: model || env.aiDefaultModel,
      messages,
      temperature: 0.7,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${env.vllmApiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  return response.data;
}