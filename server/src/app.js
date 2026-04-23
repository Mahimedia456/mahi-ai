import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import chatRoutes from "./modules/chats/chat.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import projectRoutes from "./modules/projects/projects.routes.js";
import imageEditorRoutes from "./modules/image-editor/imageEditor.routes.js";
import imageStudioRoutes from "./modules/imageStudio/imageStudio.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.appUrl],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Mahi AI backend is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Mahi AI API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/image-editor", imageEditorRoutes);
app.use("/api/image-studio", imageStudioRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;