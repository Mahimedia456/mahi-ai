import { Queue } from "bullmq";
import { redisConnection } from "../../queue/redis.js";

export const imageEditorQueue = new Queue("image-editor", {
  connection: redisConnection,
});