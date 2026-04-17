import app from "./app.js";
import { env } from "./config/env.js";
import { testDatabaseConnection } from "./config/db.js";
import { startImageEditorWorker } from "./workers/imageEditor.worker.js";

async function startServer() {
  try {
    await testDatabaseConnection();

    startImageEditorWorker();

    app.listen(env.port, () => {
      console.log("========================================");
      console.log(`🚀 Mahi AI API running on port ${env.port}`);
      console.log(`🌐 Backend URL: http://localhost:${env.port}`);
      console.log(`🔗 API Base URL: http://localhost:${env.port}/api`);
      console.log(`🖥 Frontend Allowed Origin: ${env.appUrl}`);
      console.log(`🧠 Python Image Editor: ${env.pythonImageEditorUrl}`);
      console.log("========================================");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();