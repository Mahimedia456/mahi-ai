import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const videoStudioQueue = new Queue("video-studio", {
  connection: redisConnection,
});