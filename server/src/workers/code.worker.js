import { Worker } from "bullmq";
import { redisConnection } from "../queue/redis.js";
import axios from "axios";

const worker = new Worker(
  "code-jobs",
  async (job) => {

    const { code } = job.data;

    const res = await axios.post(
      "http://127.0.0.1:8400/run_code",
      { code }
    );

    return res.data;
  },
  {
    connection: redisConnection,
  }
);

worker.on("ready", () => {
  console.log("Code worker ready");
});