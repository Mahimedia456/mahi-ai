import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { imageEditorQueue } = await import("../src/modules/image-editor/imageEditor.queue.js");

async function run() {
  console.log("Cleaning image-editor queue...");

  await imageEditorQueue.pause();
  await imageEditorQueue.drain();
  await imageEditorQueue.clean(0, 1000, "wait");
  await imageEditorQueue.clean(0, 1000, "delayed");
  await imageEditorQueue.clean(0, 1000, "failed");
  await imageEditorQueue.clean(0, 1000, "completed");
  await imageEditorQueue.obliterate({ force: true });

  console.log("image-editor queue cleared");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});