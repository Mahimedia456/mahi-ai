import { asyncHandler } from "../../utils/asyncHandler.js";
import { runBasicChatCompletion } from "./ai.service.js";

export const testAiChat = asyncHandler(async (req, res) => {
  const { prompt, history = [], model } = req.body;

  const result = await runBasicChatCompletion({
    history,
    userMessage: prompt,
    model,
  });

  return res.json({
    success: true,
    data: result,
  });
});