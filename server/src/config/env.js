import dotenv from "dotenv";

dotenv.config();

function required(name, fallback = "") {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toBoolean(value, defaultValue = false) {
  if (value === undefined) return defaultValue;
  return String(value).toLowerCase() === "true";
}

function toNumber(value, defaultValue) {
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 4000),
  appUrl: required("APP_URL"),

  databaseUrl: required("DATABASE_URL"),
  directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,

  supabaseUrl: required("SUPABASE_URL"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || "ai-content",
  supabaseStoragePublicUrl:
    process.env.SUPABASE_STORAGE_PUBLIC_URL ||
    `${required("SUPABASE_URL")}/storage/v1/object/public`,

  supabaseS3Endpoint: process.env.SUPABASE_S3_ENDPOINT || "",
  supabaseS3Region: process.env.SUPABASE_S3_REGION || "ap-south-1",
  supabaseS3AccessKey: process.env.SUPABASE_S3_ACCESS_KEY || "",
  supabaseS3SecretKey: process.env.SUPABASE_S3_SECRET_KEY || "",

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  smtpHost: required("SMTP_HOST"),
  smtpPort: toNumber(process.env.SMTP_PORT, 465),
  smtpSecure: toBoolean(process.env.SMTP_SECURE, true),
  smtpUser: required("SMTP_USER"),
  smtpPass: required("SMTP_PASS"),
  mailFrom: required("MAIL_FROM"),

  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: toNumber(process.env.REDIS_PORT, 6379),
  redisPassword: process.env.REDIS_PASSWORD || "",

  aiProvider: process.env.AI_PROVIDER || "self_hosted",

  ollamaBaseUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL || "phi3:mini",
  ollamaCodeModel: process.env.OLLAMA_CODE_MODEL || "qwen2.5-coder:7b",
  ollamaFastModel: process.env.OLLAMA_FAST_MODEL || "phi3:mini",

  ollamaNumPredict: toNumber(process.env.OLLAMA_NUM_PREDICT, 500),
  ollamaNumCtx: toNumber(process.env.OLLAMA_NUM_CTX, 2048),
  ollamaTemperature: Number(process.env.OLLAMA_TEMPERATURE || 0.2),
  ollamaTopP: Number(process.env.OLLAMA_TOP_P || 0.85),
  ollamaTopK: toNumber(process.env.OLLAMA_TOP_K, 30),
  ollamaRepeatPenalty: Number(process.env.OLLAMA_REPEAT_PENALTY || 1.05),

  qdrantUrl: process.env.QDRANT_URL || "http://127.0.0.1:6333",

  pythonAgentUrl: process.env.PYTHON_AGENT_URL || "http://127.0.0.1:8100",
  pythonImageUrl: process.env.PYTHON_IMAGE_URL || "http://127.0.0.1:8200",
  pythonIngestUrl: process.env.PYTHON_INGEST_URL || "http://127.0.0.1:8300",
  pythonImageEditorUrl:
    process.env.PYTHON_IMAGE_EDITOR_URL || "http://127.0.0.1:8010",
  imageStudioWorkerUrl:
    process.env.IMAGE_STUDIO_WORKER_URL || "http://127.0.0.1:8400",

  videoStudioWorkerUrl:
    process.env.VIDEO_STUDIO_WORKER_URL || "http://127.0.0.1:8500",
  videoStudioWorkerTimeoutMs: toNumber(
    process.env.VIDEO_STUDIO_WORKER_TIMEOUT_MS,
    1200000
  ),
  videoStudioWorkerConcurrency: toNumber(
    process.env.VIDEO_STUDIO_WORKER_CONCURRENCY,
    1
  ),
  videoUploadSignedUrlTtl: toNumber(
    process.env.VIDEO_UPLOAD_SIGNED_URL_TTL,
    600
  ),

  serperApiKey: process.env.SERPER_API_KEY || "",
  maxSearchResults: toNumber(process.env.MAX_SEARCH_RESULTS, 2),
  maxPageChars: toNumber(process.env.MAX_PAGE_CHARS, 1000),

  imageDefaultModel: process.env.IMAGE_DEFAULT_MODEL || "realvisxl",
  imageDefaultWidth: toNumber(process.env.IMAGE_DEFAULT_WIDTH, 1024),
  imageDefaultHeight: toNumber(process.env.IMAGE_DEFAULT_HEIGHT, 1024),
  imageDefaultSteps: toNumber(process.env.IMAGE_DEFAULT_STEPS, 30),
  imageDefaultGuidance: Number(process.env.IMAGE_DEFAULT_GUIDANCE || 6),
  imageDefaultQuality: process.env.IMAGE_DEFAULT_QUALITY || "high",

  imageMaxWidth: toNumber(process.env.IMAGE_MAX_WIDTH, 1024),
  imageMaxHeight: toNumber(process.env.IMAGE_MAX_HEIGHT, 1024),
  imageMaxSteps: toNumber(process.env.IMAGE_MAX_STEPS, 50),
  imageFastMaxSteps: toNumber(process.env.IMAGE_FAST_MAX_STEPS, 20),

  imageEditorBucket: process.env.IMAGE_EDITOR_BUCKET || "image-editor",
  imageEditorSignedUrlExpires: toNumber(
    process.env.IMAGE_EDITOR_SIGNED_URL_EXPIRES,
    3600
  ),
};