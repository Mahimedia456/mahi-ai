import app from "./app.js";
import { env } from "./config/env.js";
import { testDatabaseConnection } from "./config/db.js";

async function startServer() {
  app.listen(env.port, async () => {
    console.log("========================================");
    console.log(`🚀 Mahi AI API running on port ${env.port}`);
    console.log(`🌐 Backend URL: http://localhost:${env.port}`);
    console.log(`🔗 API Base URL: http://localhost:${env.port}/api`);
    console.log(`🖥 Frontend Allowed Origin: ${env.appUrl}`);
    console.log("========================================");

    await testDatabaseConnection();
    console.log("========================================");
  });
}

startServer();