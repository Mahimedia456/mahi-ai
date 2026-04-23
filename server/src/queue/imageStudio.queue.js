import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const imageStudioQueue = new Queue("image-studio", {
  connection: redisConnection,
});