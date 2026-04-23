import "dotenv/config";
import { Queue } from "bullmq";

const queue = new Queue("image-studio", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});

async function clear() {
  console.log("Clearing image-studio queue...");

  await queue.obliterate({ force: true });

  console.log("Image Studio queue fully cleared");
  await queue.close();
  process.exit(0);
}

clear().catch((err) => {
  console.error("Failed to clear queue:", err);
  process.exit(1);
});